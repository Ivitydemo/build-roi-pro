import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { searchType, searchParams, campaignId, useMock } = await req.json();
    console.log('Fetch property listings request:', { searchType, searchParams, campaignId, useMock });

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const RAPIDAPI_KEY = Deno.env.get('RAPIDAPI_KEY');
    let useMockMode = Boolean(useMock);
    if (!RAPIDAPI_KEY) {
      console.warn('RAPIDAPI_KEY not configured. Falling back to mock data.');
      useMockMode = true;
    }

    let properties: any[] = [];
    let quotaExceeded = false;

    // Build the API request based on search type
    const apiKey = RAPIDAPI_KEY;
    
    // Build location string for API
    const rawAddress = (searchParams.address ?? '').toString().trim();
    const zipFromAddress = rawAddress.match(/\b\d{5}(?:-\d{4})?\b/)?.[0]?.slice(0, 5);
    const candidates: string[] = Array.from(new Set([
      rawAddress || undefined,
      (searchParams.zipCode ?? '').toString().trim() || undefined,
      zipFromAddress,
      [searchParams.city, searchParams.state].filter(Boolean).join(', ') || undefined,
      searchParams.subdivisionName && [searchParams.subdivisionName, searchParams.city, searchParams.state].filter(Boolean).join(', ')
    ].filter((v): v is string => !!v && v.length > 0)));

    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'realtor16.p.rapidapi.com'
      } as Record<string, string>
    };

    // Helper function to calculate distance between two coordinates (Haversine formula)
    function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
      const R = 3959; // Earth's radius in miles
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    }

    // Optimized approach: target 4 comps, prefer within 90 days and close distance
    const desiredTarget = 12;
    const desiredMinimum = 3;

    const baseRadius = parseFloat(String(searchParams.radius ?? '1'));
    const radiusTolerance = Math.max(0.25, baseRadius * 0.1); // buffer for geocode variance
    const preferredPeriod = 90; // Prefer 90 days
    const fallbackPeriod = 180; // Fall back to 180 days if needed

    const seenKeys = new Set<string>();
    const processedProperties: any[] = [];

    // Try city/state first (more reliable), then full address if that fails
    let primaryLocation = candidates.find(c => c.includes(',') && !c.match(/^\d/)); // City, State format
    if (!primaryLocation) primaryLocation = candidates[0];
    
    if (!primaryLocation) {
      console.warn('No valid location candidate found');
      properties = [];
    } else {
      console.log('All location candidates:', candidates);
      console.log('Using primary location:', primaryLocation);
      
      // Get subject property coordinates
      let subjectLat: number | null = null;
      let subjectLon: number | null = null;

      // Prefer geocoding the exact subject address when available
      const geocodeTarget = rawAddress || primaryLocation;

      if (geocodeTarget) {
        // Try Nominatim (OSM) first for precise coordinates of the subject address
        const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(geocodeTarget)}&format=json&limit=1`;
        console.log('Geocoding with Nominatim:', nominatimUrl);
        try {
          const nomRes = await fetch(nominatimUrl, {
            headers: { 'User-Agent': 'LovableApp/1.0' }
          });
          if (nomRes.ok) {
            const nomData = await nomRes.json();
            if (Array.isArray(nomData) && nomData[0]?.lat && nomData[0]?.lon) {
              subjectLat = parseFloat(nomData[0].lat);
              subjectLon = parseFloat(nomData[0].lon);
              console.log('Subject coordinates (Nominatim):', subjectLat, subjectLon);
            }
          } else {
            console.warn('Nominatim geocode failed with status:', nomRes.status);
          }
        } catch (e) {
          console.warn('Nominatim geocode error:', e);
        }

        // Fallback: use Realtor sold search to get a nearby coordinate
        if (!subjectLat || !subjectLon) {
          const geocodeUrl = `https://realtor16.p.rapidapi.com/search/forsold?location=${encodeURIComponent(geocodeTarget)}&limit=1`;
          console.log('Realtor geocoding fallback:', geocodeUrl);
          try {
            const geocodeResponse = await fetch(geocodeUrl, options);
            console.log('Realtor geocode response status:', geocodeResponse.status);
            if (geocodeResponse.ok) {
              const geocodeData = await geocodeResponse.json();
              let firstProp: any = null;
              if (Array.isArray(geocodeData?.properties) && geocodeData.properties[0]) {
                firstProp = geocodeData.properties[0];
              } else if (Array.isArray(geocodeData?.data?.home_search?.results) && geocodeData.data.home_search.results[0]) {
                firstProp = geocodeData.data.home_search.results[0].property ?? geocodeData.data.home_search.results[0];
              } else if (Array.isArray(geocodeData?.data?.results) && geocodeData.data.results[0]) {
                firstProp = geocodeData.data.results[0].property ?? geocodeData.data.results[0];
              }
              if (firstProp?.location?.coordinate) {
                subjectLat = firstProp.location.coordinate.lat ?? firstProp.location.coordinate.latitude;
                subjectLon = firstProp.location.coordinate.lon ?? firstProp.location.coordinate.longitude;
                console.log('Subject coordinates (Realtor):', subjectLat, subjectLon);
              } else if (firstProp?.location?.address?.coordinate) {
                subjectLat = firstProp.location.address.coordinate.lat ?? firstProp.location.address.coordinate.latitude;
                subjectLon = firstProp.location.address.coordinate.lon ?? firstProp.location.address.coordinate.longitude;
                console.log('Subject coordinates (Realtor address):', subjectLat, subjectLon);
              }
            }
          } catch (e) {
            console.warn('Realtor geocode fallback error:', e);
          }
        }
      }

      if (!subjectLat || !subjectLon) {
        console.log('Subject coordinates unavailable after geocoding; distances may be approximate or null');
      }

      // Build a location optimized for the API: prefer ZIP, else city/state from address
      const locationForSearch = (() => {
        // If a subdivision is provided, bias search to subdivision + city/state
        if (searchParams?.subdivisionName) {
          const parts = primaryLocation.split(',').map((p: string) => p.trim()).filter(Boolean);
          const base = parts.length >= 2 ? `${parts[parts.length - 2]}, ${parts[parts.length - 1]}` : primaryLocation;
          return `${searchParams.subdivisionName}, ${base}`;
        }
        if (zipFromAddress) return zipFromAddress;
        const parts = primaryLocation.split(',').map((p: string) => p.trim()).filter(Boolean);
        if (parts.length >= 2) {
          const statePart = parts[parts.length - 1];
          const cityPart = parts[parts.length - 2];
          return `${cityPart}, ${statePart}`;
        }
        return primaryLocation;
      })();

      // First try: 90 days, base radius
      const soldDateMin90 = new Date();
      soldDateMin90.setDate(soldDateMin90.getDate() - preferredPeriod);
      const soldDateMinStr90 = soldDateMin90.toISOString().split('T')[0];

      const apiUrl = `https://realtor16.p.rapidapi.com/search/forsold?location=${encodeURIComponent(locationForSearch)}&sold_date_min=${soldDateMinStr90}&limit=100&radius=${baseRadius}`;
      console.log('Fetching from (90 days):', apiUrl);

      const listingsResponse = await fetch(apiUrl, options);
      
      if (listingsResponse.ok) {
        const listingsData = await listingsResponse.json();
        // Normalize possible result shapes from the API
        let currentProps: any[] = [];
        if (Array.isArray(listingsData?.properties)) {
          currentProps = listingsData.properties;
        } else if (Array.isArray(listingsData?.data?.home_search?.results)) {
          currentProps = listingsData.data.home_search.results.map((r: any) => r.property ?? r);
        } else if (Array.isArray(listingsData?.data?.results)) {
          currentProps = listingsData.data.results.map((r: any) => r.property ?? r);
        }
        console.log('API Response status:', listingsData?.status);
        console.log('Properties found:', currentProps.length);
        if (currentProps.length === 0) {
          console.log('Full API response:', JSON.stringify(listingsData).slice(0, 1000));
        }

        for (const property of currentProps) {
          const locInfo = property.location || {};
          const addrRaw = locInfo.address || property.address || {};
          const line = addrRaw.line ?? addrRaw.street_line ?? addrRaw.address_line ?? addrRaw.full_address ?? '';
          const zip = addrRaw.postal_code ?? addrRaw.zip_code ?? '';

          const key = `${line}|${zip}`;
          if (seenKeys.has(key)) continue;

          // Calculate distance if we have coordinates
          let distance: number | null = null;
          const propCoord = locInfo.coordinate ?? locInfo.address?.coordinate ?? property.coordinate;
          
          // If we don't have subject coordinates yet, use the first property as reference
          if (!subjectLat && !subjectLon && propCoord) {
            const propLat = propCoord.lat ?? propCoord.latitude;
            const propLon = propCoord.lon ?? propCoord.longitude;
            if (propLat && propLon) {
              subjectLat = propLat;
              subjectLon = propLon;
              console.log('Using first property as subject reference:', subjectLat, subjectLon);
              distance = 0; // First property is the reference
            }
          } else if (subjectLat && subjectLon && propCoord) {
            const propLat = propCoord.lat ?? propCoord.latitude;
            const propLon = propCoord.lon ?? propCoord.longitude;
            if (propLat && propLon) {
              distance = getDistance(subjectLat, subjectLon, propLat, propLon);
              console.log(`Distance calculated: ${distance?.toFixed(2)} miles for ${line}`);
              if (Number.isFinite(distance) && distance > (baseRadius + radiusTolerance)) { continue; }
            }
          }

          // Extract photo URLs
          const photoUrls: string[] = [];
          if (property.photos && Array.isArray(property.photos)) {
            for (const photo of property.photos) {
              if (photo?.href) photoUrls.push(photo.href);
            }
          }
          if (property.primary_photo?.href && !photoUrls.includes(property.primary_photo.href)) {
            photoUrls.unshift(property.primary_photo.href);
          }
          if (property.thumbnail && !photoUrls.includes(property.thumbnail)) {
            photoUrls.push(property.thumbnail);
          }

          // Accept properties even without photos to show all comps
          {
            // Add distance and sold_date to listing_data
            const enrichedListingData = {
              ...property,
              distance_miles: distance,
              sold_date: property.sold_date ?? property.list_date ?? property.last_sold_date
            };
            
            const targetedProperty = {
              campaign_id: campaignId,
              address: line || 'Unknown Address',
              city: (addrRaw.city ?? addrRaw.locality) || null,
              state: (addrRaw.state_code ?? addrRaw.state) || null,
              zip_code: (addrRaw.postal_code ?? addrRaw.zip_code) || null,
              listing_data: enrichedListingData,
              photo_urls: photoUrls,
              analysis_status: 'pending',
              _distance: distance, // Store for sorting
              _soldDate: enrichedListingData.sold_date
            };
            processedProperties.push(targetedProperty);
            seenKeys.add(key);
          }

          // Continue scanning all to pick the closest after sorting
        }

        // If we didn't get enough, expand to 180 days
        if (processedProperties.length < desiredTarget) {
          console.log('Not enough properties within 90 days, expanding to 180 days');
          const soldDateMin180 = new Date();
          soldDateMin180.setDate(soldDateMin180.getDate() - fallbackPeriod);
          const soldDateMinStr180 = soldDateMin180.toISOString().split('T')[0];
          const expandedUrl = `https://realtor16.p.rapidapi.com/search/forsold?location=${encodeURIComponent(locationForSearch)}&sold_date_min=${soldDateMinStr180}&limit=100&radius=${baseRadius}`;
          
          const expandedResponse = await fetch(expandedUrl, options);
          if (expandedResponse.ok) {
            const expandedData = await expandedResponse.json();
            let expandedProps: any[] = [];
            if (Array.isArray(expandedData?.properties)) {
              expandedProps = expandedData.properties;
            } else if (Array.isArray(expandedData?.data?.home_search?.results)) {
              expandedProps = expandedData.data.home_search.results.map((r: any) => r.property ?? r);
            } else if (Array.isArray(expandedData?.data?.results)) {
              expandedProps = expandedData.data.results.map((r: any) => r.property ?? r);
            }
            console.log('Expanded search found:', expandedProps.length);

            for (const property of expandedProps) {
              const locInfo = property.location || {};
              const addrRaw2 = locInfo.address || property.address || {};
              const line2 = addrRaw2.line ?? addrRaw2.street_line ?? addrRaw2.address_line ?? addrRaw2.full_address ?? '';
              const zip2 = addrRaw2.postal_code ?? addrRaw2.zip_code ?? '';
              const key = `${line2}|${zip2}`;
              
              if (seenKeys.has(key)) continue;

              // Calculate distance
              let distance: number | null = null;
              const propCoord = locInfo.coordinate ?? locInfo.address?.coordinate ?? property.coordinate;
              if (subjectLat && subjectLon && propCoord) {
                const propLat = propCoord.lat ?? propCoord.latitude;
                const propLon = propCoord.lon ?? propCoord.longitude;
                if (propLat && propLon) {
                  distance = getDistance(subjectLat, subjectLon, propLat, propLon);
                  if (Number.isFinite(distance) && distance > (baseRadius + radiusTolerance)) { continue; }
                }
              }

              const photoUrls: string[] = [];
              if (property.photos && Array.isArray(property.photos)) {
                for (const photo of property.photos) {
                  if (photo?.href) photoUrls.push(photo.href);
                }
              }
              if (property.primary_photo?.href && !photoUrls.includes(property.primary_photo.href)) {
                photoUrls.unshift(property.primary_photo.href);
              }

              // Accept properties even without photos to show all comps
              {
                const enrichedListingData = {
                  ...property,
                  distance_miles: distance,
                  sold_date: property.sold_date ?? property.list_date ?? property.last_sold_date
                };
                
                processedProperties.push({
                  campaign_id: campaignId,
                  address: line2 || 'Unknown Address',
                  city: (addrRaw2.city ?? addrRaw2.locality) || null,
                  state: (addrRaw2.state_code ?? addrRaw2.state) || null,
                  zip_code: (addrRaw2.postal_code ?? addrRaw2.zip_code) || null,
                  listing_data: enrichedListingData,
                  photo_urls: photoUrls,
                  analysis_status: 'pending',
                  _distance: distance,
                  _soldDate: enrichedListingData.sold_date
                });
                seenKeys.add(key);
              }

              // Continue scanning all to pick the closest after sorting
            }
          }
        }
      } else {
        const status = listingsResponse.status;
        console.error('API error:', status);
        if (status === 429) {
          quotaExceeded = true;
        }
      }
    }


    console.log('Processed properties (photo requirement removed):', processedProperties.length);

    // Sort by distance first (closest first), then by date (most recent first)
    processedProperties.sort((a, b) => {
      const distA = a._distance ?? 999;
      const distB = b._distance ?? 999;
      if (Math.abs(distA - distB) > 0.1) {
        return distA - distB; // Closer is better
      }
      // If distances are similar, prefer more recent sales
      const dateA = a._soldDate ? new Date(a._soldDate).getTime() : 0;
      const dateB = b._soldDate ? new Date(b._soldDate).getTime() : 0;
      return dateB - dateA; // More recent is better
    });

    // Take only the top 4 most relevant
    const selectedProperties = processedProperties.slice(0, desiredTarget).map(p => {
      const { _distance, _soldDate, ...rest } = p;
      return rest;
    });

    console.log('Selected top properties:', selectedProperties.length);

    // Insert all properties into the database
    if (selectedProperties.length > 0) {
      const { data: insertedProperties, error: insertError } = await supabase
        .from('targeted_properties')
        .insert(selectedProperties)
        .select();

      if (insertError) {
        console.error('Error inserting properties:', insertError);
        throw insertError;
      }

      console.log('Inserted properties count:', insertedProperties?.length || 0);

      // Update campaign with total count
      const { error: updateError } = await supabase
        .from('property_search_campaigns')
        .update({ 
          total_properties: selectedProperties.length,
          status: 'completed'
        })
        .eq('id', campaignId);

      if (updateError) {
        console.error('Error updating campaign:', updateError);
      }

      return new Response(JSON.stringify({ 
        success: true, 
        propertiesFound: selectedProperties.length,
        properties: insertedProperties
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
      } else {
        // Fallback to mock data if allowed or when API quota is exceeded
        if (useMockMode || quotaExceeded) {
          console.log('Using mock comparable properties (useMockMode:', useMockMode, 'quotaExceeded:', quotaExceeded, ')');
          const mockPhotos = [
            'https://picsum.photos/seed/comp1/800/600',
            'https://picsum.photos/seed/comp2/800/600',
            'https://picsum.photos/seed/comp3/800/600',
            'https://picsum.photos/seed/comp4/800/600',
          ];
          const today = new Date();
          const mockSold = (daysAgo: number) => {
            const d = new Date(today);
            d.setDate(d.getDate() - daysAgo);
            return d.toISOString().split('T')[0];
          };
          const mockProps = [
            { address: 'Mock Comparable A', city: null, state: null, zip_code: null, photo_urls: [mockPhotos[0]], listing_data: { price: 625000, beds: 4, baths: 3, sqft: 2600, sold_date: mockSold(30) } },
            { address: 'Mock Comparable B', city: null, state: null, zip_code: null, photo_urls: [mockPhotos[1]], listing_data: { price: 590000, beds: 3, baths: 2, sqft: 2400, sold_date: mockSold(60) } },
            { address: 'Mock Comparable C', city: null, state: null, zip_code: null, photo_urls: [mockPhotos[2]], listing_data: { price: 605000, beds: 3, baths: 2.5, sqft: 2500, sold_date: mockSold(85) } },
            { address: 'Mock Comparable D', city: null, state: null, zip_code: null, photo_urls: [mockPhotos[3]], listing_data: { price: 645000, beds: 4, baths: 3.5, sqft: 2750, sold_date: mockSold(120) } },
          ].map((p) => ({
            campaign_id: campaignId,
            address: p.address,
            city: p.city,
            state: p.state,
            zip_code: p.zip_code,
            listing_data: p.listing_data,
            photo_urls: p.photo_urls,
            analysis_status: 'pending',
          }));

          const { data: insertedMock, error: insertMockError } = await supabase
            .from('targeted_properties')
            .insert(mockProps)
            .select();

          if (insertMockError) {
            console.error('Error inserting mock properties:', insertMockError);
            return new Response(JSON.stringify({
              success: false,
              error: 'Failed to insert mock properties',
            }), {
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }

          await supabase
            .from('property_search_campaigns')
            .update({
              total_properties: mockProps.length,
              status: 'completed',
            })
            .eq('id', campaignId);

          return new Response(JSON.stringify({
            success: true,
            propertiesFound: mockProps.length,
            properties: insertedMock,
            message: quotaExceeded
              ? 'Using demo data due to external API rate limit.'
              : 'Using demo data as requested.',
            fallbackUsed: true,
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // No properties with photos found and no fallback
        const { error: updateError } = await supabase
          .from('property_search_campaigns')
          .update({ 
            total_properties: 0,
            status: 'completed'
          })
          .eq('id', campaignId);

        return new Response(JSON.stringify({ 
          success: true, 
          propertiesFound: 0,
          message: 'No properties with photos found'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

  } catch (error) {
    console.error('Error in fetch-property-listings:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
