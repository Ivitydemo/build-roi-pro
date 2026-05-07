import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Mail, Download, ChevronDown, ChevronUp, Loader2, TrendingUp, Home, Zap, Sparkles } from 'lucide-react';

/* ══════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════ */
const fmt$ = (n: number) => '$' + Math.round(n).toLocaleString('en-US');
const fmtK = (n: number) => n >= 1000 ? `$${Math.round(n / 1000)}K` : fmt$(n);

const stripMd = (s: string) =>
  s.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1').replace(/#+\s/g, '').trim();

const extractBullets = (text: string, heading: string): string[] => {
  const idx = text.toLowerCase().indexOf(heading.toLowerCase());
  if (idx === -1) return [];
  // Skip past the heading and any trailing punctuation/whitespace
  let start = idx + heading.length;
  while (start < text.length && /[:*\s]/.test(text[start])) start++;
  const chunk = text.slice(start);
  return chunk
    // Split on: newlines, sentence boundaries, or " - " separators (like " - HIGH PRIORITY:")
    .split(/\n|\r|(?<=[.!?])\s+(?=[A-Z–-])|\s+[-–]\s+(?=[A-Z])/)
    .map(l => {
      const clean = stripMd(l.replace(/^[-–•*\d.)\s]+/, '').trim());
      // Strip "HIGH PRIORITY:" / "MEDIUM PRIORITY:" / "LOW PRIORITY:" prefixes — noisy in a curated list
      return clean.replace(/^(HIGH|MEDIUM|LOW)\s+PRIORITY:\s*/i, '').trim();
    })
    .filter(l => l.length > 15 && l.length < 300 && !/^builder\s+takeaways/i.test(l) && !l.match(/^[A-Za-z\s]+:$/) )
    .slice(0, 5);
};

const getPropMetrics = (prop: any) => {
  const ld = prop.listing_data as any ?? {};
  const desc = ld.description ?? {};
  const price = Number(ld.price ?? ld.sold_price ?? ld.list_price ?? ld.last_sold_price ?? desc.sold_price ?? 0);
  const sqft  = Number(ld.sqft ?? ld.square_feet ?? ld.squareFeet ?? ld.living_area ?? desc.sqft ?? desc.square_feet ?? 0);
  const ppsf  = sqft > 0 ? Math.round(price / sqft) : 0;
  const beds  = ld.beds ?? ld.bedrooms ?? desc.beds ?? desc.bed_count ?? null;
  const bf    = Number(desc.baths_full ?? desc.baths_consolidated ?? 0);
  const bh    = Number(desc.baths_half ?? 0);
  // Sanity-cap: Realtor API sometimes returns nonsense (e.g. 20 baths); clamp to ≤10
  const rawBaths = ld.baths ?? ld.bathrooms ?? (bf > 0 ? bf + (bh > 0 ? 0.5 : 0) : null) ?? desc.baths ?? null;
  const baths = rawBaths != null && Number(rawBaths) <= 10 ? rawBaths : (bf > 0 && bf <= 10 ? bf + (bh > 0 ? 0.5 : 0) : null);
  const sold  = ld.sold_date ?? ld.soldDate ?? null;
  return { price, sqft, ppsf, beds, baths, sold };
};

const helocIO   = (amt: number, r = 0.085) => Math.round(amt * r / 12);
const heloc15yr = (amt: number, r = 0.085) => {
  const mr = r / 12; const n = 180;
  return Math.round(amt * mr * Math.pow(1 + mr, n) / (Math.pow(1 + mr, n) - 1));
};

const GAIN_FRACTIONS = [0.25, 0.55, 0.80, 1.0];

const QUALITY_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  'luxury':       { bg: '#faf5ff', text: '#6b21a8', dot: '#a855f7' },
  'high-end':     { bg: '#eff6ff', text: '#1d4ed8', dot: '#3b82f6' },
  'standard':     { bg: '#f0fdf4', text: '#15803d', dot: '#22c55e' },
  'below standard': { bg: '#fff7ed', text: '#c2410c', dot: '#f97316' },
  'partial renovation': { bg: '#f0fdf4', text: '#15803d', dot: '#22c55e' },
};
const qualityStyle = (q: string) =>
  QUALITY_COLORS[q?.toLowerCase()] ?? { bg: '#f8fafc', text: '#475569', dot: '#94a3b8' };

/* ══════════════════════════════════════════════
   DEMO DATA (shown at /comparables-report?demo=1)
══════════════════════════════════════════════ */
const DEMO_PROPERTIES = [
  {
    id: 'demo-1', address: '213 Vintage Cir', city: 'Hendersonville', state: 'TN', zip_code: '37075',
    analysis_status: 'completed',
    photo_urls: [],
    listing_data: { price: 534990, beds: 5, baths: 2.5, sqft: 2592, sold_date: '2025-09-15' },
    analysis_summary: {
      total_photos_analyzed: 6,
      overall_summary: {
        dominant_quality: 'Standard',
        value_impact_range: '$15K–$30K',
        key_upgrades: ['Hardwood Floors', 'Gas Fireplace', 'Kitchen Island', 'Open Floor Plan'],
      },
      analyses: [
        {
          room_type: 'Kitchen', renovation_quality: 'Standard', value_impact: '$8K–$12K',
          materials: ['Black granite', 'Shaker cabinets', 'Stainless dishwasher'],
          analysis: 'Builder Takeaways:\n- Two-tone gray cabinet refresh with granite counters — achieves updated look at moderate cost with strong ROI\n- Continuous hardwood through main level — justifies higher per-sqft pricing vs carpet competitors\n- Gas fireplace surround refresh — adds $5–8K perceived value under $3K investment',
        },
        {
          room_type: 'Living Room', renovation_quality: 'Standard', value_impact: '$5K–$8K',
          materials: ['Engineered hardwood', 'Neutral paint'], analysis: '',
        },
        {
          room_type: 'Bathrooms', renovation_quality: 'Below Standard', value_impact: '$10K–$18K',
          materials: ['Basic chrome fixtures', 'Builder-grade tile'],
          analysis: 'Builder Takeaways:\n- Fixture upgrade to matte black or brushed nickel — under $2K cost, high visual impact\n- Walk-in shower conversion in master — most requested buyer feature in this price range',
        },
      ],
    },
  },
  {
    id: 'demo-2', address: '512 Mantes Aly', city: 'Hendersonville', state: 'TN', zip_code: '37075',
    analysis_status: 'completed',
    photo_urls: [],
    listing_data: { price: 449900, beds: 4, baths: 3.5, sqft: 1940, sold_date: '2026-03-20' },
    analysis_summary: {
      total_photos_analyzed: 4,
      overall_summary: {
        dominant_quality: 'High-End',
        value_impact_range: '$35K–$55K',
        key_upgrades: ['Quartz Counters', 'Custom Cabinetry', 'Spa Master Bath', 'Wide-Plank Hardwood'],
      },
      analyses: [
        {
          room_type: 'Kitchen', renovation_quality: 'High-End', value_impact: '$20K–$30K',
          materials: ['Quartz waterfall edge', 'Custom white shaker', 'Thermador appliances'],
          analysis: 'Builder Takeaways:\n- Benchmark kitchen for this neighborhood — Thermador appliances command $15–20K buyer perception premium\n- Full matching stainless suite is non-negotiable at $400K+ price point\n- Quartz waterfall island is the single highest-ROI feature to replicate',
        },
        {
          room_type: 'Master Bath', renovation_quality: 'Luxury', value_impact: '$15K–$25K',
          materials: ['Marble tile', 'Freestanding tub', 'Frameless glass shower'],
          analysis: 'Builder Takeaways:\n- Freestanding soaking tub is the #1 requested feature in $400K+ buyer segment\n- Frameless glass shower enclosure adds perceived square footage without structural changes',
        },
      ],
    },
  },
  {
    id: 'demo-3', address: '216 Deerpoint Ct', city: 'Hendersonville', state: 'TN', zip_code: '37075',
    analysis_status: 'completed',
    photo_urls: [],
    listing_data: { price: 399000, beds: 3, baths: 2, sqft: 1820, sold_date: '2026-03-10' },
    analysis_summary: {
      total_photos_analyzed: 3,
      overall_summary: {
        dominant_quality: 'Standard',
        value_impact_range: '$8K–$20K',
        key_upgrades: ['New Roof', 'Updated HVAC', 'Fresh Exterior Paint', 'Landscaping'],
      },
      analyses: [
        {
          room_type: 'Kitchen', renovation_quality: 'Below Standard', value_impact: '$12K–$18K',
          materials: ['Laminate counters', 'Builder oak cabinets', 'Basic appliances'],
          analysis: 'Builder Takeaways:\n- Cabinet painting + hardware swap — highest-ROI quick-win; estimated $800 cost for $6K+ perceived value lift\n- Countertop replacement to quartz or butcher block — entry-level investment, major visual upgrade\n- This property represents the baseline; buyers see renovation opportunity, not move-in ready',
        },
        {
          room_type: 'Exterior', renovation_quality: 'Standard', value_impact: '$5K–$8K',
          materials: ['Vinyl siding', 'Attached garage', 'Mature trees'],
          analysis: 'Builder Takeaways:\n- Curb appeal is a strength — mature landscaping creates perceived value without investment\n- Garage door replacement ($1,200) returns highest percentage of any single exterior upgrade',
        },
      ],
    },
  },
];

const DEMO_PACKAGES = [
  { id: 'p1', package_name: 'Essential', package_description: 'Paint, fixtures, landscaping', base_price: 28000, price_per_sqft: null, package_order: 1 },
  { id: 'p2', package_name: 'Complete', package_description: 'Kitchen refresh, baths, flooring', base_price: 65000, price_per_sqft: null, package_order: 2 },
  { id: 'p3', package_name: 'Premium', package_description: 'Full kitchen & bath remodel', base_price: 110000, price_per_sqft: null, package_order: 3 },
  { id: 'p4', package_name: 'Luxury', package_description: 'Complete top-to-bottom renovation', base_price: 165000, price_per_sqft: null, package_order: 4 },
];

const DEMO_PARTNERS = [
  { id: 'pt1', name: 'First Federal Lending', role: 'HELOC Lender', phone: '(615) 555-0101', email: 'loans@firstfederal.com', website: 'firstfederal.com' },
  { id: 'pt2', name: 'Studio Noble Design', role: 'Interior Designer', phone: '(615) 555-0202', email: 'hello@studionoble.com', website: 'studionoble.com' },
  { id: 'pt3', name: 'Coates & Sons Flooring', role: 'Flooring Specialist', phone: '(615) 555-0303', email: 'quote@coatesflooring.com', website: 'coatesflooring.com' },
];

/* ══════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════ */
const ComparablesReport = () => {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { user }  = useAuth();
  const { toast } = useToast();
  const printRef  = useRef<HTMLDivElement>(null);

  const sp         = new URLSearchParams(location.search);
  const isDemo     = sp.get('demo') === '1';
  const propertyIds: string[] = location.state?.propertyIds ?? sp.get('ids')?.split(',').filter(Boolean) ?? [];
  const subjectAddr: string   = location.state?.subjectAddress ?? sp.get('addr') ?? (isDemo ? '117 Blue Ridge Dr, Hendersonville, TN 37075' : '');

  const [loading,        setLoading]        = useState(!isDemo);
  const [properties,     setProperties]     = useState<any[]>(isDemo ? DEMO_PROPERTIES : []);
  const [packages,       setPackages]       = useState<any[]>(isDemo ? DEMO_PACKAGES : []);
  const [partners,       setPartners]       = useState<any[]>(isDemo ? DEMO_PARTNERS : []);
  const [sqft,           setSqft]           = useState(isDemo ? 2200 : 0);
  const [sqftInput,      setSqftInput]      = useState(isDemo ? '2200' : '');
  const [showEmail,      setShowEmail]      = useState(false);
  const [emailAddr,      setEmailAddr]      = useState('');
  const [sending,        setSending]        = useState(false);
  const [exportOpen,     setExportOpen]     = useState(false);
  const [expandedComps,  setExpandedComps]  = useState<Set<string>>(new Set());

  /* ── load real data ── */
  useEffect(() => {
    if (isDemo || !user) { setLoading(false); return; }
    (async () => {
      try {
        const { data: profile } = await supabase.from('builder_profiles').select('*').eq('user_id', user.id).single();
        if (profile) {
          const { data: pkgs } = await supabase.from('remodel_packages').select('*').eq('builder_id', profile.id).eq('is_active', true).order('package_order', { ascending: true });
          setPackages(pkgs ?? []);
          try {
            const { data: pts } = await (supabase as any).from('builder_preferred_partners').select('*').eq('builder_id', profile.id).eq('is_active', true).order('display_order', { ascending: true });
            setPartners(pts ?? []);
          } catch { /* table may not exist */ }
        }
        if (propertyIds.length > 0) {
          const { data: props } = await supabase.from('targeted_properties').select('*').in('id', propertyIds);
          const loaded = props ?? [];
          setProperties(loaded);
          const sqfts = loaded.map(p => getPropMetrics(p).sqft).filter(Boolean);
          if (sqfts.length > 0) {
            const avg = Math.round(sqfts.reduce((a: number, b: number) => a + b, 0) / sqfts.length);
            setSqft(avg); setSqftInput(String(avg));
          }
        }
      } catch (err) {
        toast({ title: 'Load error', description: String(err), variant: 'destructive' });
      } finally { setLoading(false); }
    })();
  }, [user]);

  /* ── derived stats ── */
  const metrics   = properties.map(p => getPropMetrics(p));
  const validPpsf = metrics.map(m => m.ppsf).filter(Boolean);
  const prices    = metrics.map(m => m.price).filter(Boolean);
  const maxPpsf   = validPpsf.length ? Math.max(...validPpsf) : 0;
  const minPpsf   = validPpsf.length ? Math.min(...validPpsf) : 0;
  const avgPpsf   = validPpsf.length ? Math.round(validPpsf.reduce((a, b) => a + b, 0) / validPpsf.length) : 0;
  const avgPrice  = prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0;
  const maxPrice  = prices.length ? Math.max(...prices) : 0;
  const minPrice  = prices.length ? Math.min(...prices) : 0;
  const ppsfGap   = maxPpsf - minPpsf;
  const topEndVal = sqft > 0 && maxPpsf > 0 ? sqft * maxPpsf : 0;

  /* ── email ── */
  const handleSend = async () => {
    if (!emailAddr.trim()) { toast({ title: 'Enter an email address', variant: 'destructive' }); return; }
    setSending(true);
    try {
      const { error } = await supabase.functions.invoke('send-comparables-report', {
        body: { to: emailAddr, subjectAddress: subjectAddr, properties: properties.map(p => ({ address: p.address, city: p.city, state: p.state, ...getPropMetrics(p) })), market: { avgPpsf, minPrice, maxPrice, avgPrice, ppsfGap, count: properties.length }, sqft, maxPpsf },
      });
      if (error) throw error;
      toast({ title: 'Report sent!', description: `Delivered to ${emailAddr}` });
      setShowEmail(false); setEmailAddr('');
    } catch (err: any) {
      toast({ title: 'Send failed', description: err.message, variant: 'destructive' });
    } finally { setSending(false); }
  };

  /* ── export ── */
  const handleExportHTML = () => {
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Renovation ROI — ${subjectAddr}</title><style>body{font-family:system-ui,sans-serif;margin:0;padding:24px;background:#f8fafc;color:#0f172a}*{box-sizing:border-box}</style></head><body>${printRef.current?.innerHTML ?? ''}</body></html>`;
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([html], { type: 'text/html' })); a.download = 'roi-report.html'; a.click();
    setExportOpen(false);
  };

  /* ── loading ── */
  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
      <div style={{ textAlign: 'center' }}>
        <Loader2 style={{ width: 40, height: 40, color: '#6366f1', margin: '0 auto 12px' }} className="animate-spin" />
        <p style={{ color: '#64748b', fontSize: 14 }}>Building your report…</p>
      </div>
    </div>
  );

  /* ══ RENDER ══════════════════════════════════════ */
  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* ── Top bar ── */}
      <div style={{ background: '#0f172a', padding: '0 20px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, padding: '4px 0' }}>
            <ArrowLeft size={14} /> Back
          </button>
          <div style={{ width: 1, height: 20, background: '#1e293b' }} />
          <span style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 500, maxWidth: 380, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {subjectAddr || 'Renovation ROI Report'}
          </span>
          {isDemo && <span style={{ background: '#f59e0b', color: '#0f172a', fontSize: 10, fontWeight: 800, borderRadius: 4, padding: '2px 7px', letterSpacing: '0.06em' }}>DEMO</span>}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setShowEmail(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#6366f1', border: 'none', borderRadius: 7, padding: '7px 14px', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            <Mail size={13} /> Email Report
          </button>
          <div style={{ position: 'relative' }}>
            <button onClick={() => setExportOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#1e293b', border: '1px solid #334155', borderRadius: 7, padding: '7px 12px', color: '#94a3b8', fontSize: 13, cursor: 'pointer' }}>
              <Download size={13} /> {exportOpen ? <ChevronUp size={11}/> : <ChevronDown size={11}/>}
            </button>
            {exportOpen && (
              <div style={{ position: 'absolute', right: 0, top: '110%', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, padding: 4, zIndex: 50, minWidth: 140 }}>
                <button onClick={handleExportHTML} style={{ display: 'block', width: '100%', textAlign: 'left', background: 'none', border: 'none', color: '#e2e8f0', padding: '8px 12px', cursor: 'pointer', fontSize: 13, borderRadius: 5 }}
                  onMouseOver={e => (e.currentTarget.style.background = '#334155')} onMouseOut={e => (e.currentTarget.style.background = 'none')}>
                  Export as HTML
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Report ── */}
      <div style={{ maxWidth: 880, margin: '0 auto', padding: '28px 16px 60px' }} ref={printRef}>

        {/* ── HEADER ── */}
        <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', borderRadius: 14, padding: '24px 28px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: 10, color: '#60a5fa', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 4 }}>Powered by</div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: 20, letterSpacing: '-0.02em', lineHeight: 1 }}>ValueBuilder Pro</div>
            <div style={{ color: '#4b72ab', fontSize: 11, marginTop: 4 }}>AI Renovation Intelligence</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Renovation ROI Analysis</div>
            <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 15 }}>{subjectAddr || 'Subject Property'}</div>
            <div style={{ color: '#475569', fontSize: 11, marginTop: 3 }}>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
          </div>
        </div>

        {/* ── MARKET SNAPSHOT ── */}
        {properties.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 24 }}>
            {[
              { label: 'Comps Analyzed', value: String(properties.length), sub: 'sold properties' },
              { label: 'Avg Sale Price',  value: avgPrice > 0 ? fmt$(avgPrice) : '—', sub: `range ${minPrice > 0 ? fmtK(minPrice) : '—'}–${maxPrice > 0 ? fmtK(maxPrice) : '—'}` },
              { label: 'Avg $/sqft',     value: avgPpsf > 0 ? `$${avgPpsf}` : '—', sub: ppsfGap > 0 ? `$${ppsfGap} spread` : 'market rate' },
              { label: 'Top Comp $/sqft', value: maxPpsf > 0 ? `$${maxPpsf}` : '—', sub: 'renovation ceiling', accent: true },
            ].map((s, i) => (
              <div key={i} style={{ background: s.accent ? 'linear-gradient(135deg,#312e81,#1e1b4b)' : '#fff', borderRadius: 10, padding: '14px 16px', border: s.accent ? '1px solid #4338ca' : '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 9, color: s.accent ? '#818cf8' : '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>{s.label}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: s.accent ? '#a5b4fc' : '#0f172a', lineHeight: 1, letterSpacing: '-0.03em' }}>{s.value}</div>
                <div style={{ fontSize: 10, color: s.accent ? '#4f46e5' : '#94a3b8', marginTop: 4 }}>{s.sub}</div>
              </div>
            ))}
          </div>
        )}

        {/* ── COMPARABLE SALES ── */}
        {properties.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 12, marginBottom: 24, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Home size={15} color="#6366f1" />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Comparable Sales</span>
              <span style={{ fontSize: 11, color: '#94a3b8', marginLeft: 4 }}>sorted by $/sqft</span>
            </div>
            <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
              <colgroup>
                <col style={{ width: '34%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '14%' }} />
                <col style={{ width: '14%' }} />
                <col style={{ width: '13%' }} />
                <col style={{ width: '15%' }} />
              </colgroup>
              <thead>
                <tr style={{ background: '#fafafa' }}>
                  {['Address', 'Sold', 'Beds / Baths', 'Sale Price', '$/sqft', ''].map((h, i) => (
                    <th key={i} style={{ padding: '8px 16px', textAlign: i === 0 ? 'left' : i === 5 ? 'right' : 'right', fontSize: 9, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.09em', borderBottom: '1px solid #f1f5f9' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...properties].sort((a, b) => getPropMetrics(b).ppsf - getPropMetrics(a).ppsf).map((prop, i) => {
                  const m = getPropMetrics(prop);
                  const isTop = m.ppsf === maxPpsf && m.ppsf > 0;
                  const isOpen = expandedComps.has(prop.id);
                  const photos: string[] = prop.photo_urls ?? [];
                  const hasSummary = prop.analysis_status === 'completed' && prop.analysis_summary;
                  const hasDetails = photos.length > 0 || hasSummary;
                  const summary = prop.analysis_summary as any;
                  const overall = summary?.overall_summary ?? {};
                  const analyses: any[] = summary?.analyses ?? [];

                  return (
                    <>
                      {/* ── Main row ── */}
                      <tr key={prop.id} style={{ background: isTop ? '#fafbff' : 'transparent', borderBottom: isOpen ? 'none' : '1px solid #f8fafc' }}>
                        <td style={{ padding: '13px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{prop.address}</span>
                                {isTop && (
                                  <span style={{ fontSize: 9, fontWeight: 800, background: '#eef2ff', color: '#4f46e5', borderRadius: 4, padding: '2px 6px', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>▲ TOP</span>
                                )}
                              </div>
                              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>
                                {[prop.city, prop.state].filter(Boolean).join(', ')}
                                {m.sqft > 0 && <span style={{ color: '#cbd5e1' }}> · {m.sqft.toLocaleString()} sqft</span>}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '13px 16px', textAlign: 'right', fontSize: 12, color: '#64748b' }}>
                          {m.sold ? new Date(m.sold).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }) : '—'}
                        </td>
                        <td style={{ padding: '13px 16px', textAlign: 'right', fontSize: 12, color: '#64748b', whiteSpace: 'nowrap' }}>
                          {m.beds != null || m.baths != null ? `${m.beds ?? '?'} bd / ${m.baths ?? '?'} ba` : '—'}
                        </td>
                        <td style={{ padding: '13px 16px', textAlign: 'right', fontSize: 13, fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap' }}>
                          {m.price > 0 ? fmt$(m.price) : '—'}
                        </td>
                        <td style={{ padding: '13px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: isTop ? '#4f46e5' : '#374151' }}>{m.ppsf > 0 ? `$${m.ppsf}` : '—'}</span>
                            {m.ppsf > 0 && maxPpsf > 0 && (
                              <div style={{ width: 56, height: 3, borderRadius: 2, background: '#f1f5f9', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${Math.round((m.ppsf / maxPpsf) * 100)}%`, background: isTop ? '#6366f1' : '#94a3b8', borderRadius: 2, transition: 'width 0.3s ease' }} />
                              </div>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: '13px 16px', textAlign: 'right' }}>
                          {hasDetails ? (
                            <button
                              onClick={() => setExpandedComps(prev => { const s = new Set(prev); s.has(prop.id) ? s.delete(prop.id) : s.add(prop.id); return s; })}
                              style={{ fontSize: 11, fontWeight: 600, color: isOpen ? '#6366f1' : '#64748b', background: isOpen ? '#eef2ff' : '#f8fafc', border: `1px solid ${isOpen ? '#c7d2fe' : '#e2e8f0'}`, borderRadius: 6, padding: '4px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}
                            >
                              {isOpen ? <><ChevronUp size={11}/> Less</> : <><ChevronDown size={11}/> Details</>}
                            </button>
                          ) : prop.analysis_status === 'pending' ? (
                            <span style={{ fontSize: 10, color: '#94a3b8', fontStyle: 'italic' }}>Analysis pending</span>
                          ) : null}
                        </td>
                      </tr>

                      {/* ── Expanded panel ── */}
                      {isOpen && (
                        <tr key={`${prop.id}-exp`}>
                          <td colSpan={6} style={{ background: '#fafbff', borderBottom: '1px solid #f1f5f9', padding: '0 16px 20px', wordBreak: 'break-word', overflowWrap: 'break-word' }}>

                            {/* Photos */}
                            {photos.length > 0 && (
                              <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingTop: 14, paddingBottom: hasSummary ? 16 : 0, marginBottom: hasSummary ? 16 : 0, borderBottom: hasSummary ? '1px solid #e2e8f0' : 'none' }}>
                                {photos.slice(0, 10).map((url, pi) => (
                                  <img key={pi} src={url} alt="" style={{ width: 110, height: 78, objectFit: 'cover', borderRadius: 8, flexShrink: 0, background: '#e2e8f0' }}
                                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                ))}
                                {photos.length > 10 && (
                                  <div style={{ width: 110, height: 78, borderRadius: 8, background: '#e2e8f0', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#64748b', fontWeight: 600 }}>+{photos.length - 10}</div>
                                )}
                              </div>
                            )}

                            {/* AI Analysis */}
                            {hasSummary && (() => {
                              const allText = analyses.map((a: any) => a.analysis ?? '').join('\n');
                              const takeaways = extractBullets(allText, 'Builder Takeaways');
                              const qs = qualityStyle(overall.dominant_quality ?? '');

                              return (
                                <div style={{ paddingTop: photos.length > 0 ? 0 : 14 }}>
                                  {/* Quality row */}
                                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 14 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.08em', marginRight: 4 }}>
                                      <Sparkles size={11} color="#6366f1" /> AI Analysis
                                    </div>
                                    {overall.dominant_quality && (
                                      <span style={{ background: qs.bg, color: qs.text, borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}>
                                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: qs.dot, display: 'inline-block' }} />
                                        {overall.dominant_quality}
                                      </span>
                                    )}
                                    {overall.value_impact_range && (
                                      <span style={{ background: '#ecfdf5', color: '#065f46', borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 700 }}>
                                        {overall.value_impact_range} value impact
                                      </span>
                                    )}
                                    {overall.key_upgrades?.slice(0, 4).map((u: string, ui: number) => (
                                      <span key={ui} style={{ background: '#f1f5f9', color: '#475569', borderRadius: 6, padding: '4px 10px', fontSize: 11 }}>{u}</span>
                                    ))}
                                  </div>

                                  {/* Per-room chips */}
                                  {analyses.filter((a: any) => a.room_type).length > 0 && (
                                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: takeaways.length > 0 ? 14 : 0 }}>
                                      {analyses.filter((a: any) => a.room_type).map((a: any, ai: number) => {
                                        const rs = qualityStyle(a.renovation_quality ?? '');
                                        return (
                                          <div key={ai} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 12px', minWidth: 140 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                                              <span style={{ fontSize: 11, fontWeight: 700, color: '#0f172a', textTransform: 'capitalize' }}>{a.room_type}</span>
                                              {a.renovation_quality && (
                                                <span style={{ fontSize: 9, background: rs.bg, color: rs.text, borderRadius: 4, padding: '1px 5px', fontWeight: 600, textTransform: 'capitalize' }}>{a.renovation_quality}</span>
                                              )}
                                            </div>
                                            {a.value_impact && <div style={{ fontSize: 11, color: '#059669', fontWeight: 600, marginBottom: 2 }}>{a.value_impact}</div>}
                                            {Array.isArray(a.materials) && a.materials.length > 0 && (
                                              <div style={{ fontSize: 10, color: '#94a3b8' }}>{a.materials.slice(0, 3).join(' · ')}</div>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}

                                  {/* Builder takeaways */}
                                  {takeaways.length > 0 && (
                                    <div style={{ background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', border: '1px solid #fde68a', borderRadius: 10, padding: '14px 16px' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                                        <span style={{ fontSize: 14 }}>🔨</span>
                                        <span style={{ fontSize: 10, fontWeight: 800, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Builder Takeaways</span>
                                      </div>
                                      {takeaways.map((t: string, ti: number) => (
                                        <div key={ti} style={{ display: 'flex', gap: 9, fontSize: 12.5, color: '#78350f', marginBottom: ti < takeaways.length - 1 ? 8 : 0, lineHeight: 1.55 }}>
                                          <span style={{ color: '#d97706', flexShrink: 0, fontWeight: 700, marginTop: 1 }}>→</span>
                                          <span style={{ wordBreak: 'break-word', overflowWrap: 'break-word', minWidth: 0 }}>{t}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })()}
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
            </div>
          </div>
        )}

        {/* ── RENOVATION UPSIDE + SQFT INPUT ── */}
        {packages.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            {/* Sqft input row */}
            <div style={{ background: '#fff', borderRadius: 12, padding: '14px 20px', border: '1px solid #e2e8f0', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#0f172a', marginBottom: 2 }}>Subject Property Square Footage</div>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>Used to calculate personalized financing estimates and after-renovation values</div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input type="number" value={sqftInput} onChange={e => setSqftInput(e.target.value)}
                  placeholder="e.g. 2,400" style={{ width: 110, padding: '7px 11px', borderRadius: 7, border: '1px solid #e2e8f0', fontSize: 13, fontWeight: 600, color: '#0f172a', outline: 'none' }} />
                <button onClick={() => { const v = parseInt(sqftInput); if (v > 0) setSqft(v); }}
                  style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: 7, padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                  Update
                </button>
              </div>
              {sqft > 0 && <span style={{ fontSize: 12, color: '#6366f1', fontWeight: 600 }}>{sqft.toLocaleString()} sqft</span>}
            </div>

            {/* Hero callout */}
            {topEndVal > 0 && (
              <div style={{ background: 'linear-gradient(135deg,#312e81 0%,#1e1b4b 100%)', borderRadius: 12, padding: '18px 24px', marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, border: '1px solid #3730a3' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ background: 'rgba(99,102,241,0.2)', borderRadius: 8, padding: 8 }}>
                    <TrendingUp size={20} color="#a5b4fc" />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 3 }}>Full Renovation Target Value</div>
                    <div style={{ fontSize: 12, color: '#94a3b8' }}>{sqft.toLocaleString()} sqft × ${maxPpsf}/sqft (highest comp benchmark)</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#a5b4fc', lineHeight: 1, letterSpacing: '-0.04em' }}>{fmt$(topEndVal)}</div>
                  {avgPrice > 0 && <div style={{ fontSize: 11, color: '#6366f1', marginTop: 3 }}>+{fmt$(topEndVal - avgPrice)} above current avg</div>}
                </div>
              </div>
            )}

            {/* HELOC table */}
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Zap size={15} color="#6366f1" />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Renovation Packages & HELOC Financing</span>
                <span style={{ fontSize: 10, color: '#94a3b8', marginLeft: 'auto' }}>Rates est. at 8.5% APR</span>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 580 }}>
                  <thead>
                    <tr style={{ background: '#fafafa', borderBottom: '1px solid #f1f5f9' }}>
                      {['Package', 'Scope', 'Loan Amount', 'IO / mo', '15-yr / mo', 'Value Add', 'After-Reno Value'].map((h, i) => (
                        <th key={i} style={{ padding: '9px 16px', textAlign: i === 0 ? 'left' : 'right', fontSize: 9, fontWeight: 700, color: i === 6 ? '#4f46e5' : '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.09em', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {packages.slice(0, 4).map((pkg, i) => {
                      const idx = Math.min(i, GAIN_FRACTIONS.length - 1);
                      const loanAmt = pkg.price_per_sqft && sqft > 0 ? Math.round(pkg.price_per_sqft * sqft) : pkg.base_price ?? 0;
                      const valueAdd = avgPrice > 0 && topEndVal > avgPrice ? Math.round((topEndVal - avgPrice) * GAIN_FRACTIONS[idx]) : 0;
                      const isTop = idx === GAIN_FRACTIONS.length - 1;
                      const afterReno = sqft > 0 && maxPpsf > 0
                        ? isTop ? Math.round(topEndVal / 1000) * 1000
                        : loanAmt > 0 && valueAdd > 0 ? Math.round((avgPrice + valueAdd) / 1000) * 1000 : null
                        : null;
                      return (
                        <tr key={pkg.id} style={{ background: isTop ? '#fafbff' : 'transparent', borderBottom: i < packages.length - 1 ? '1px solid #f8fafc' : 'none' }}>
                          <td style={{ padding: '13px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontSize: 13, fontWeight: 700, color: isTop ? '#4f46e5' : '#0f172a' }}>{pkg.package_name}</span>
                              {isTop && <span style={{ fontSize: 9, fontWeight: 800, background: '#eef2ff', color: '#4f46e5', borderRadius: 4, padding: '2px 6px', letterSpacing: '0.05em' }}>BEST</span>}
                            </div>
                          </td>
                          <td style={{ padding: '13px 16px', textAlign: 'right', fontSize: 11, color: '#64748b', maxWidth: 160 }}>
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', whiteSpace: 'nowrap' }}>{pkg.package_description ?? '—'}</span>
                          </td>
                          <td style={{ padding: '13px 16px', textAlign: 'right', fontSize: 13, fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap' }}>{loanAmt > 0 ? fmt$(loanAmt) : '—'}</td>
                          <td style={{ padding: '13px 16px', textAlign: 'right', fontSize: 12, color: '#64748b', whiteSpace: 'nowrap' }}>{loanAmt > 0 ? fmt$(helocIO(loanAmt)) : '—'}</td>
                          <td style={{ padding: '13px 16px', textAlign: 'right', fontSize: 12, color: '#64748b', whiteSpace: 'nowrap' }}>{loanAmt > 0 ? fmt$(heloc15yr(loanAmt)) : '—'}</td>
                          <td style={{ padding: '13px 16px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: valueAdd > 0 ? '#059669' : '#94a3b8', whiteSpace: 'nowrap' }}>{valueAdd > 0 ? `+${fmt$(valueAdd)}` : '—'}</td>
                          <td style={{ padding: '13px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                            <span style={{ fontSize: isTop ? 15 : 13, fontWeight: 800, color: isTop ? '#4f46e5' : '#374151' }}>{afterReno ? fmt$(afterReno) : '—'}</span>
                            {isTop && afterReno && sqft > 0 && (
                              <div style={{ fontSize: 9, color: '#818cf8', marginTop: 2 }}>{sqft.toLocaleString()} sqft × ${maxPpsf}</div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── MARKET INTELLIGENCE ── */}
        {properties.length > 0 && (() => {
          const intel: { icon: string; text: string }[] = [];
          if (ppsfGap > 20) intel.push({ icon: '📊', text: `$${ppsfGap}/sqft gap between lowest and highest comp — renovation quality is directly rewarded in this market` });
          if (maxPpsf > 0 && avgPpsf > 0) intel.push({ icon: '🏆', text: `Top comps are trading at $${maxPpsf}/sqft vs the market average of $${avgPpsf}/sqft` });
          if (topEndVal > 0 && avgPrice > 0) intel.push({ icon: '💰', text: `Full renovation upside: ${fmt$(topEndVal - avgPrice)} above current market average` });
          if (properties.length >= 3) intel.push({ icon: '✅', text: `${properties.length} sold comps analyzed — sufficient data to support pricing with confidence` });
          if (intel.length === 0) return null;
          return (
            <div style={{ background: '#fff', borderRadius: 12, padding: '18px 20px', marginBottom: 24, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 14 }}>Market Intelligence</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {intel.map((item, ii) => (
                  <div key={ii} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 15, flexShrink: 0, lineHeight: 1.4 }}>{item.icon}</span>
                    <span style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* ── PREFERRED PARTNERS ── */}
        {partners.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 12, padding: '18px 20px', marginBottom: 24, border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>Preferred Partner Network</div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 16 }}>Curated vendors — contact directly for quotes and consultations</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 10 }}>
              {partners.map((p: any, i: number) => (
                <div key={p.id ?? i} style={{ border: '1px solid #e2e8f0', borderRadius: 9, padding: '12px 14px' }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>{p.role}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>{p.name}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {p.phone && <span style={{ fontSize: 11, color: '#64748b' }}>📞 {p.phone}</span>}
                    {p.email && <span style={{ fontSize: 11, color: '#64748b' }}>✉ {p.email}</span>}
                    {p.website && <a href={p.website.startsWith('http') ? p.website : `https://${p.website}`} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: '#6366f1', textDecoration: 'none' }}>🌐 {p.website.replace(/^https?:\/\/(www\.)?/, '')}</a>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── FOOTER ── */}
        <div style={{ textAlign: 'center', fontSize: 10, color: '#94a3b8', paddingTop: 4 }}>
          This report is for informational purposes only. Values are estimates based on comparable sales data and not a guarantee of future value. Consult a licensed real estate professional before making any investment decisions.
          <br /><br />
          <span style={{ color: '#cbd5e1', fontWeight: 600 }}>Generated by ValueBuilder Pro · AI Renovation Intelligence</span>
        </div>
      </div>

      {/* ── EMAIL MODAL ── */}
      {showEmail && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fff', borderRadius: 14, padding: 28, width: '100%', maxWidth: 400, boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}>
            <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 6, color: '#0f172a', margin: '0 0 6px' }}>Email this Report</h3>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>Send the full renovation ROI analysis to your client.</p>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Recipient Email</label>
            <input type="email" value={emailAddr} onChange={e => setEmailAddr(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="client@email.com" autoFocus
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: 14, marginBottom: 20, boxSizing: 'border-box', outline: 'none' }} />
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => { setShowEmail(false); setEmailAddr(''); }}
                style={{ padding: '9px 18px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', fontSize: 13, cursor: 'pointer', color: '#374151', fontWeight: 500 }}>
                Cancel
              </button>
              <button onClick={handleSend} disabled={sending}
                style={{ padding: '9px 20px', borderRadius: 8, border: 'none', background: sending ? '#a5b4fc' : '#6366f1', color: '#fff', fontSize: 13, fontWeight: 700, cursor: sending ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: 7 }}>
                {sending ? <><Loader2 size={14} className="animate-spin" /> Sending…</> : <><Mail size={14} /> Send Report</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparablesReport;
