import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Building2, TrendingUp, Users, DollarSign } from "lucide-react";

const PartnerPortal = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [hasPartnerProfile, setHasPartnerProfile] = useState(false);
  const [partnerData, setPartnerData] = useState<any>(null);
  const [tiers, setTiers] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    partner_type: "",
    company_name: "",
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    service_areas: "",
    specialties: "",
  });

  useEffect(() => {
    checkPartnerProfile();
    fetchTiers();
  }, []);

  const fetchTiers = async () => {
    const { data } = await supabase
      .from("partner_tiers")
      .select("*")
      .order("tier_level");
    
    if (data) setTiers(data);
  };

  const checkPartnerProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }

    const { data } = await supabase
      .from("partners")
      .select("*, tier:partner_tiers(*)")
      .eq("user_id", user.id)
      .single();

    if (data) {
      setHasPartnerProfile(true);
      setPartnerData(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("partners").insert({
        user_id: user.id,
        partner_type: formData.partner_type,
        company_name: formData.company_name,
        contact_name: formData.contact_name,
        contact_email: formData.contact_email,
        contact_phone: formData.contact_phone,
        service_areas: formData.service_areas.split(",").map(s => s.trim()),
        specialties: formData.specialties.split(",").map(s => s.trim()),
      });

      if (error) throw error;

      toast({
        title: "Application Submitted",
        description: "Your partner application has been submitted for review.",
      });

      checkPartnerProfile();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (hasPartnerProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Partner Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {partnerData?.company_name}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{partnerData?.total_leads_sent || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Conversions</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{partnerData?.total_conversions || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {partnerData?.conversion_rate ? `${partnerData.conversion_rate}%` : "0%"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Lifetime Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${partnerData?.lifetime_value?.toLocaleString() || 0}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Tier: {partnerData?.tier?.tier_name || "Bronze"}</CardTitle>
                <CardDescription>Current partner tier and benefits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Conversion Fee:</span>
                  <span className="font-semibold">{partnerData?.tier?.conversion_fee_percentage}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lead Fee:</span>
                  <span className="font-semibold">${partnerData?.tier?.lead_fee_flat}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Exclusive Territory:</span>
                  <span className="font-semibold">
                    {partnerData?.tier?.exclusive_territory ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Priority Support:</span>
                  <span className="font-semibold">
                    {partnerData?.tier?.priority_support ? "Yes" : "No"}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Partner Status</CardTitle>
                <CardDescription>Account information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-semibold capitalize">{partnerData?.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quality Score:</span>
                  <span className="font-semibold">{partnerData?.quality_score}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service Areas:</span>
                  <span className="font-semibold">{partnerData?.service_areas?.length || 0}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 flex gap-4">
            <Button onClick={() => navigate("/partner-leads")}>
              Submit New Lead
            </Button>
            <Button variant="outline" onClick={() => navigate("/partner-commissions")}>
              View Commissions
            </Button>
            <Button variant="outline" onClick={() => navigate("/partner-comparison")}>
              Compare Tiers
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Become a Partner</h1>
          <p className="text-xl text-muted-foreground">
            Join our network and start earning commissions by referring qualified leads
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {tiers.map((tier) => (
            <Card key={tier.id} className={tier.tier_level === 4 ? "border-primary" : ""}>
              <CardHeader>
                <CardTitle className="text-lg">{tier.tier_name}</CardTitle>
                <CardDescription className="text-2xl font-bold">
                  {tier.conversion_fee_percentage}%
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <div>Lead Fee: ${tier.lead_fee_flat}</div>
                <div>Min Leads/mo: {tier.min_monthly_leads}</div>
                {tier.exclusive_territory && <div className="text-primary">✓ Exclusive Territory</div>}
                {tier.priority_support && <div className="text-primary">✓ Priority Support</div>}
                {tier.co_marketing && <div className="text-primary">✓ Co-Marketing</div>}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Partner Application</CardTitle>
            <CardDescription>Fill out the form below to apply to our partner network</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="partner_type">Partner Type</Label>
                <Select
                  value={formData.partner_type}
                  onValueChange={(value) => setFormData({ ...formData, partner_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select partner type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lender">HELOC/Refinance Lender</SelectItem>
                    <SelectItem value="designer">Interior Designer</SelectItem>
                    <SelectItem value="appliance">Appliance Partner</SelectItem>
                    <SelectItem value="material">Material Supplier</SelectItem>
                    <SelectItem value="insurance">Insurance Specialist</SelectItem>
                    <SelectItem value="financing">Project Financing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="company_name">Company Name</Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="contact_name">Contact Name</Label>
                <Input
                  id="contact_name"
                  value={formData.contact_name}
                  onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="contact_email">Contact Email</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="contact_phone">Contact Phone</Label>
                <Input
                  id="contact_phone"
                  type="tel"
                  value={formData.contact_phone}
                  onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="service_areas">Service Areas (comma-separated)</Label>
                <Input
                  id="service_areas"
                  placeholder="New York, Los Angeles, Chicago"
                  value={formData.service_areas}
                  onChange={(e) => setFormData({ ...formData, service_areas: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="specialties">Specialties (comma-separated)</Label>
                <Textarea
                  id="specialties"
                  placeholder="Kitchen remodels, Bathroom renovations, Whole home"
                  value={formData.specialties}
                  onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Submitting..." : "Submit Application"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PartnerPortal;
