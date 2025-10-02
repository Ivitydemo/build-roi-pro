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
  const [subjectAddress, setSubjectAddress] = useState('');
  const [radius, setRadius] = useState('1');
  const [timePeriod, setTimePeriod] = useState('180'); // days
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

    if (!subjectAddress.trim()) {
      toast({
        title: 'Missing information',
        description: 'Please enter the subject property address',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    setSelectedPropertyIds(new Set()); // Clear previous selections
    const createdCampaigns: any[] = [];
    const fetchedProperties: any[] = [];

    try {
      const searchParams = { 
        address: subjectAddress, 
        radius,
        timePeriod 
      };
      const campaignName = `Within ${radius}mi of ${subjectAddress}`;

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
          search_type: 'radius',
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
          searchType: 'radius',
          searchParams,
          campaignId: campaign.id
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
          description: 'No sold properties found in this area. Try expanding the radius.',
          variant: 'destructive'
        });
        setLoading(false);
        return;
      }

      toast({
        title: 'Properties loaded',
        description: `Found ${fetchedProperties.length} properties. Select at least 3 comps to analyze.`
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
        title: 'Analyzing selected properties...',
        description: `Processing ${selectedPropertyIds.size} properties`
      });

      let analyzed = 0;
      const selectedProps = allProperties.filter(p => selectedPropertyIds.has(p.id));
      
      for (const property of selectedProps) {
        if (property.analysis_status === 'completed') {
          analyzed++;
          continue;
        }

        toast({
          title: `Analyzing ${analyzed + 1}/${selectedProps.length}`,
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

        await new Promise(resolve => setTimeout(resolve, 3000));
      }

      // Reload to get updated analysis
      await loadAllProperties(campaigns.map(c => c.id));

      toast({
        title: 'Analysis complete! 🎉',
        description: `Successfully analyzed ${analyzed} properties`,
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
            <CardTitle>1. Enter Subject Property</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              Enter the address of the subject property to find nearby sold comparables.
            </p>

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
                <CardTitle>2. Select Comparables ({selectedPropertyIds.size} selected, minimum 3)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Review the properties found and select at least 3 comparable properties for detailed analysis.
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
                          <h3 className="font-semibold">{property.address}</h3>
                          <p className="text-sm text-muted-foreground">
                            {property.city}, {property.state} {property.zip_code}
                          </p>
                          {property.listing_data?.price && (
                            <p className="text-sm font-medium mt-1">
                              ${property.listing_data.price.toLocaleString()} • 
                              {property.listing_data.beds} beds • {property.listing_data.baths} baths
                            </p>
                          )}
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
                        Analyze {selectedPropertyIds.size} Selected Properties
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
                  <CardTitle>3. Analysis Results</CardTitle>
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
