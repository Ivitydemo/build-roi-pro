import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Download } from 'lucide-react';
import { toast } from 'sonner';

interface PartnerTier {
  id: string;
  tier_name: string;
  tier_level: number;
  conversion_fee_percentage: number;
  lead_fee_flat: number;
  min_monthly_leads: number;
  exclusive_territory: boolean;
  priority_support: boolean;
  co_marketing: boolean;
}

const PartnerComparison = () => {
  const navigate = useNavigate();
  const [tiers, setTiers] = useState<PartnerTier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTiers();
  }, []);

  const fetchTiers = async () => {
    try {
      const { data, error } = await supabase
        .from('partner_tiers')
        .select('*')
        .order('tier_level');

      if (error) throw error;
      setTiers(data || []);
    } catch (error) {
      console.error('Error fetching tiers:', error);
      toast.error('Failed to load partner tiers');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = [
      'Tier Name',
      'Level',
      'Conversion Fee %',
      'Lead Fee (Flat)',
      'Min Monthly Leads',
      'Exclusive Territory',
      'Priority Support',
      'Co-Marketing'
    ];

    const rows = tiers.map(tier => [
      tier.tier_name,
      tier.tier_level,
      `${tier.conversion_fee_percentage}%`,
      `$${tier.lead_fee_flat}`,
      tier.min_monthly_leads,
      tier.exclusive_territory ? 'Yes' : 'No',
      tier.priority_support ? 'Yes' : 'No',
      tier.co_marketing ? 'Yes' : 'No'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'partner-tiers-comparison.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Exported to CSV');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/partner-portal')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold">Partner Programs Comparison</h1>
          </div>
          <Button onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export to CSV
          </Button>
        </div>

        <Card className="p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tier Name</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Conversion Fee %</TableHead>
                  <TableHead>Lead Fee (Flat)</TableHead>
                  <TableHead>Min Monthly Leads</TableHead>
                  <TableHead>Exclusive Territory</TableHead>
                  <TableHead>Priority Support</TableHead>
                  <TableHead>Co-Marketing</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tiers.map((tier) => (
                  <TableRow key={tier.id}>
                    <TableCell className="font-medium">{tier.tier_name}</TableCell>
                    <TableCell>{tier.tier_level}</TableCell>
                    <TableCell>{tier.conversion_fee_percentage}%</TableCell>
                    <TableCell>${tier.lead_fee_flat}</TableCell>
                    <TableCell>{tier.min_monthly_leads}</TableCell>
                    <TableCell>{tier.exclusive_territory ? '✓' : '✗'}</TableCell>
                    <TableCell>{tier.priority_support ? '✓' : '✗'}</TableCell>
                    <TableCell>{tier.co_marketing ? '✓' : '✗'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-8 space-y-4">
            <h2 className="text-xl font-semibold">Monetization Model Breakdown</h2>
            <div className="grid gap-4">
              <Card className="p-4">
                <h3 className="font-semibold mb-2">Per-Lead Fee</h3>
                <p className="text-sm text-muted-foreground">Flat fee charged for each qualified lead submitted to the builder network</p>
              </Card>
              <Card className="p-4">
                <h3 className="font-semibold mb-2">Conversion Commission</h3>
                <p className="text-sm text-muted-foreground">Percentage of project value when a lead converts to a signed contract</p>
              </Card>
              <Card className="p-4">
                <h3 className="font-semibold mb-2">Minimum Monthly Commitment</h3>
                <p className="text-sm text-muted-foreground">Required number of leads to maintain tier status and benefits</p>
              </Card>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PartnerComparison;