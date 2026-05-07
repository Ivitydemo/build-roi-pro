import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Mail, Download, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

/* ─── helpers ─── */
const fmt$ = (n: number) =>
  '$' + Math.round(n).toLocaleString('en-US');

const getPropMetrics = (prop: any) => {
  const ld = prop.listing_data as any ?? {};
  const price  = Number(ld.price ?? ld.sold_price ?? 0);
  const sqft   = Number(ld.sqft ?? ld.square_feet ?? ld.squareFeet ?? ld.living_area ?? 0);
  const ppsf   = sqft > 0 ? Math.round(price / sqft) : 0;
  const beds   = ld.beds ?? ld.bedrooms ?? null;
  const baths  = ld.baths ?? ld.bathrooms ?? null;
  const sold   = ld.sold_date ?? ld.soldDate ?? null;
  return { price, sqft, ppsf, beds, baths, sold };
};

const helocIO   = (amt: number, rate = 0.085) => Math.round(amt * rate / 12);
const heloc15yr = (amt: number, rate = 0.085) => {
  const r = rate / 12;
  const n = 180;
  return Math.round(amt * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1));
};

const GAIN_FRACTIONS = [0.25, 0.55, 0.80, 1.0];

/* ─── component ─── */
const ComparablesReport = () => {
  const location   = useLocation();
  const navigate   = useNavigate();
  const { user }   = useAuth();
  const { toast }  = useToast();
  const printRef   = useRef<HTMLDivElement>(null);

  /* URL state / search params */
  const sp = new URLSearchParams(location.search);
  const propertyIds: string[] = location.state?.propertyIds ?? sp.get('ids')?.split(',').filter(Boolean) ?? [];
  const subjectAddr: string   = location.state?.subjectAddress ?? sp.get('addr') ?? '';

  /* state */
  const [loading,         setLoading]         = useState(true);
  const [properties,      setProperties]      = useState<any[]>([]);
  const [packages,        setPackages]        = useState<any[]>([]);
  const [partners,        setPartners]        = useState<any[]>([]);
  const [builderProfile,  setBuilderProfile]  = useState<any>(null);
  const [sqft,            setSqft]            = useState(0);
  const [sqftInput,       setSqftInput]       = useState('');
  const [showEmailModal,  setShowEmailModal]  = useState(false);
  const [emailAddr,       setEmailAddr]       = useState('');
  const [sending,         setSending]         = useState(false);
  const [exportOpen,      setExportOpen]      = useState(false);
  const [intelOpen,       setIntelOpen]       = useState(false);

  /* ── load data ── */
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        /* builder profile */
        const { data: profile } = await supabase
          .from('builder_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        setBuilderProfile(profile);

        if (profile) {
          /* packages */
          const { data: pkgs } = await supabase
            .from('remodel_packages')
            .select('*')
            .eq('builder_id', profile.id)
            .eq('is_active', true)
            .order('package_order', { ascending: true });
          setPackages(pkgs ?? []);

          /* preferred partners (table may not have generated types) */
          try {
            const { data: pts } = await (supabase as any)
              .from('builder_preferred_partners')
              .select('*')
              .eq('builder_id', profile.id)
              .eq('is_active', true)
              .order('display_order', { ascending: true });
            setPartners(pts ?? []);
          } catch {
            /* table doesn't exist yet — no partners shown */
          }
        }

        /* targeted properties */
        if (propertyIds.length > 0) {
          const { data: props } = await supabase
            .from('targeted_properties')
            .select('*')
            .in('id', propertyIds);
          setProperties(props ?? []);
          /* infer sqft from avg of comps */
          const sqfts = (props ?? []).map(p => getPropMetrics(p).sqft).filter(Boolean);
          if (sqfts.length > 0) {
            const avg = Math.round(sqfts.reduce((a: number, b: number) => a + b, 0) / sqfts.length);
            setSqft(avg);
            setSqftInput(String(avg));
          }
        }
      } catch (err) {
        console.error('Error loading report data:', err);
        toast({ title: 'Load error', description: String(err), variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  /* ── derived market stats ── */
  const metrics    = properties.map(p => getPropMetrics(p));
  const validPpsf  = metrics.map(m => m.ppsf).filter(Boolean);
  const prices     = metrics.map(m => m.price).filter(Boolean);
  const maxPpsf    = validPpsf.length > 0 ? Math.max(...validPpsf)  : 0;
  const minPpsf    = validPpsf.length > 0 ? Math.min(...validPpsf)  : 0;
  const avgPpsf    = validPpsf.length > 0 ? Math.round(validPpsf.reduce((a, b) => a + b, 0) / validPpsf.length) : 0;
  const minPrice   = prices.length > 0    ? Math.min(...prices)     : 0;
  const maxPrice   = prices.length > 0    ? Math.max(...prices)     : 0;
  const avgPrice   = prices.length > 0    ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0;
  const ppsfGap    = maxPpsf - minPpsf;

  /* active sqft value */
  const activeSqft = sqft;
  const topEndValue = activeSqft > 0 && maxPpsf > 0 ? activeSqft * maxPpsf : 0;

  /* ── package rows ── */
  const pkgRows = packages.slice(0, 4).map((pkg, i) => {
    const idx      = Math.min(i, GAIN_FRACTIONS.length - 1);
    const loanAmt  = pkg.price_per_sqft && activeSqft > 0
      ? Math.round(pkg.price_per_sqft * activeSqft)
      : pkg.base_price ?? 0;
    const valueAdd = avgPrice > 0 && topEndValue > 0 && topEndValue > avgPrice
      ? Math.round((topEndValue - avgPrice) * GAIN_FRACTIONS[idx])
      : 0;
    const isTop    = idx === GAIN_FRACTIONS.length - 1;
    const afterReno = activeSqft > 0 && maxPpsf > 0
      ? isTop
        ? Math.round(topEndValue / 1000) * 1000
        : loanAmt > 0 && valueAdd > 0
          ? Math.round((avgPrice + valueAdd) / 1000) * 1000
          : null
      : null;
    return { pkg, loanAmt, valueAdd, afterReno, isTop };
  });

  /* ── email handler ── */
  const handleSend = async () => {
    if (!emailAddr.trim()) {
      toast({ title: 'Enter email', description: 'Please enter a recipient email', variant: 'destructive' });
      return;
    }
    setSending(true);
    try {
      const intel: string[] = [];
      if (ppsfGap > 20) intel.push(`$${ppsfGap}/sqft gap between lowest and highest comp — renovation quality is directly rewarded here`);
      if (maxPpsf > 0 && avgPpsf > 0) intel.push(`Top comps trade at $${maxPpsf}/sqft vs market avg of $${avgPpsf}/sqft`);
      if (topEndValue > 0 && avgPrice > 0) intel.push(`Full renovation upside: ${fmt$(topEndValue - avgPrice)} above current market average`);

      const { error } = await supabase.functions.invoke('send-comparables-report', {
        body: {
          to: emailAddr,
          subjectAddress: subjectAddr,
          properties: properties.map(p => ({
            address: p.address,
            city: p.city,
            state: p.state,
            ...getPropMetrics(p),
          })),
          market: { avgPpsf, minPrice, maxPrice, avgPrice, ppsfGap, count: properties.length },
          intel,
          sqft: activeSqft,
          maxPpsf,
          packages: pkgRows.map(r => ({
            name: r.pkg.package_name,
            loanAmt: r.loanAmt,
            valueAdd: r.valueAdd,
            afterReno: r.afterReno,
          })),
        },
      });
      if (error) throw error;
      toast({ title: 'Report sent!', description: `Sent to ${emailAddr}` });
      setShowEmailModal(false);
      setEmailAddr('');
    } catch (err: any) {
      toast({ title: 'Send failed', description: err.message ?? String(err), variant: 'destructive' });
    } finally {
      setSending(false);
    }
  };

  /* ── export HTML ── */
  const handleExportHTML = () => {
    const content = printRef.current?.innerHTML ?? '';
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Renovation ROI Report — ${subjectAddr}</title>
<style>body{font-family:system-ui,sans-serif;margin:0;padding:24px;background:#f8fafc;color:#0f172a}
table{border-collapse:collapse;width:100%}th,td{padding:10px 8px;text-align:right}th:first-child,td:first-child{text-align:left}
</style></head><body>${content}</body></html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `renovation-roi-report.html`;
    a.click();
    setExportOpen(false);
  };

  /* ── render ── */
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <Loader2 style={{ width: 48, height: 48, margin: '0 auto 16px', color: '#6366f1' }} className="animate-spin" />
          <p style={{ color: '#64748b' }}>Loading report…</p>
        </div>
      </div>
    );
  }

  const intel: string[] = [];
  if (ppsfGap > 20) intel.push(`$${ppsfGap}/sqft gap between lowest and highest comp — renovation quality is directly rewarded in this market`);
  if (maxPpsf > 0 && avgPpsf > 0) intel.push(`Top comps are trading at $${maxPpsf}/sqft vs the market average of $${avgPpsf}/sqft`);
  if (topEndValue > 0 && avgPrice > 0) intel.push(`Full renovation upside: ${fmt$(topEndValue - avgPrice)} above current market average`);
  if (properties.length >= 3) intel.push(`${properties.length} sold comps analyzed — enough data to support pricing with confidence`);

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8' }}>
      {/* ── Toolbar ── */}
      <div style={{ background: '#1e293b', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => navigate(-1)}
            style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 6, padding: '6px 10px', color: '#e2e8f0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}
          >
            <ArrowLeft size={14} /> Back
          </button>
          <span style={{ color: '#94a3b8', fontSize: 13, maxWidth: 320, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {subjectAddr || 'Renovation ROI Report'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setShowEmailModal(true)}
            style={{ background: '#6366f1', border: 'none', borderRadius: 6, padding: '7px 14px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600 }}
          >
            <Mail size={14} /> Email Report
          </button>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setExportOpen(o => !o)}
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, padding: '7px 12px', color: '#e2e8f0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontSize: 13 }}
            >
              <Download size={14} /> Export {exportOpen ? <ChevronUp size={12}/> : <ChevronDown size={12}/>}
            </button>
            {exportOpen && (
              <div style={{ position: 'absolute', right: 0, top: '110%', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, padding: 4, zIndex: 50, minWidth: 150 }}>
                <button
                  onClick={handleExportHTML}
                  style={{ display: 'block', width: '100%', textAlign: 'left', background: 'none', border: 'none', color: '#e2e8f0', padding: '8px 12px', cursor: 'pointer', fontSize: 13, borderRadius: 5 }}
                  onMouseOver={e => (e.currentTarget.style.background = '#334155')}
                  onMouseOut={e => (e.currentTarget.style.background = 'none')}
                >
                  Export as HTML
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Report body ── */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px' }} ref={printRef}>

        {/* Header card */}
        <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', borderRadius: 12, padding: '20px 24px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: '#60a5fa', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 3 }}>Powered by</div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: 17, letterSpacing: '-0.01em' }}>ValueBuilder Pro</div>
            <div style={{ color: '#4b72ab', fontSize: 11, marginTop: 2 }}>AI Renovation Intelligence</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Renovation ROI Analysis</div>
            <div style={{ color: '#e2e8f0', fontWeight: 700, fontSize: 14, marginTop: 2 }}>{subjectAddr || 'Subject Property'}</div>
            <div style={{ color: '#64748b', fontSize: 11, marginTop: 1 }}>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
          </div>
        </div>

        {/* Market Stats row */}
        {properties.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
            {[
              { label: 'Comps Analyzed', value: String(properties.length) },
              { label: 'Avg Sale Price',  value: avgPrice > 0 ? fmt$(avgPrice) : '—' },
              { label: 'Avg $/sqft',     value: avgPpsf > 0 ? `$${avgPpsf}` : '—' },
              { label: 'Top Comp $/sqft', value: maxPpsf > 0 ? `$${maxPpsf}` : '—', accent: true },
            ].map((s, i) => (
              <div key={i} style={{ background: s.accent ? 'linear-gradient(135deg,#312e81,#1e1b4b)' : '#fff', borderRadius: 8, padding: '12px 14px', border: s.accent ? '1px solid #4f46e5' : '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 9, color: s.accent ? '#a5b4fc' : '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: s.accent ? '#a5b4fc' : '#0f172a', lineHeight: 1 }}>{s.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* Comps table */}
        {properties.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 10, padding: '16px 18px', marginBottom: 20, border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Comparable Sales</div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  {['Address', 'Sold', 'Beds/Baths', 'Sale Price', '$/sqft'].map((h, i) => (
                    <th key={i} style={{ padding: '6px 6px', textAlign: i === 0 ? 'left' : 'right', fontSize: 9, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {properties.map((prop, i) => {
                  const m = getPropMetrics(prop);
                  return (
                    <tr key={prop.id} style={{ borderBottom: '1px solid #f8fafc', background: i % 2 === 0 ? '#fff' : '#fafbff' }}>
                      <td style={{ padding: '8px 6px', fontSize: 12, color: '#374151' }}>
                        {prop.address}
                        {prop.city ? <span style={{ color: '#94a3b8', marginLeft: 4 }}>{prop.city}, {prop.state}</span> : null}
                      </td>
                      <td style={{ padding: '8px 6px', textAlign: 'right', fontSize: 11, color: '#64748b' }}>
                        {m.sold ? new Date(m.sold).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }) : '—'}
                      </td>
                      <td style={{ padding: '8px 6px', textAlign: 'right', fontSize: 11, color: '#64748b' }}>
                        {m.beds != null && m.baths != null ? `${m.beds}bd / ${m.baths}ba` : '—'}
                      </td>
                      <td style={{ padding: '8px 6px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: '#0f172a' }}>
                        {m.price > 0 ? fmt$(m.price) : '—'}
                      </td>
                      <td style={{ padding: '8px 6px', textAlign: 'right', fontSize: 12, fontWeight: 700, color: m.ppsf === maxPpsf ? '#4f46e5' : '#374151' }}>
                        {m.ppsf > 0 ? `$${m.ppsf}` : '—'}
                        {m.ppsf === maxPpsf && <span style={{ fontSize: 8, marginLeft: 3, color: '#4f46e5' }}>▲ TOP</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Market Intel */}
        {intel.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 10, padding: '14px 18px', marginBottom: 20, border: '1px solid #e2e8f0' }}>
            <button
              onClick={() => setIntelOpen(o => !o)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, padding: 0, width: '100%' }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.06em', flex: 1, textAlign: 'left' }}>Market Intelligence</div>
              {intelOpen ? <ChevronUp size={14} color="#64748b" /> : <ChevronDown size={14} color="#64748b" />}
            </button>
            {intelOpen && (
              <ul style={{ marginTop: 10, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {intel.map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: '#374151' }}>
                    <span style={{ color: '#6366f1', fontWeight: 800, flexShrink: 0 }}>→</span>
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Sqft input */}
        {packages.length > 0 && (
          <div style={{ background: '#eff6ff', borderRadius: 10, padding: '14px 18px', marginBottom: 16, border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#1d4ed8', marginBottom: 2 }}>Subject Property Square Footage</div>
              <div style={{ fontSize: 11, color: '#3b82f6' }}>Enter your home's sqft to personalize financing estimates and after-reno values.</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="number"
                value={sqftInput}
                onChange={e => setSqftInput(e.target.value)}
                placeholder="e.g. 2400"
                style={{ width: 100, padding: '6px 10px', borderRadius: 6, border: '1px solid #93c5fd', fontSize: 13, fontWeight: 600, color: '#1e40af' }}
              />
              <button
                onClick={() => { const v = parseInt(sqftInput); if (v > 0) setSqft(v); }}
                style={{ background: '#1d4ed8', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
              >
                Update
              </button>
            </div>
            {activeSqft > 0 && <div style={{ fontSize: 11, color: '#2563eb', fontWeight: 600 }}>Using {activeSqft.toLocaleString()} sqft</div>}
          </div>
        )}

        {/* Hero callout */}
        {activeSqft > 0 && maxPpsf > 0 && (
          <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', border: '1px solid #3730a3', borderRadius: 10, padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 4 }}>Top-End Renovation Target</div>
              <div style={{ fontSize: 11, color: '#cbd5e1' }}>At {activeSqft.toLocaleString()} sqft × ${maxPpsf}/sqft (highest comp) — this home could be worth:</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#a5b4fc', lineHeight: 1, letterSpacing: '-0.03em' }}>{fmt$(topEndValue)}</div>
              <div style={{ fontSize: 10, color: '#6366f1', marginTop: 2 }}>after full renovation</div>
            </div>
          </div>
        )}

        {/* Package / HELOC table */}
        {packages.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 10, padding: '16px 18px', marginBottom: 20, border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Renovation Packages — HELOC Financing Analysis</div>
            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 14 }}>Interest rates shown at 8.5% APR. Payments are estimates only — consult a lender for exact terms.</div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                    {['Package', 'Scope', 'Loan Amt', 'IO/mo', '15yr/mo', 'Value Add', 'After-Reno Value'].map((h, i) => (
                      <th key={i} style={{ padding: '8px 8px', textAlign: i === 0 ? 'left' : 'right', fontSize: 10, fontWeight: 700, color: i === 6 ? '#4f46e5' : '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pkgRows.map(({ pkg, loanAmt, valueAdd, afterReno, isTop }, i) => (
                    <tr key={pkg.id} style={{ borderBottom: '1px solid #f1f5f9', background: isTop ? '#f5f3ff' : i % 2 === 0 ? '#fff' : '#fafbff' }}>
                      <td style={{ padding: '10px 8px', fontWeight: 700, fontSize: 13, color: isTop ? '#4f46e5' : '#0f172a' }}>
                        {pkg.package_name}
                        {isTop && <span style={{ marginLeft: 6, fontSize: 8, background: '#4f46e5', color: '#fff', borderRadius: 3, padding: '1px 5px', verticalAlign: 'middle' }}>TOP</span>}
                      </td>
                      <td style={{ padding: '10px 8px', textAlign: 'right', fontSize: 11, color: '#64748b', maxWidth: 180 }}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pkg.package_description ?? '—'}</div>
                      </td>
                      <td style={{ padding: '10px 8px', textAlign: 'right', fontSize: 13, fontWeight: 600, color: '#374151' }}>
                        {loanAmt > 0 ? fmt$(loanAmt) : '—'}
                      </td>
                      <td style={{ padding: '10px 8px', textAlign: 'right', fontSize: 12, color: '#64748b' }}>
                        {loanAmt > 0 ? fmt$(helocIO(loanAmt)) : '—'}
                      </td>
                      <td style={{ padding: '10px 8px', textAlign: 'right', fontSize: 12, color: '#64748b' }}>
                        {loanAmt > 0 ? fmt$(heloc15yr(loanAmt)) : '—'}
                      </td>
                      <td style={{ padding: '10px 8px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: valueAdd > 0 ? '#059669' : '#94a3b8' }}>
                        {valueAdd > 0 ? `+${fmt$(valueAdd)}` : '—'}
                      </td>
                      <td style={{ padding: '10px 8px', textAlign: 'right', fontWeight: 800, color: isTop ? '#4f46e5' : '#374151', fontSize: isTop ? 14 : 13 }}>
                        {afterReno ? fmt$(afterReno) : '—'}
                        {isTop && afterReno && activeSqft > 0 && maxPpsf > 0 && (
                          <div style={{ fontSize: 9, fontWeight: 600, color: '#6366f1', marginTop: 1 }}>{activeSqft.toLocaleString()} sqft × ${maxPpsf}/sqft</div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {activeSqft === 0 && (
              <div style={{ marginTop: 10, fontSize: 11, color: '#f59e0b', fontWeight: 600 }}>⚠ Enter subject property sqft above to see personalized financing & after-reno values.</div>
            )}
          </div>
        )}

        {/* Partner network */}
        {partners.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 10, padding: '16px 18px', marginBottom: 20, border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Preferred Partner Network</div>
            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 14 }}>These vendors are part of a curated partner network. Contact them directly for quotes and consultations.</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
              {partners.map((p: any, i: number) => (
                <div key={p.id ?? i} style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '12px 14px' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>{p.role ?? 'Partner'}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{p.name}</div>
                  {p.phone && <div style={{ fontSize: 11, color: '#64748b' }}>📞 {p.phone}</div>}
                  {p.email && <div style={{ fontSize: 11, color: '#64748b' }}>✉ {p.email}</div>}
                  {p.website && (
                    <div style={{ fontSize: 11, marginTop: 2 }}>
                      <a href={p.website.startsWith('http') ? p.website : `https://${p.website}`} target="_blank" rel="noreferrer" style={{ color: '#6366f1' }}>
                        {p.website.replace(/^https?:\/\//, '').replace(/^www\./, '')}
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: 'center', fontSize: 10, color: '#94a3b8', paddingTop: 12, borderTop: '1px solid #e2e8f0' }}>
          This report is for informational purposes only. Values are estimates based on comparable sales data. Consult a licensed real estate professional before making investment decisions.
          <br />Generated by <strong>ValueBuilder Pro</strong> · AI Renovation Intelligence
        </div>
      </div>

      {/* ── Email modal ── */}
      {showEmailModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 28, width: '100%', maxWidth: 420, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6, color: '#0f172a' }}>Email Report</h3>
            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>Send this renovation ROI analysis to your client.</p>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Recipient Email</label>
            <input
              type="email"
              value={emailAddr}
              onChange={e => setEmailAddr(e.target.value)}
              placeholder="client@email.com"
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              style={{ width: '100%', padding: '9px 12px', borderRadius: 7, border: '1px solid #cbd5e1', fontSize: 13, marginBottom: 16, boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                onClick={() => { setShowEmailModal(false); setEmailAddr(''); }}
                style={{ padding: '8px 16px', borderRadius: 7, border: '1px solid #e2e8f0', background: '#fff', fontSize: 13, cursor: 'pointer', color: '#374151' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                disabled={sending}
                style={{ padding: '8px 18px', borderRadius: 7, border: 'none', background: sending ? '#a5b4fc' : '#6366f1', color: '#fff', fontSize: 13, fontWeight: 600, cursor: sending ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                {sending ? <><Loader2 size={14} className="animate-spin" /> Sending…</> : <><Mail size={14} /> Send</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparablesReport;
