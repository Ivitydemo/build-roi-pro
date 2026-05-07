import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Building2, Plus, Trash2, Save, Loader2, GripVertical } from 'lucide-react';

/* ─── types ─── */
interface Partner {
  id?: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  website: string;
  display_order: number;
  is_active: boolean;
  _dirty?: boolean;
  _new?: boolean;
}

const ROLE_PRESETS = [
  'Mortgage Banker', 'HELOC Lender', 'Interior Designer', 'Architect',
  'Kitchen & Bath', 'Flooring Specialist', 'Appliance Supplier', 'Cabinetry',
  'General Contractor', 'Electrician', 'Plumber', 'HVAC',
  'Insurance Agent', 'Real Estate Attorney', 'Title Company',
  'Home Inspector', 'Stager',
];

function extractDomain(url: string): string | null {
  try {
    const u = new URL(url.startsWith('http') ? url : `https://${url}`);
    return u.hostname.replace(/^www\./, '');
  } catch { return null; }
}

/* ─── component ─── */
const BuilderSettings = () => {
  const navigate  = useNavigate();
  const { user }  = useAuth();
  const { toast } = useToast();

  const [loading,       setLoading]       = useState(true);
  const [saving,        setSaving]        = useState(false);
  const [builderId,     setBuilderId]     = useState<string>('');
  const [profile,       setProfile]       = useState({
    company_name:  '',
    contact_name:  '',
    phone:         '',
    email:         '',
    website:       '',
    license_number: '',
    service_area:  '',
  });
  const [partners,      setPartners]      = useState<Partner[]>([]);
  const [activeTab,     setActiveTab]     = useState<'profile' | 'partners'>('profile');

  /* ── scroll to #partners if hash present ── */
  useEffect(() => {
    if (window.location.hash === '#partners') setActiveTab('partners');
  }, []);

  /* ── load ── */
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const { data: bp } = await supabase
          .from('builder_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (bp) {
          setBuilderId(bp.id);
          setProfile({
            company_name:   bp.company_name   ?? '',
            contact_name:   bp.contact_name   ?? '',
            phone:          bp.phone          ?? '',
            email:          bp.email          ?? '',
            website:        bp.website        ?? '',
            license_number: bp.license_number ?? '',
            service_area:   bp.service_area   ?? '',
          });

          /* partners */
          try {
            const { data: pts } = await (supabase as any)
              .from('builder_preferred_partners')
              .select('*')
              .eq('builder_id', bp.id)
              .order('display_order', { ascending: true });
            setPartners(pts ?? []);
          } catch {
            /* table may not exist yet */
          }
        }
      } catch (err) {
        console.error('Error loading settings:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  /* ── save profile ── */
  const saveProfile = async () => {
    if (!builderId) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('builder_profiles')
        .update(profile)
        .eq('id', builderId);
      if (error) throw error;
      toast({ title: 'Profile saved' });
    } catch (err: any) {
      toast({ title: 'Save failed', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  /* ── add partner ── */
  const addPartner = () => {
    setPartners(prev => [
      ...prev,
      { name: '', role: ROLE_PRESETS[0], phone: '', email: '', website: '', display_order: prev.length + 1, is_active: true, _new: true, _dirty: true },
    ]);
  };

  /* ── update partner field ── */
  const updatePartner = (idx: number, field: keyof Partner, value: any) => {
    setPartners(prev => prev.map((p, i) => i === idx ? { ...p, [field]: value, _dirty: true } : p));
  };

  /* ── remove partner ── */
  const removePartner = (idx: number) => {
    setPartners(prev => prev.filter((_, i) => i !== idx));
  };

  /* ── save partners ── */
  const savePartners = async () => {
    if (!builderId) return;
    setSaving(true);
    let errored = 0;
    try {
      for (const p of partners) {
        if (!p._dirty) continue;
        const payload = {
          builder_id:    builderId,
          name:          p.name.trim(),
          role:          p.role.trim(),
          phone:         p.phone.trim(),
          email:         p.email.trim(),
          website:       p.website.trim(),
          display_order: p.display_order,
          is_active:     p.is_active,
        };
        if (p._new) {
          const { error } = await (supabase as any).from('builder_preferred_partners').insert(payload);
          if (error) { console.error(error); errored++; }
        } else if (p.id) {
          const { error } = await (supabase as any).from('builder_preferred_partners').update(payload).eq('id', p.id);
          if (error) { console.error(error); errored++; }
        }
      }
      if (errored) {
        toast({ title: `${errored} partner(s) failed to save`, description: 'The partner table may need to be created in Supabase first.', variant: 'destructive' });
      } else {
        toast({ title: 'Partners saved!' });
        /* refresh */
        const { data: pts } = await (supabase as any)
          .from('builder_preferred_partners')
          .select('*')
          .eq('builder_id', builderId)
          .order('display_order', { ascending: true });
        setPartners((pts ?? []).map((p: any) => ({ ...p, _dirty: false, _new: false })));
      }
    } catch (err: any) {
      toast({ title: 'Save failed', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  /* ── render ── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Building2 className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading settings…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Settings</h1>
            <p className="text-sm text-muted-foreground">Company profile and partner network</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Tab bar */}
        <div className="flex gap-1 bg-muted p-1 rounded-lg mb-8 w-fit">
          {(['profile', 'partners'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {tab === 'profile' ? 'Company Profile' : 'Preferred Partners'}
            </button>
          ))}
        </div>

        {/* ── Profile tab ── */}
        {activeTab === 'profile' && (
          <Card>
            <CardHeader>
              <CardTitle>Company Profile</CardTitle>
              <CardDescription>This info appears on your reports and client-facing materials.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input value={profile.company_name} onChange={e => setProfile(p => ({ ...p, company_name: e.target.value }))} placeholder="Acme Renovations" />
                </div>
                <div className="space-y-2">
                  <Label>Contact Name</Label>
                  <Input value={profile.contact_name} onChange={e => setProfile(p => ({ ...p, contact_name: e.target.value }))} placeholder="Jane Smith" />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} placeholder="(615) 555-1234" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} placeholder="hello@company.com" />
                </div>
                <div className="space-y-2">
                  <Label>Website</Label>
                  <Input value={profile.website} onChange={e => setProfile(p => ({ ...p, website: e.target.value }))} placeholder="https://yourcompany.com" />
                </div>
                <div className="space-y-2">
                  <Label>License Number</Label>
                  <Input value={profile.license_number} onChange={e => setProfile(p => ({ ...p, license_number: e.target.value }))} placeholder="TN-12345" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Service Area</Label>
                <Input value={profile.service_area} onChange={e => setProfile(p => ({ ...p, service_area: e.target.value }))} placeholder="Nashville, TN and surrounding counties" />
              </div>
              <Button onClick={saveProfile} disabled={saving} className="mt-2">
                {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving…</> : <><Save className="h-4 w-4 mr-2" /> Save Profile</>}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* ── Partners tab ── */}
        {activeTab === 'partners' && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Preferred Partner Network</CardTitle>
                <CardDescription>
                  These vendors appear on every client report. Add your trusted mortgage bankers, contractors, designers, and other service providers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {partners.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="mb-4">No partners yet. Add your first trusted vendor below.</p>
                  </div>
                ) : (
                  <div className="space-y-4 mb-4">
                    {partners.map((partner, idx) => (
                      <div key={idx} className="border rounded-lg p-4 space-y-3 bg-card">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <GripVertical className="h-4 w-4" />
                            <span className="text-sm font-medium">Partner {idx + 1}</span>
                            {partner._dirty && <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded">unsaved</span>}
                          </div>
                          <button
                            onClick={() => removePartner(idx)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label className="text-xs">Name *</Label>
                            <Input
                              value={partner.name}
                              onChange={e => updatePartner(idx, 'name', e.target.value)}
                              placeholder="John Smith"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Role</Label>
                            <div className="flex gap-2">
                              <Input
                                value={partner.role}
                                onChange={e => updatePartner(idx, 'role', e.target.value)}
                                placeholder="Mortgage Banker"
                                list={`role-presets-${idx}`}
                              />
                              <datalist id={`role-presets-${idx}`}>
                                {ROLE_PRESETS.map(r => <option key={r} value={r} />)}
                              </datalist>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Phone</Label>
                            <Input
                              value={partner.phone}
                              onChange={e => updatePartner(idx, 'phone', e.target.value)}
                              placeholder="(615) 555-1234"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Email</Label>
                            <Input
                              type="email"
                              value={partner.email}
                              onChange={e => updatePartner(idx, 'email', e.target.value)}
                              placeholder="partner@example.com"
                            />
                          </div>
                          <div className="space-y-1 sm:col-span-2">
                            <Label className="text-xs">Website</Label>
                            <Input
                              value={partner.website}
                              onChange={e => updatePartner(idx, 'website', e.target.value)}
                              placeholder="https://partnerwebsite.com"
                            />
                            {partner.website && extractDomain(partner.website) && (
                              <p className="text-xs text-muted-foreground">Will show as: {extractDomain(partner.website)}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`active-${idx}`}
                            checked={partner.is_active}
                            onChange={e => updatePartner(idx, 'is_active', e.target.checked)}
                            className="rounded"
                          />
                          <label htmlFor={`active-${idx}`} className="text-sm text-muted-foreground cursor-pointer">
                            Show on reports
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-3">
                  <Button variant="outline" onClick={addPartner} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Add Partner
                  </Button>
                  {partners.some(p => p._dirty) && (
                    <Button onClick={savePartners} disabled={saving}>
                      {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving…</> : <><Save className="h-4 w-4 mr-2" /> Save Partners</>}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default BuilderSettings;
