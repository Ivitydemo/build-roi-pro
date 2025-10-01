import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, DollarSign, TrendingUp, Clock } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const PartnerCommissions = () => {
  const navigate = useNavigate();
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [commissions, setCommissions] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total_pending: 0,
    total_paid: 0,
    total_earned: 0,
  });

  useEffect(() => {
    checkPartnerProfile();
  }, []);

  useEffect(() => {
    if (partnerId) {
      fetchCommissions();
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

  const fetchCommissions = async () => {
    if (!partnerId) return;

    const { data } = await supabase
      .from("partner_commissions")
      .select("*")
      .eq("partner_id", partnerId)
      .order("created_at", { ascending: false });

    if (data) {
      setCommissions(data);
      
      const pending = data
        .filter(c => c.status === "pending")
        .reduce((sum, c) => sum + Number(c.commission_amount), 0);
      
      const paid = data
        .filter(c => c.status === "paid")
        .reduce((sum, c) => sum + Number(c.commission_amount), 0);
      
      const total = data.reduce((sum, c) => sum + Number(c.commission_amount), 0);

      setStats({
        total_pending: pending,
        total_paid: paid,
        total_earned: total,
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "secondary",
      paid: "default",
      cancelled: "destructive",
    };

    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/partner-portal")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-4xl font-bold">Commission Tracking</h1>
            <p className="text-muted-foreground">View your earnings and payment history</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.total_earned.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.total_pending.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Paid Out</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.total_paid.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Commission History</CardTitle>
            <CardDescription>All your commission transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Paid Date</TableHead>
                  <TableHead>Payment Method</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {commissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No commissions yet
                    </TableCell>
                  </TableRow>
                ) : (
                  commissions.map((commission) => (
                    <TableRow key={commission.id}>
                      <TableCell className="font-medium capitalize">
                        {commission.commission_type}
                      </TableCell>
                      <TableCell className="font-semibold">
                        ${parseFloat(commission.commission_amount).toLocaleString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(commission.status)}</TableCell>
                      <TableCell>
                        {new Date(commission.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {commission.paid_at
                          ? new Date(commission.paid_at).toLocaleDateString()
                          : "—"}
                      </TableCell>
                      <TableCell className="capitalize">
                        {commission.payment_method || "—"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PartnerCommissions;
