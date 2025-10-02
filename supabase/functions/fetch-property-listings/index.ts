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
    
    if (!RAPIDAPI_KEY) {
      throw new Error('RAPIDAPI_KEY not configured. Please add your RapidAPI key.');
    }

    let properties: any[] = [];

    // Build the API request based on search type
    const apiKey = RAPIDAPI_KEY;
    
    // Build location string for API
    const location = searchParams.address || searchParams.zipCode || 
                     `${searchParams.subdivisionName}, ${searchParams.city}, ${searchParams.state}`;

    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'realtor16.p.rapidapi.com'
      } as Record<string, string>
    };

    // Attempt to fetch enough sold comps with automatic fallbacks
    // Goal: target 4 comps, minimum 3
    const desiredTarget = 4;
    const desiredMinimum = 3;

    const baseRadius = parseFloat(String(searchParams.radius ?? '1'));
    const uniqueRadii = Array.from(new Set([
      baseRadius,
      1,
      2,
      3,
      5,
    ].filter((r) => !isNaN(r) && r > 0))).sort((a, b) => a - b);

    const basePeriod = parseInt(String(searchParams.timePeriod ?? '180'));
    const uniquePeriods = Array.from(new Set([
      basePeriod,
      365,
    ])).sort((a, b) => a - b);

    const attemptDetails: Array<{ radius: number; period: number; rawCount: number; withPhotos: number }> = [];

    // We'll dedupe properties across attempts using an address key
    const seenKeys = new Set<string>();
    const processedProperties: any[] = [];

    for (const period of uniquePeriods) {
      const soldDateMin = new Date();
      soldDateMin.setDate(soldDateMin.getDate() - period);
      const soldDateMinStr = soldDateMin.toISOString().split('T')[0];

      for (const r of uniqueRadii) {
        let apiUrl = `https://realtor16.p.rapidapi.com/search/forsold?location=${encodeURIComponent(location)}&sold_date_min=${soldDateMinStr}&limit=100&radius=${r}`;
        console.log('Fetching from:', apiUrl);

        const listingsResponse = await fetch(apiUrl, options);
        if (!listingsResponse.ok) {
          console.error('API error:', listingsResponse.status, await listingsResponse.text());
          continue; // try next attempt
        }

        const listingsData = await listingsResponse.json();
        const currentProps: any[] = listingsData?.properties || [];
        console.log('Raw properties found:', currentProps.length);

        let withPhotosCount = 0;

        for (const property of currentProps) {
          const loc = property.location || {};
          const addr = loc.address || {};

          // Build a natural dedupe key
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
            withPhotosCount++;
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

          // Stop early if we hit the target
          if (processedProperties.length >= desiredTarget) break;
        }

        attemptDetails.push({ radius: r, period, rawCount: currentProps.length, withPhotos: withPhotosCount });

        // If we already have the minimum, we can stop trying larger searches
        if (processedProperties.length >= desiredMinimum) {
          break;
        }
      }

      if (processedProperties.length >= desiredMinimum) {
        break;
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
      // No properties with photos found
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
