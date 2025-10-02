import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, ArrowLeft, Loader2, Search, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ComparablesAnalysis = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [builderId, setBuilderId] = useState<string>('');
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [allProperties, setAllProperties] = useState<any[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  
  // Search criteria state
  const [searchType, setSearchType] = useState<'subdivision' | 'radius' | 'zip_code'>('subdivision');
  const [subdivisionName, setSubdivisionName] = useState('Taramore');
  const [city, setCity] = useState('Brentwood');
  const [state, setState] = useState('TN');
  const [zipCode, setZipCode] = useState('');
  const [radius, setRadius] = useState('1');
  const [propertyAddress, setPropertyAddress] = useState('');
  const [timePeriod, setTimePeriod] = useState('180'); // days

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

    // Validate search criteria
    if (searchType === 'subdivision' && (!subdivisionName || !city || !state)) {
      toast({
        title: 'Missing information',
        description: 'Please enter subdivision name, city, and state',
        variant: 'destructive'
      });
      return;
    }
    if (searchType === 'radius' && !propertyAddress) {
      toast({
        title: 'Missing information',
        description: 'Please enter a property address for radius search',
        variant: 'destructive'
      });
      return;
    }
    if (searchType === 'zip_code' && !zipCode) {
      toast({
        title: 'Missing information',
        description: 'Please enter a zip code',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    const createdCampaigns: any[] = [];
    const fetchedProperties: any[] = [];

    try {
      // Build search parameters
      let searchParams: any = {};
      let campaignName = '';
      
      if (searchType === 'subdivision') {
        searchParams = { subdivisionName, city, state };
        campaignName = `${subdivisionName}, ${city} - Last ${timePeriod} days`;
      } else if (searchType === 'radius') {
        searchParams = { address: propertyAddress, radius };
        campaignName = `Within ${radius}mi of ${propertyAddress} - Last ${timePeriod} days`;
      } else if (searchType === 'zip_code') {
        searchParams = { zipCode };
        campaignName = `ZIP ${zipCode} - Last ${timePeriod} days`;
      }

      // STEP 1: Fetch properties
      toast({
        title: 'Step 1/2: Fetching comparables...',
        description: campaignName
      });

      // Create campaign
      const { data: campaign, error: campaignError } = await supabase
        .from('property_search_campaigns')
        .insert({
          builder_id: builderId,
          campaign_name: campaignName,
          search_type: searchType,
          search_parameters: { ...searchParams, timePeriod },
          status: 'running'
        })
        .select()
        .single();

      if (campaignError) throw campaignError;
      createdCampaigns.push(campaign);

      // Fetch listings
      const { data, error } = await supabase.functions.invoke('fetch-property-listings', {
        body: {
          searchType,
          searchParams: { ...searchParams, timePeriod },
          campaignId: campaign.id,
          useMock: false  // Use real API data
        }
      });

      if (error) {
        console.error('Error fetching properties:', error);
        throw error;
      }

      toast({
        title: `Found properties`,
        description: `${data.propertiesFound} listings with photos`
      });

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
            <CardTitle>Search Comparable Properties</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              Define your search criteria to find relevant comparable properties. 
              The system will fetch real listing data, photos, and run AI analysis.
            </p>

            {/* Search Criteria */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Search Type</Label>
                  <Select value={searchType} onValueChange={(val: any) => setSearchType(val)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="subdivision">Subdivision/Neighborhood</SelectItem>
                      <SelectItem value="radius">Radius from Address</SelectItem>
                      <SelectItem value="zip_code">Zip Code</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Time Period (Last X Days)</Label>
                  <Select value={timePeriod} onValueChange={setTimePeriod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 Days</SelectItem>
                      <SelectItem value="60">60 Days</SelectItem>
                      <SelectItem value="90">90 Days</SelectItem>
                      <SelectItem value="180">6 Months</SelectItem>
                      <SelectItem value="365">1 Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Conditional Search Parameters */}
              {searchType === 'subdivision' && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Subdivision Name</Label>
                    <Input 
                      value={subdivisionName} 
                      onChange={(e) => setSubdivisionName(e.target.value)}
                      placeholder="e.g., Taramore"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input 
                      value={city} 
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g., Brentwood"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>State</Label>
                    <Input 
                      value={state} 
                      onChange={(e) => setState(e.target.value)}
                      placeholder="e.g., TN"
                      maxLength={2}
                    />
                  </div>
                </div>
              )}

              {searchType === 'radius' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Property Address</Label>
                    <Input 
                      value={propertyAddress} 
                      onChange={(e) => setPropertyAddress(e.target.value)}
                      placeholder="123 Main St, City, State"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Radius (miles)</Label>
                    <Select value={radius} onValueChange={setRadius}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0.5">0.5 miles</SelectItem>
                        <SelectItem value="1">1 mile</SelectItem>
                        <SelectItem value="2">2 miles</SelectItem>
                        <SelectItem value="3">3 miles</SelectItem>
                        <SelectItem value="5">5 miles</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {searchType === 'zip_code' && (
                <div className="space-y-2">
                  <Label>Zip Code</Label>
                  <Input 
                    value={zipCode} 
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="e.g., 37027"
                    maxLength={5}
                  />
                </div>
              )}
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

                      {property.listing_data?.price && (
                        <div className="bg-muted/50 rounded-lg p-3">
                          <p className="text-sm font-semibold">
                            Sale Price: ${property.listing_data.price.toLocaleString()}
                          </p>
                          {property.listing_data.beds && (
                            <p className="text-sm text-muted-foreground">
                              {property.listing_data.beds} beds • {property.listing_data.baths} baths
                            </p>
                          )}
                        </div>
                      )}

                      {property.analysis_summary && (
                        <div className="bg-primary/5 rounded-lg p-4 space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">AI Analysis Results</h4>
                            <p className="text-sm text-muted-foreground">
                              Photos Analyzed: {property.analysis_summary.total_photos_analyzed}
                            </p>
                          </div>

                          {/* Overall Summary */}
                          {property.analysis_summary.overall_summary && (
                            <div className="space-y-2">
                              <h5 className="text-sm font-semibold">Overall Assessment</h5>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <span className="text-muted-foreground">Renovation Quality:</span>
                                  <Badge className="ml-2" variant="outline">
                                    {property.analysis_summary.overall_summary.dominant_quality || 'N/A'}
                                  </Badge>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Estimated Value Impact:</span>
                                  <span className="ml-2 font-semibold">
                                    {property.analysis_summary.overall_summary.value_impact_range || 'N/A'}
                                  </span>
                                </div>
                              </div>
                              {property.analysis_summary.overall_summary.key_upgrades && (
                                <div>
                                  <p className="text-sm font-medium">Key Upgrades Completed:</p>
                                  <ul className="text-sm text-muted-foreground list-disc list-inside">
                                    {property.analysis_summary.overall_summary.key_upgrades.map((upgrade: string, i: number) => (
                                      <li key={i}>{upgrade}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Photo-by-Photo Analysis */}
                          {property.analysis_summary.analyses && property.analysis_summary.analyses.length > 0 && (
                            <div>
                              <h5 className="text-sm font-semibold mb-2">Detailed Photo Analysis</h5>
                              <div className="max-h-96 overflow-y-auto space-y-3">
                                {property.analysis_summary.analyses.map((analysis: any, idx: number) => (
                                  <div key={idx} className="bg-background rounded p-3 space-y-2">
                                    <div className="flex items-center gap-2">
                                      <p className="text-xs font-medium">Photo {idx + 1}</p>
                                      {analysis.room_type && (
                                        <Badge variant="secondary" className="text-xs">
                                          {analysis.room_type}
                                        </Badge>
                                      )}
                                    </div>
                                    
                                    {analysis.renovation_quality && (
                                      <div className="text-xs">
                                        <span className="font-medium">Quality:</span> {analysis.renovation_quality}
                                      </div>
                                    )}
                                    
                                    {analysis.materials && analysis.materials.length > 0 && (
                                      <div className="text-xs">
                                        <span className="font-medium">Materials:</span> {analysis.materials.join(', ')}
                                      </div>
                                    )}
                                    
                                    {analysis.value_impact && (
                                      <div className="text-xs">
                                        <span className="font-medium">Value Impact:</span> {analysis.value_impact}
                                      </div>
                                    )}
                                    
                                    {analysis.analysis && (
                                      <p className="text-xs text-muted-foreground whitespace-pre-wrap">
                                        {analysis.analysis}
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
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
