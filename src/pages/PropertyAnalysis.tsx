import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, ArrowLeft, Loader2, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const PropertyAnalysis = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [builderId, setBuilderId] = useState<string>('');
  const [campaign, setCampaign] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [analyzing, setAnalyzing] = useState(false);

  const targetAddress = '1810 Ivy Crest Drive, Brentwood, TN';

  useEffect(() => {
    if (user) {
      loadBuilderProfile();
    }
  }, [user]);

  const loadBuilderProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('builder_profiles')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      if (data) {
        setBuilderId(data.id);
      }
    } catch (error) {
      console.error('Error loading builder profile:', error);
    }
  };

  const searchProperty = async () => {
    if (!builderId) {
      toast({
        title: 'Profile required',
        description: 'Please complete your builder profile first',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      // Create campaign
      const { data: newCampaign, error: campaignError } = await supabase
        .from('property_search_campaigns')
        .insert({
          builder_id: builderId,
          campaign_name: '1810 Ivy Crest Analysis',
          search_type: 'address',
          search_parameters: { address: targetAddress },
          status: 'running'
        })
        .select()
        .single();

      if (campaignError) throw campaignError;
      setCampaign(newCampaign);

      toast({
        title: 'Searching for property...',
        description: 'Fetching listing data and photos'
      });

      // Call edge function to fetch listings
      const { data, error } = await supabase.functions.invoke('fetch-property-listings', {
        body: {
          searchType: 'address',
          searchParams: { address: targetAddress },
          campaignId: newCampaign.id
        }
      });

      if (error) throw error;

      toast({
        title: 'Property found!',
        description: `Found ${data.propertiesFound} properties with photos`
      });

      // Load the properties
      await loadCampaignProperties(newCampaign.id);

    } catch (error) {
      console.error('Error searching property:', error);
      toast({
        title: 'Search failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCampaignProperties = async (campaignId: string) => {
    try {
      const { data, error } = await supabase
        .from('targeted_properties')
        .select('*')
        .eq('campaign_id', campaignId);

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error loading properties:', error);
    }
  };

  const analyzeAllProperties = async () => {
    if (properties.length === 0) return;

    setAnalyzing(true);

    try {
      for (const property of properties) {
        toast({
          title: 'Analyzing property',
          description: `Processing ${property.address}...`
        });

        const { error } = await supabase.functions.invoke('analyze-targeted-properties', {
          body: { propertyId: property.id }
        });

        if (error) throw error;

        // Wait between analyses to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      toast({
        title: 'Analysis complete!',
        description: 'All properties have been analyzed'
      });

      // Reload properties to get updated analysis
      if (campaign) {
        await loadCampaignProperties(campaign.id);
      }

    } catch (error) {
      console.error('Error analyzing properties:', error);
      toast({
        title: 'Analysis failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/demo/package')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Property Analysis</h1>
              <p className="text-sm text-muted-foreground">
                Real data for {targetAddress}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Fetch Real Property Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              This will search for the actual listing at <strong>{targetAddress}</strong>, 
              download the real photos, and run AI analysis to identify materials and value drivers.
            </p>

            <div className="flex gap-4">
              <Button 
                onClick={searchProperty} 
                disabled={loading || !builderId}
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-5 w-5" />
                    Fetch Property Data
                  </>
                )}
              </Button>

              {properties.length > 0 && (
                <Button 
                  onClick={analyzeAllProperties}
                  disabled={analyzing}
                  variant="outline"
                  size="lg"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Run AI Analysis'
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {properties.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Properties Found</h2>
            {properties.map((property) => (
              <Card key={property.id}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold">{property.address}</h3>
                      <p className="text-sm text-muted-foreground">
                        {property.city}, {property.state} {property.zip_code}
                      </p>
                    </div>

                    {property.photo_urls && property.photo_urls.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">
                          {property.photo_urls.length} photos available
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                          {property.photo_urls.slice(0, 6).map((url: string, idx: number) => (
                            <img 
                              key={idx}
                              src={url}
                              alt={`Property photo ${idx + 1}`}
                              className="w-full h-32 object-cover rounded"
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {property.analysis_summary && (
                      <div className="bg-primary/5 rounded-lg p-4">
                        <h4 className="font-semibold mb-2">Analysis Results</h4>
                        <pre className="text-xs whitespace-pre-wrap">
                          {JSON.stringify(property.analysis_summary, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default PropertyAnalysis;
