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

    // Calculate sold date minimum based on time period
    const timePeriodDays = parseInt(searchParams.timePeriod || '180');
    const soldDateMin = new Date();
    soldDateMin.setDate(soldDateMin.getDate() - timePeriodDays);
    const soldDateMinStr = soldDateMin.toISOString().split('T')[0];
    
    // Build API URL
    let apiUrl = `https://realtor16.p.rapidapi.com/search/forsold?location=${encodeURIComponent(location)}&sold_date_min=${soldDateMinStr}&limit=50`;
    
    // Add radius for radius searches
    if (searchParams.radius) {
      apiUrl += `&radius=${searchParams.radius}`;
    }
    
    console.log('Fetching from:', apiUrl);
    
    const listingsResponse = await fetch(apiUrl, options);
    
    if (listingsResponse.ok) {
      const listingsData = await listingsResponse.json();
      console.log('Raw properties found:', listingsData?.properties?.length || 0);
      properties = listingsData?.properties || [];
      
      // No post-filtering needed for radius searches - API handles it
    } else {
      console.error('API error:', listingsResponse.status, await listingsResponse.text());
      throw new Error(`API request failed with status ${listingsResponse.status}`);
    }

    // Process and store properties
    const processedProperties = [];
    
    for (const property of properties) {
      const location = property.location || {};
      const address = location.address || {};
      
      // Extract photo URLs - try multiple possible formats
      const photoUrls: string[] = [];
      
      // Try photos array
      if (property.photos && Array.isArray(property.photos)) {
        property.photos.forEach((photo: any) => {
          if (photo.href) {
            photoUrls.push(photo.href);
          }
        });
      }
      
      // Try primary_photo
      if (property.primary_photo?.href && !photoUrls.includes(property.primary_photo.href)) {
        photoUrls.unshift(property.primary_photo.href);
      }
      
      // Try thumbnail (some APIs use this)
      if (property.thumbnail && !photoUrls.includes(property.thumbnail)) {
        photoUrls.push(property.thumbnail);
      }

      console.log(`Property ${address.line}: found ${photoUrls.length} photos`);

      // Only insert properties with at least 1 photo
      if (photoUrls.length >= 1) {
        const targetedProperty = {
          campaign_id: campaignId,
          address: address.line || 'Unknown Address',
          city: address.city || null,
          state: address.state_code || null,
          zip_code: address.postal_code || null,
          listing_data: property,
          photo_urls: photoUrls,
          analysis_status: 'pending'
        };

        processedProperties.push(targetedProperty);
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
