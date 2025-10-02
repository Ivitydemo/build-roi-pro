import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const PartnerLeads = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    lead_source: "",
    lead_type: "referral",
    homeowner_name: "",
    homeowner_email: "",
    homeowner_phone: "",
    property_address: "",
    estimated_project_value: "",
    notes: "",
  });

  useEffect(() => {
    checkPartnerProfile();
  }, []);

  useEffect(() => {
    if (partnerId) {
      fetchLeads();
    }
  }, [partnerId]);

  const checkPartnerProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }

    const { data } = await supabase
      .from("partners")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (data) {
      setPartnerId(data.id);
    } else {
      navigate("/partner-portal");
    }
  };

  const fetchLeads = async () => {
    if (!partnerId) return;

    const { data } = await supabase
      .from("partner_leads")
      .select("*")
      .eq("partner_id", partnerId)
      .order("created_at", { ascending: false });

    if (data) setLeads(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerId) return;

    setLoading(true);

    try {
      const { error } = await supabase.from("partner_leads").insert({
        partner_id: partnerId,
        lead_source: formData.lead_source,
        lead_type: formData.lead_type,
        homeowner_name: formData.homeowner_name,
        homeowner_email: formData.homeowner_email,
        homeowner_phone: formData.homeowner_phone,
        property_address: formData.property_address,
        estimated_project_value: parseFloat(formData.estimated_project_value) || null,
        notes: formData.notes,
      });

      if (error) throw error;

      toast({
        title: "Lead Submitted",
        description: "Your lead has been submitted successfully.",
      });

      setFormData({
        lead_source: "",
        lead_type: "referral",
        homeowner_name: "",
        homeowner_email: "",
        homeowner_phone: "",
        property_address: "",
        estimated_project_value: "",
        notes: "",
      });

      setShowForm(false);
      fetchLeads();
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

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      new: "default",
      contacted: "secondary",
      qualified: "secondary",
      converted: "default",
      lost: "destructive",
    };

    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/partner-portal")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold">Lead Management</h1>
              <p className="text-muted-foreground">Submit and track your referral leads</p>
            </div>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-2" />
            {showForm ? "View Leads" : "Submit New Lead"}
          </Button>
        </div>

        {showForm ? (
          <Card>
            <CardHeader>
              <CardTitle>Submit New Lead</CardTitle>
              <CardDescription>Enter the homeowner's information to submit a new lead</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="lead_source">Lead Source</Label>
                  <Input
                    id="lead_source"
                    placeholder="Website, Phone Call, Email, etc."
                    value={formData.lead_source}
                    onChange={(e) => setFormData({ ...formData, lead_source: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="lead_type">Lead Type</Label>
                  <Select
                    value={formData.lead_type}
                    onValueChange={(value) => setFormData({ ...formData, lead_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="referral">Referral</SelectItem>
                      <SelectItem value="inbound">Inbound</SelectItem>
                      <SelectItem value="outbound">Outbound</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="homeowner_name">Homeowner Name</Label>
                  <Input
                    id="homeowner_name"
                    value={formData.homeowner_name}
                    onChange={(e) => setFormData({ ...formData, homeowner_name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="homeowner_email">Homeowner Email</Label>
                  <Input
                    id="homeowner_email"
                    type="email"
                    value={formData.homeowner_email}
                    onChange={(e) => setFormData({ ...formData, homeowner_email: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="homeowner_phone">Homeowner Phone</Label>
                  <Input
                    id="homeowner_phone"
                    type="tel"
                    value={formData.homeowner_phone}
                    onChange={(e) => setFormData({ ...formData, homeowner_phone: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="property_address">Property Address</Label>
                  <Input
                    id="property_address"
                    value={formData.property_address}
                    onChange={(e) => setFormData({ ...formData, property_address: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="estimated_project_value">Estimated Project Value ($)</Label>
                  <Input
                    id="estimated_project_value"
                    type="number"
                    value={formData.estimated_project_value}
                    onChange={(e) => setFormData({ ...formData, estimated_project_value: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional information about the lead..."
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={loading}>
                    {loading ? "Submitting..." : "Submit Lead"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Your Leads</CardTitle>
              <CardDescription>Track the status of all your submitted leads</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Homeowner</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Est. Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Commission</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        No leads submitted yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    leads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="font-medium">{lead.homeowner_name}</TableCell>
                        <TableCell>{lead.property_address || "—"}</TableCell>
                        <TableCell>
                          {lead.estimated_project_value
                            ? `$${lead.estimated_project_value.toLocaleString()}`
                            : "—"}
                        </TableCell>
                        <TableCell>{getStatusBadge(lead.status)}</TableCell>
                        <TableCell>
                          {new Date(lead.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {lead.commission_amount
                            ? `$${lead.commission_amount.toLocaleString()}`
                            : "—"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PartnerLeads;
