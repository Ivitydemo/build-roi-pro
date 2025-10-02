import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, ArrowLeft, Loader2, Search, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const ComparablesAnalysis = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [builderId, setBuilderId] = useState<string>('');
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [allProperties, setAllProperties] = useState<any[]>([]);
  const [analyzing, setAnalyzing] = useState(false);

  const comparableAddresses = [
    '1825 Mallory Lane, Brentwood, TN',
    '205 Carriage House Ln, Brentwood, TN',
    '9301 Anson Way, Brentwood, TN',
    '308 Radnor Ct, Brentwood, TN'
  ];

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

  const fetchAndAnalyzeAll = async () => {
    if (!builderId) {
      toast({
        title: 'Profile required',
        description: 'Please complete your builder profile first',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    const createdCampaigns: any[] = [];
    const fetchedProperties: any[] = [];

    try {
      // STEP 1: Fetch all properties
      toast({
        title: 'Step 1/2: Fetching comparables...',
        description: `Searching for ${comparableAddresses.length} properties`
      });

      for (const address of comparableAddresses) {
        try {
          // Create campaign for this address
          const { data: campaign, error: campaignError } = await supabase
            .from('property_search_campaigns')
            .insert({
              builder_id: builderId,
              campaign_name: `Comparable: ${address}`,
              search_type: 'address',
              search_parameters: { address },
              status: 'running'
            })
            .select()
            .single();

          if (campaignError) throw campaignError;
          createdCampaigns.push(campaign);

          // Fetch listings for this address
          const { data, error } = await supabase.functions.invoke('fetch-property-listings', {
            body: {
              searchType: 'address',
              searchParams: { address },
              campaignId: campaign.id,
              useMock: true  // Use mock data for now
            }
          });

          if (error) {
            console.error(`Error fetching ${address}:`, error);
            continue;
          }

          toast({
            title: `Found property`,
            description: `${address} - ${data.propertiesFound} listings with photos`
          });

          // Small delay between requests
          await new Promise(resolve => setTimeout(resolve, 1000));

        } catch (error) {
          console.error(`Error processing ${address}:`, error);
        }
      }

      setCampaigns(createdCampaigns);

      // Load all properties from all campaigns
      const { data: properties, error: loadError } = await supabase
        .from('targeted_properties')
        .select('*')
        .in('campaign_id', createdCampaigns.map(c => c.id))
        .order('created_at', { ascending: false });

      if (loadError) throw loadError;
      
      const props = properties || [];
      setAllProperties(props);
      fetchedProperties.push(...props);

      if (fetchedProperties.length === 0) {
        toast({
          title: 'No properties found',
          description: 'Could not find listings for the comparable addresses',
          variant: 'destructive'
        });
        setLoading(false);
        return;
      }

      // STEP 2: Analyze all properties automatically
      toast({
        title: 'Step 2/2: Analyzing properties...',
        description: `Running AI analysis on ${fetchedProperties.length} properties`
      });

      let analyzed = 0;
      for (const property of fetchedProperties) {
        if (property.analysis_status !== 'pending') continue;

        toast({
          title: `Analyzing ${analyzed + 1}/${fetchedProperties.length}`,
          description: property.address
        });

        const { error } = await supabase.functions.invoke('analyze-targeted-properties', {
          body: { propertyId: property.id }
        });

        if (error) {
          console.error(`Error analyzing ${property.address}:`, error);
        } else {
          analyzed++;
        }

        // Wait between analyses to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 3000));
      }

      // Reload properties to get updated analysis
      await loadAllProperties(createdCampaigns.map(c => c.id));

      toast({
        title: 'Complete! 🎉',
        description: `Successfully fetched and analyzed ${analyzed} properties`,
        duration: 5000
      });

    } catch (error) {
      console.error('Error in fetch and analyze:', error);
      toast({
        title: 'Process failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadAllProperties = async (campaignIds: string[]) => {
    try {
      const { data, error } = await supabase
        .from('targeted_properties')
        .select('*')
        .in('campaign_id', campaignIds)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAllProperties(data || []);
    } catch (error) {
      console.error('Error loading properties:', error);
    }
  };

  const exportAnalysisData = () => {
    const exportData = allProperties.map(prop => ({
      address: prop.address,
      city: prop.city,
      state: prop.state,
      photos: prop.photo_urls?.length || 0,
      analysis: prop.analysis_summary
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'comparables-analysis.json';
    a.click();
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
              <h1 className="text-xl font-bold">Real Comparables Analysis</h1>
              <p className="text-sm text-muted-foreground">
                Fetch and analyze actual listing data for all comparables
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Fetch Real Comparable Properties</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Click the button below to automatically fetch all comparable listings, 
              download real photos, and run AI analysis. This will take approximately 5-7 minutes.
            </p>

            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Properties to Analyze:</h3>
              <ul className="space-y-1 text-sm">
                {comparableAddresses.map((addr, idx) => (
                  <li key={idx}>• {addr}</li>
                ))}
              </ul>
            </div>

            {loading && (
              <div className="bg-primary/5 rounded-lg p-4 text-sm">
                <p className="font-medium mb-2">Progress:</p>
                <p className="text-muted-foreground">
                  Please wait while we fetch listings and analyze photos. 
                  You'll see updates as each property is processed.
                </p>
              </div>
            )}

            <div className="flex gap-4">
              <Button 
                onClick={fetchAndAnalyzeAll} 
                disabled={loading || !builderId}
                size="lg"
                className="text-base px-8"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-5 w-5" />
                    Fetch & Analyze All Comparables
                  </>
                )}
              </Button>

              {allProperties.length > 0 && (
                <Button 
                  onClick={exportAnalysisData}
                  variant="outline"
                  size="lg"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Export Data
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {allProperties.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Properties Found ({allProperties.length})</h2>
            <div className="grid grid-cols-1 gap-4">
              {allProperties.map((property) => (
                <Card key={property.id}>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{property.address}</h3>
                          <p className="text-sm text-muted-foreground">
                            {property.city}, {property.state} {property.zip_code}
                          </p>
                        </div>
                        <Badge variant={
                          property.analysis_status === 'completed' ? 'default' :
                          property.analysis_status === 'analyzing' ? 'secondary' :
                          property.analysis_status === 'failed' ? 'destructive' : 'outline'
                        }>
                          {property.analysis_status}
                        </Badge>
                      </div>

                      {property.photo_urls && property.photo_urls.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-2">
                            {property.photo_urls.length} photos available
                          </p>
                          <div className="grid grid-cols-4 gap-2">
                            {property.photo_urls.slice(0, 8).map((url: string, idx: number) => (
                              <img 
                                key={idx}
                                src={url}
                                alt={`Property photo ${idx + 1}`}
                                className="w-full h-32 object-cover rounded hover:scale-105 transition-transform"
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {property.analysis_summary && (
                        <div className="bg-primary/5 rounded-lg p-4">
                          <h4 className="font-semibold mb-2">AI Analysis Results</h4>
                          <div className="text-sm space-y-2">
                            <p>Photos Analyzed: {property.analysis_summary.total_photos_analyzed}</p>
                            {property.analysis_summary.analyses && property.analysis_summary.analyses.length > 0 && (
                              <div className="max-h-64 overflow-y-auto space-y-3 mt-3">
                                {property.analysis_summary.analyses.map((analysis: any, idx: number) => (
                                  <div key={idx} className="bg-background rounded p-3">
                                    <p className="text-xs text-muted-foreground mb-1">Photo {idx + 1}</p>
                                    <p className="text-xs whitespace-pre-wrap">{analysis.analysis}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ComparablesAnalysis;
