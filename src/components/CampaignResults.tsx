import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MapPin, Image, CheckCircle, Clock, XCircle, Play } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CampaignResultsProps {
  builderId: string;
  refreshTrigger?: number;
}

export const CampaignResults = ({ builderId, refreshTrigger }: CampaignResultsProps) => {
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzingProperties, setAnalyzingProperties] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchCampaigns();
  }, [builderId, refreshTrigger]);

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('property_search_campaigns')
        .select('*')
        .eq('builder_id', builderId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      toast({
        title: 'Error loading campaigns',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const analyzeProperty = async (propertyId: string) => {
    setAnalyzingProperties(prev => new Set(prev).add(propertyId));
    
    try {
      const { data, error } = await supabase.functions.invoke('analyze-targeted-properties', {
        body: { propertyId }
      });

      if (error) throw error;

      toast({
        title: 'Analysis complete',
        description: 'Property analysis finished successfully'
      });

      fetchCampaigns();
    } catch (error) {
      console.error('Error analyzing property:', error);
      toast({
        title: 'Analysis failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    } finally {
      setAnalyzingProperties(prev => {
        const newSet = new Set(prev);
        newSet.delete(propertyId);
        return newSet;
      });
    }
  };

  const analyzeAllInCampaign = async (campaignId: string) => {
    try {
      const { data: properties, error } = await supabase
        .from('targeted_properties')
        .select('id')
        .eq('campaign_id', campaignId)
        .eq('analysis_status', 'pending')
        .limit(10); // Analyze 10 at a time

      if (error) throw error;

      if (!properties || properties.length === 0) {
        toast({
          title: 'No properties to analyze',
          description: 'All properties have been analyzed or there are no properties in this campaign'
        });
        return;
      }

      toast({
        title: 'Starting bulk analysis',
        description: `Analyzing ${properties.length} properties...`
      });

      // Analyze properties one by one (to avoid rate limits)
      for (const property of properties) {
        await analyzeProperty(property.id);
        // Wait between analyses
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

    } catch (error) {
      console.error('Error in bulk analysis:', error);
      toast({
        title: 'Bulk analysis failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    }
  };

  const [expandedCampaign, setExpandedCampaign] = useState<string | null>(null);
  const [campaignProperties, setCampaignProperties] = useState<any[]>([]);

  const loadCampaignProperties = async (campaignId: string) => {
    if (expandedCampaign === campaignId) {
      setExpandedCampaign(null);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('targeted_properties')
        .select('*')
        .eq('campaign_id', campaignId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Sort by distance (closest first), with null distances at the end
      const sortedData = (data || []).sort((a, b) => {
        const listingA = a.listing_data as any;
        const listingB = b.listing_data as any;
        const distA = listingA?.distance_miles ?? 9999;
        const distB = listingB?.distance_miles ?? 9999;
        return distA - distB;
      });
      
      setCampaignProperties(sortedData);
      setExpandedCampaign(campaignId);
    } catch (error) {
      console.error('Error loading properties:', error);
      toast({
        title: 'Error loading properties',
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          No campaigns yet. Create your first property search campaign above.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {campaigns.map((campaign) => (
        <Card key={campaign.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{campaign.campaign_name}</CardTitle>
                <CardDescription>
                  {campaign.search_type.replace('_', ' ').toUpperCase()} search • {campaign.total_properties} properties found
                </CardDescription>
              </div>
              <Badge variant={campaign.status === 'completed' ? 'default' : 'secondary'}>
                {campaign.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Analyzed: {campaign.analyzed_properties || 0} / {campaign.total_properties}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => loadCampaignProperties(campaign.id)}
                >
                  {expandedCampaign === campaign.id ? 'Hide' : 'View'} Properties
                </Button>
                {campaign.total_properties > 0 && (
                  <Button
                    size="sm"
                    onClick={() => analyzeAllInCampaign(campaign.id)}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Analyze All
                  </Button>
                )}
              </div>
            </div>

            {expandedCampaign === campaign.id && (
              <ScrollArea className="h-[400px] rounded-md border p-4">
                <div className="space-y-4">
                  {campaignProperties.map((property) => (
                    <Card key={property.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <MapPin className="h-4 w-4" />
                              <span className="font-medium">{property.address}</span>
                               {typeof property.listing_data?.distance_miles === 'number' && (
                                 <Badge variant="secondary" className="ml-2">
                                   {Number(property.listing_data.distance_miles).toFixed(2)} mi
                                 </Badge>
                               )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              {property.listing_data?.sold_date && (
                                <span className="font-medium">
                                  Sold: {new Date(property.listing_data.sold_date).toLocaleDateString()}
                                </span>
                              )}
                              {(
                                property.listing_data?.subdivision_name ||
                                property.listing_data?.location?.address?.subdivision ||
                                property.listing_data?.location?.subdivision ||
                                property.listing_data?.subdivision
                              ) && (
                                <Badge variant="secondary" className="font-medium">
                                  Subdivision: {
                                    String(
                                      property.listing_data?.subdivision_name ||
                                      property.listing_data?.location?.address?.subdivision ||
                                      property.listing_data?.location?.subdivision ||
                                      property.listing_data?.subdivision
                                    ).trim()
                                  }
                                </Badge>
                              )}
                              {property.listing_data?.price && (
                                <span>
                                  ${property.listing_data.price.toLocaleString()}
                                </span>
                              )}
                              {property.listing_data?.beds && property.listing_data?.baths && (
                                <span>
                                  {property.listing_data.beds} bed • {property.listing_data.baths} bath
                                </span>
                              )}
                              {property.listing_data?.sqft && (
                                <span>
                                  {property.listing_data.sqft.toLocaleString()} sqft
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <span className="flex items-center gap-1">
                                <Image className="h-3 w-3" />
                                {property.photo_urls?.length || 0} photos
                              </span>
                              <Badge
                                variant={
                                  property.analysis_status === 'completed'
                                    ? 'default'
                                    : property.analysis_status === 'analyzing'
                                    ? 'secondary'
                                    : property.analysis_status === 'failed'
                                    ? 'destructive'
                                    : 'outline'
                                }
                              >
                                {property.analysis_status === 'completed' && <CheckCircle className="mr-1 h-3 w-3" />}
                                {property.analysis_status === 'analyzing' && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
                                {property.analysis_status === 'pending' && <Clock className="mr-1 h-3 w-3" />}
                                {property.analysis_status === 'failed' && <XCircle className="mr-1 h-3 w-3" />}
                                {property.analysis_status}
                              </Badge>
                            </div>
                            {property.analysis_summary && (
                              <div className="mt-3 text-sm">
                                <div className="font-medium mb-1">Analysis Summary:</div>
                                <div className="text-muted-foreground">
                                  {property.analysis_summary.total_photos_analyzed} photos analyzed
                                </div>
                              </div>
                            )}
                          </div>
                          {property.analysis_status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => analyzeProperty(property.id)}
                              disabled={analyzingProperties.has(property.id)}
                            >
                              {analyzingProperties.has(property.id) ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Analyzing...
                                </>
                              ) : (
                                'Analyze'
                              )}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
