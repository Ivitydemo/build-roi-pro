import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Building2, ArrowLeft } from 'lucide-react';
import { PropertySearchCampaign } from '@/components/PropertySearchCampaign';
import { CampaignResults } from '@/components/CampaignResults';

const PropertyCampaigns = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [builderId, setBuilderId] = useState<string>('');

  // Get builder ID from profile
  useEffect(() => {
    if (user) {
      import('@/integrations/supabase/client').then(({ supabase }) => {
        supabase
          .from('builder_profiles')
          .select('id')
          .eq('user_id', user.id)
          .single()
          .then(({ data }) => {
            if (data) {
              setBuilderId(data.id);
            }
          });
      });
    }
  }, [user]);

  if (!builderId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Building2 className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Property Search Campaigns</h1>
              <p className="text-sm text-muted-foreground">
                Find and analyze properties automatically
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Search Form */}
          <div className="lg:col-span-1">
            <PropertySearchCampaign
              builderId={builderId}
              onCampaignCreated={() => setRefreshTrigger(prev => prev + 1)}
            />
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <h2 className="text-2xl font-bold">Your Campaigns</h2>
              <p className="text-muted-foreground">
                View and analyze properties from your search campaigns
              </p>
            </div>
            <CampaignResults builderId={builderId} refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default PropertyCampaigns;
