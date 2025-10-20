import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Search, Loader2 } from 'lucide-react';

interface PropertySearchCampaignProps {
  builderId: string;
  onCampaignCreated?: () => void;
}

export const PropertySearchCampaign = ({ builderId, onCampaignCreated }: PropertySearchCampaignProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState<'address' | 'subdivision' | 'radius' | 'zip_code'>('address');
  const [campaignName, setCampaignName] = useState('');
  
  // Address search
  const [address, setAddress] = useState('');
  
  // Subdivision search
  const [subdivisionName, setSubdivisionName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  
  // Radius search
  const [radiusAddress, setRadiusAddress] = useState('');
  const [radiusMiles, setRadiusMiles] = useState('5');
  
  // Zip code search
  const [zipCode, setZipCode] = useState('');

  const handleSearch = async () => {
    if (!campaignName.trim()) {
      toast({
        title: 'Campaign name required',
        description: 'Please enter a name for this campaign',
        variant: 'destructive'
      });
      return;
    }

    let searchParams: any = {};
    
    if (searchType === 'address') {
      if (!address.trim()) {
        toast({ title: 'Address required', variant: 'destructive' });
        return;
      }
      searchParams = { address };
    } else if (searchType === 'subdivision') {
      if (!subdivisionName.trim() || !city.trim() || !state.trim()) {
        toast({ title: 'All subdivision fields required', variant: 'destructive' });
        return;
      }
      searchParams = { subdivisionName, city, state };
    } else if (searchType === 'radius') {
      if (!radiusAddress.trim() || !radiusMiles) {
        toast({ title: 'Address and radius required', variant: 'destructive' });
        return;
      }
      searchParams = { address: radiusAddress, radiusMiles: parseFloat(radiusMiles) };
    } else if (searchType === 'zip_code') {
      if (!zipCode.trim()) {
        toast({ title: 'Zip code required', variant: 'destructive' });
        return;
      }
      searchParams = { zipCode };
    }

    setLoading(true);

    try {
      // Create campaign
      const { data: campaign, error: campaignError } = await supabase
        .from('property_search_campaigns')
        .insert({
          builder_id: builderId,
          campaign_name: campaignName,
          search_type: searchType,
          search_parameters: searchParams,
          status: 'running'
        })
        .select()
        .single();

      if (campaignError) throw campaignError;

      toast({
        title: 'Searching for properties...',
        description: 'This may take a moment'
      });

      // Call edge function to fetch listings
      const { data, error } = await supabase.functions.invoke('fetch-property-listings', {
        body: {
          searchType,
          searchParams,
          campaignId: campaign.id
        }
      });

      if (error) throw error;

      toast({
        title: 'Properties found!',
        description: `Found ${data.propertiesFound} properties with photos`
      });

      onCampaignCreated?.();
      
      // Reset form
      setCampaignName('');
      setAddress('');
      setSubdivisionName('');
      setCity('');
      setState('');
      setRadiusAddress('');
      setRadiusMiles('5');
      setZipCode('');

    } catch (error) {
      console.error('Error creating campaign:', error);
      toast({
        title: 'Search failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Search Properties
        </CardTitle>
        <CardDescription>
          Find properties to analyze by address, subdivision, radius, or zip code
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Campaign Name</Label>
          <Input
            placeholder="e.g., Downtown Area Q1 2025"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Search Type</Label>
          <Select value={searchType} onValueChange={(value: any) => setSearchType(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="address">Single Address</SelectItem>
              <SelectItem value="subdivision">Subdivision/Neighborhood</SelectItem>
              <SelectItem value="radius">Radius Search</SelectItem>
              <SelectItem value="zip_code">Zip Code</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {searchType === 'address' && (
          <div className="space-y-2">
            <Label>Address</Label>
            <Input
              placeholder="123 Main St, City, State"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        )}

        {searchType === 'subdivision' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Subdivision/Neighborhood Name</Label>
              <Input
                placeholder="e.g., Oak Hills"
                value={subdivisionName}
                onChange={(e) => setSubdivisionName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Input
                  placeholder="State"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {searchType === 'radius' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Center Address</Label>
              <Input
                placeholder="123 Main St, City, State"
                value={radiusAddress}
                onChange={(e) => setRadiusAddress(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Radius (miles)</Label>
              <Input
                type="number"
                placeholder="5"
                value={radiusMiles}
                onChange={(e) => setRadiusMiles(e.target.value)}
              />
            </div>
          </div>
        )}

        {searchType === 'zip_code' && (
          <div className="space-y-2">
            <Label>Zip Code</Label>
            <Input
              placeholder="12345"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
            />
          </div>
        )}

        <Button 
          onClick={handleSearch} 
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Search Properties
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
