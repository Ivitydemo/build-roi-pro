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
  const [searchMode, setSearchMode] = useState<'radius' | 'neighborhood' | 'street' | 'zip'>('radius');
  const [subjectAddress, setSubjectAddress] = useState('');
  const [radius, setRadius] = useState('1');
  const [timePeriod, setTimePeriod] = useState('180'); // days
  const [neighborhood, setNeighborhood] = useState('');
  const [streetName, setStreetName] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [cityState, setCityState] = useState('');
  const [selectedPropertyIds, setSelectedPropertyIds] = useState<Set<string>>(new Set());

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

    // Validate based on search mode
    if (searchMode === 'radius' && !subjectAddress.trim()) {
      toast({
        title: 'Missing information',
        description: 'Please enter the subject property address',
        variant: 'destructive'
      });
      return;
    }
    if (searchMode === 'neighborhood' && !neighborhood.trim()) {
      toast({
        title: 'Missing information',
        description: 'Please enter the neighborhood name',
        variant: 'destructive'
      });
      return;
    }
    if (searchMode === 'street' && !streetName.trim()) {
      toast({
        title: 'Missing information',
        description: 'Please enter the street name',
        variant: 'destructive'
      });
      return;
    }
    if (searchMode === 'zip' && !zipCode.trim()) {
      toast({
        title: 'Missing information',
        description: 'Please enter the zip code',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    setSelectedPropertyIds(new Set()); // Clear previous selections
    const createdCampaigns: any[] = [];
    const fetchedProperties: any[] = [];

    try {
      // Build search params based on mode
      let searchParams: any = { timePeriod };
      let campaignName = '';
      
      if (searchMode === 'radius') {
        searchParams = { 
          address: subjectAddress, 
          radius,
          timePeriod
        };
        campaignName = `Within ${radius}mi of ${subjectAddress}`;
      } else if (searchMode === 'neighborhood') {
        searchParams = {
          neighborhood,
          cityState,
          timePeriod
        };
        campaignName = `${neighborhood} neighborhood${cityState ? `, ${cityState}` : ''}`;
      } else if (searchMode === 'street') {
        searchParams = {
          streetName,
          cityState,
          timePeriod
        };
        campaignName = `${streetName}${cityState ? `, ${cityState}` : ''}`;
      } else if (searchMode === 'zip') {
        searchParams = {
          zipCode,
          timePeriod
        };
        campaignName = `ZIP ${zipCode}`;
      }

      // STEP 1: Fetch properties with photos
      toast({
        title: 'Searching for comparable properties...',
        description: 'Finding recently sold homes with interior photos for analysis'
      });

      // Create campaign
      const { data: campaign, error: campaignError } = await supabase
        .from('property_search_campaigns')
        .insert({
        builder_id: builderId,
        campaign_name: campaignName,
        search_type: searchMode,
        search_parameters: searchParams,
        status: 'running'
        })
        .select()
        .single();

      if (campaignError) throw campaignError;
      createdCampaigns.push(campaign);

      // Fetch listings
      const { data, error } = await supabase.functions.invoke('fetch-property-listings', {
        body: {
          searchType: searchMode,
          searchParams,
          campaignId: campaign.id
        }
      });

      if (error) {
        console.error('Error fetching properties:', error);
        throw error;
      }

      toast({
        title: `Found ${data.propertiesFound} comparable properties`,
        description: 'Properties include interior photos for renovation analysis'
      });

      setCampaigns(createdCampaigns);

      // Load all properties from all campaigns
      const { data: properties, error: loadError } = await supabase
        .from('targeted_properties')
        .select('*')
        .in('campaign_id', createdCampaigns.map(c => c.id))
        .order('created_at', { ascending: false });

      if (loadError) throw loadError;
      
      const rawProps = properties || [];
      // Sort by distance (closest first). Null distances go to the end. Tie-breaker: most recent sold date first
      const sortedProps = [...rawProps].sort((a: any, b: any) => {
        const distA = (a.listing_data as any)?.distance_miles ?? 9999;
        const distB = (b.listing_data as any)?.distance_miles ?? 9999;
        if (distA !== distB) return distA - distB;
        const dateA = (a.listing_data as any)?.sold_date ? new Date((a.listing_data as any).sold_date).getTime() : 0;
        const dateB = (b.listing_data as any)?.sold_date ? new Date((b.listing_data as any).sold_date).getTime() : 0;
        return dateB - dateA;
      });
      
      setAllProperties(sortedProps);
      fetchedProperties.push(...sortedProps);

      if (sortedProps.length === 0) {
        toast({
          title: 'No properties found',
          description: 'No sold properties found nearby. Try increasing the radius or time period.',
          variant: 'destructive'
        });
        setLoading(false);
        return;
      }

      // Auto-select up to 4 comps, preferring those within last 90 days; only go outside 90 if necessary
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
      const within90 = sortedProps.filter((p: any) => {
        const sd = (p.listing_data as any)?.sold_date;
        return sd ? new Date(sd) >= ninetyDaysAgo : false;
      });
      const selection = (within90.length >= 4 ? within90.slice(0, 4) : sortedProps.slice(0, 4));
      const preselectCount = Math.min(4, selection.length);
      if (preselectCount >= 3) {
        const suggested = selection.slice(0, preselectCount).map((p: any) => p.id);
        setSelectedPropertyIds(new Set(suggested));
        toast({
          title: 'Closest comps selected',
          description: `${preselectCount} closest properties selected by distance${within90.length < 4 ? ' (included some beyond 90 days to reach 4)' : ''}.`
        });
      } else {
        toast({
          title: 'Need More Properties',
          description: `Only ${sortedProps.length} found. Try increasing radius or time period.`,
          variant: 'destructive'
        });
      }

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

  const togglePropertySelection = (propertyId: string) => {
    setSelectedPropertyIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(propertyId)) {
        newSet.delete(propertyId);
      } else {
        newSet.add(propertyId);
      }
      return newSet;
    });
  };

  const analyzeSelectedProperties = async () => {
    if (selectedPropertyIds.size < 3) {
      toast({
        title: 'Need more comps',
        description: 'Please select at least 3 comparable properties',
        variant: 'destructive'
      });
      return;
    }

    setAnalyzing(true);
    try {
      toast({
        title: 'Starting Photo & Renovation Analysis',
        description: `AI will examine interior photos from ${selectedPropertyIds.size} properties to identify materials, renovations, and value drivers`
      });

      let analyzed = 0;
      const selectedProps = allProperties.filter(p => selectedPropertyIds.has(p.id));
      
      for (const property of selectedProps) {
        if (property.analysis_status === 'completed') {
          analyzed++;
          continue;
        }

        toast({
          title: `Analyzing Property ${analyzed + 1}/${selectedProps.length}`,
          description: `Examining kitchen, bathroom, and interior photos for ${property.address}`
        });

        const { error } = await supabase.functions.invoke('analyze-targeted-properties', {
          body: { propertyId: property.id }
        });

        if (error) {
          console.error(`Error analyzing ${property.address}:`, error);
        } else {
          analyzed++;
        }

        await new Promise(resolve => setTimeout(resolve, 3000));
      }

      // Reload to get updated analysis
      await loadAllProperties(campaigns.map(c => c.id));

      toast({
        title: 'Photo Analysis Complete! 🎉',
        description: `Successfully analyzed ${analyzed} properties. Review renovation details and value drivers below.`,
        duration: 5000
      });
    } catch (error) {
      console.error('Error analyzing:', error);
      toast({
        title: 'Analysis failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const exportAnalysisData = () => {
    const selectedProps = allProperties.filter(p => selectedPropertyIds.has(p.id));
    const exportData = selectedProps.map(prop => ({
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
              <h1 className="text-xl font-bold">Comparable Property Analysis</h1>
              <p className="text-sm text-muted-foreground">
                Search sold properties near your subject property
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              1. Search for Comparable Properties
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              Find recently sold properties with interior photos. AI will analyze kitchens, bathrooms, and other renovations to identify what drives value in your market.
            </p>

            {/* Search Mode Selector */}
            <div className="space-y-2">
              <Label>Search by:</Label>
              <Select value={searchMode} onValueChange={(v: any) => setSearchMode(v)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="radius">Radius from Address</SelectItem>
                  <SelectItem value="neighborhood">Neighborhood</SelectItem>
                  <SelectItem value="street">Street Name</SelectItem>
                  <SelectItem value="zip">Zip Code</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Conditional Fields based on Search Mode */}
            {searchMode === 'radius' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label>Subject Property Address</Label>
                <Input 
                  value={subjectAddress} 
                  onChange={(e) => setSubjectAddress(e.target.value)}
                  placeholder="123 Main St, City, State ZIP"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Search Radius</Label>
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

            {searchMode === 'neighborhood' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Neighborhood Name</Label>
                  <Input
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    placeholder="e.g., Taramore"
                  />
                </div>
                <div className="space-y-2">
                  <Label>City, State (optional)</Label>
                  <Input
                    value={cityState}
                    onChange={(e) => setCityState(e.target.value)}
                    placeholder="e.g., Brentwood, TN"
                  />
                </div>
              </div>
            )}

            {searchMode === 'street' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Street Name</Label>
                  <Input
                    value={streetName}
                    onChange={(e) => setStreetName(e.target.value)}
                    placeholder="e.g., Main St"
                  />
                </div>
                <div className="space-y-2">
                  <Label>City, State (optional)</Label>
                  <Input
                    value={cityState}
                    onChange={(e) => setCityState(e.target.value)}
                    placeholder="e.g., Brentwood, TN"
                  />
                </div>
              </div>
            )}

            {searchMode === 'zip' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Zip Code</Label>
                  <Input
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="e.g., 37027"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Time Period</Label>
              <Select value={timePeriod} onValueChange={setTimePeriod}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="90">Last 90 Days</SelectItem>
                  <SelectItem value="180">Last 6 Months</SelectItem>
                  <SelectItem value="365">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={fetchAndAnalyzeAll} 
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
                  Search Comparables
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Step 2: Select Properties */}
        {allProperties.length > 0 && (
          <>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>2. Select Properties for Photo Analysis ({selectedPropertyIds.size} selected, minimum 3)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Select at least 3 properties with good interior photos. AI will examine photos to identify renovation quality, materials used, and specific features that command premium pricing.
                </p>
                
                <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto">
                  {allProperties.map((property) => (
                    <div 
                      key={property.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedPropertyIds.has(property.id) 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => togglePropertySelection(property.id)}
                    >
                      <div className="flex items-start gap-4">
                        <input 
                          type="checkbox" 
                          checked={selectedPropertyIds.has(property.id)}
                          onChange={() => togglePropertySelection(property.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{property.address}</h3>
                            {typeof (property.listing_data as any)?.distance_miles === 'number' && (
                              <Badge variant="secondary">
                                {Number((property.listing_data as any).distance_miles).toFixed(2)} mi
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {property.city}, {property.state} {property.zip_code}
                          </p>
                          <div className="text-sm text-muted-foreground mt-1 flex flex-wrap items-center gap-3">
                            {(property.listing_data as any)?.sold_date && (
                              <span>
                                Sold: {new Date((property.listing_data as any).sold_date).toLocaleDateString()}
                              </span>
                            )}
                            {property.listing_data?.price && (
                              <span className="font-medium">
                                ${property.listing_data.price.toLocaleString()}
                              </span>
                            )}
                            {property.listing_data?.beds && property.listing_data?.baths && (
                              <span>
                                {property.listing_data.beds} beds • {property.listing_data.baths} baths
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {property.photo_urls?.length || 0} photos available
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <Button 
                    onClick={analyzeSelectedProperties}
                    disabled={selectedPropertyIds.size < 3 || analyzing}
                    size="lg"
                  >
                    {analyzing ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        Analyze Photos & Identify Renovations ({selectedPropertyIds.size} properties)
                      </>
                    )}
                  </Button>

                  {selectedPropertyIds.size >= 3 && (
                    <Button 
                      onClick={exportAnalysisData}
                      variant="outline"
                      size="lg"
                    >
                      <Download className="mr-2 h-5 w-5" />
                      Export Selected
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Step 3: View Analysis Results */}
            {selectedPropertyIds.size >= 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>3. Photo Analysis & Renovation Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {allProperties
                      .filter(p => selectedPropertyIds.has(p.id))
                      .map((property) => (
                        <div key={property.id} className="border-b pb-6 last:border-b-0">
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
                                  {property.photo_urls.length} photos
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
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default ComparablesAnalysis;
