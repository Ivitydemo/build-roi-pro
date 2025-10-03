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

    // Optimized approach: target 4 comps, minimum 3, with minimal API calls
    const desiredTarget = 4;
    const desiredMinimum = 3;

    const baseRadius = parseFloat(String(searchParams.radius ?? '1'));
    const basePeriod = parseInt(String(searchParams.timePeriod ?? '180'));

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
      
      // Try with base radius first
      const soldDateMin = new Date();
      soldDateMin.setDate(soldDateMin.getDate() - basePeriod);
      const soldDateMinStr = soldDateMin.toISOString().split('T')[0];

      // Only request what we need (limit=10 instead of 100)
      const apiUrl = `https://realtor16.p.rapidapi.com/search/forsold?location=${encodeURIComponent(primaryLocation)}&sold_date_min=${soldDateMinStr}&limit=10&radius=${baseRadius}`;
      console.log('Fetching from:', apiUrl);

      const listingsResponse = await fetch(apiUrl, options);
      
      if (listingsResponse.ok) {
        const listingsData = await listingsResponse.json();
        const currentProps: any[] = listingsData?.properties || [];
        console.log('API Response status:', listingsData?.status);
        console.log('Properties found:', currentProps.length);
        if (currentProps.length === 0) {
          console.log('Full API response:', JSON.stringify(listingsData).slice(0, 500));
        }

        for (const property of currentProps) {
          const locInfo = property.location || {};
          const addr = locInfo.address || {};

          const key = `${addr.line ?? ''}|${addr.postal_code ?? ''}`;
          if (seenKeys.has(key)) continue;

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

          if (photoUrls.length >= 1) {
            const targetedProperty = {
              campaign_id: campaignId,
              address: addr.line || 'Unknown Address',
              city: addr.city || null,
              state: addr.state_code || null,
              zip_code: addr.postal_code || null,
              listing_data: property,
              photo_urls: photoUrls,
              analysis_status: 'pending'
            };
            processedProperties.push(targetedProperty);
            seenKeys.add(key);
          }

          // Stop when we hit target
          if (processedProperties.length >= desiredTarget) break;
        }

        // If we didn't get enough, try expanding radius once
        if (processedProperties.length < desiredMinimum) {
          console.log('Not enough properties, expanding radius to 3 miles');
          const expandedUrl = `https://realtor16.p.rapidapi.com/search/forsold?location=${encodeURIComponent(primaryLocation)}&sold_date_min=${soldDateMinStr}&limit=10&radius=3`;
          
          const expandedResponse = await fetch(expandedUrl, options);
          if (expandedResponse.ok) {
            const expandedData = await expandedResponse.json();
            const expandedProps: any[] = expandedData?.properties || [];
            console.log('Expanded search found:', expandedProps.length);

            for (const property of expandedProps) {
              const locInfo = property.location || {};
              const addr = locInfo.address || {};
              const key = `${addr.line ?? ''}|${addr.postal_code ?? ''}`;
              
              if (seenKeys.has(key)) continue;

              const photoUrls: string[] = [];
              if (property.photos && Array.isArray(property.photos)) {
                for (const photo of property.photos) {
                  if (photo?.href) photoUrls.push(photo.href);
                }
              }
              if (property.primary_photo?.href && !photoUrls.includes(property.primary_photo.href)) {
                photoUrls.unshift(property.primary_photo.href);
              }

              if (photoUrls.length >= 1) {
                processedProperties.push({
                  campaign_id: campaignId,
                  address: addr.line || 'Unknown Address',
                  city: addr.city || null,
                  state: addr.state_code || null,
                  zip_code: addr.postal_code || null,
                  listing_data: property,
                  photo_urls: photoUrls,
                  analysis_status: 'pending'
                });
                seenKeys.add(key);
              }

              if (processedProperties.length >= desiredTarget) break;
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


    console.log('Processed properties with photos:', processedProperties.length);


    // Insert all properties into the database
    if (processedProperties.length > 0) {
      const { data: insertedProperties, error: insertError } = await supabase
        .from('targeted_properties')
        .insert(processedProperties)
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
          total_properties: processedProperties.length,
          status: 'completed'
        })
        .eq('id', campaignId);

      if (updateError) {
        console.error('Error updating campaign:', updateError);
      }

      return new Response(JSON.stringify({ 
        success: true, 
        propertiesFound: processedProperties.length,
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
