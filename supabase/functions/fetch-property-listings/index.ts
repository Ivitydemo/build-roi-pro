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
    const { searchType, searchParams, campaignId } = await req.json();
    console.log('Fetch property listings request:', { searchType, searchParams, campaignId });

    const RAPIDAPI_KEY = Deno.env.get('RAPIDAPI_KEY');
    if (!RAPIDAPI_KEY) {
      throw new Error('RAPIDAPI_KEY is not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let properties: any[] = [];

    // Build the API request based on search type
    if (searchType === 'address' || searchType === 'zip_code') {
      // Search for properties by address or zip
      const location = searchType === 'address' ? searchParams.address : searchParams.zipCode;
      
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'realtor16.p.rapidapi.com'
        }
      };

      // Try to fetch property listings with the new API
      const listingsUrl = `https://realtor16.p.rapidapi.com/properties/search?location=${encodeURIComponent(location)}&limit=20&status=for_sale`;
      console.log('Fetching listings from:', listingsUrl);
      
      const listingsResponse = await fetch(listingsUrl, options);
      const responseText = await listingsResponse.text();
      
      if (!listingsResponse.ok) {
        console.error('Listings API error:', listingsResponse.status, responseText);
        throw new Error(`Realtor API error: ${listingsResponse.status} - ${responseText}`);
      }

      console.log('API Response:', responseText);
      const listingsData = JSON.parse(responseText);
      console.log('Parsed data structure:', Object.keys(listingsData));

      // The API response structure may vary, try to extract properties
      properties = listingsData?.properties || listingsData?.results || listingsData?.data || [];
      
    } else if (searchType === 'radius') {
      // Search by radius around a location
      const { address, radiusMiles } = searchParams;
      
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'realtor16.p.rapidapi.com'
        }
      };

      const listingsUrl = `https://realtor16.p.rapidapi.com/properties/search?location=${encodeURIComponent(address)}&limit=50&radius=${radiusMiles}&status=for_sale`;
      console.log('Fetching listings from:', listingsUrl);
      
      const listingsResponse = await fetch(listingsUrl, options);
      const responseText = await listingsResponse.text();
      
      if (!listingsResponse.ok) {
        console.error('Listings API error:', listingsResponse.status, responseText);
        throw new Error(`Realtor API error: ${listingsResponse.status}`);
      }

      const listingsData = JSON.parse(responseText);
      properties = listingsData?.properties || listingsData?.results || listingsData?.data || [];
      
    } else if (searchType === 'subdivision') {
      // Search by subdivision/neighborhood
      const { subdivisionName, city, state } = searchParams;
      const location = `${subdivisionName}, ${city}, ${state}`;
      
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'realtor16.p.rapidapi.com'
        }
      };

      const listingsUrl = `https://realtor16.p.rapidapi.com/properties/search?location=${encodeURIComponent(location)}&limit=50&status=for_sale`;
      console.log('Fetching listings from:', listingsUrl);
      
      const listingsResponse = await fetch(listingsUrl, options);
      const responseText = await listingsResponse.text();
      
      if (!listingsResponse.ok) {
        console.error('Listings API error:', listingsResponse.status, responseText);
        throw new Error(`Realtor API error: ${listingsResponse.status}`);
      }

      const listingsData = JSON.parse(responseText);
      properties = listingsData?.properties || listingsData?.results || listingsData?.data || [];
    }

    // Process and store properties
    const processedProperties = [];
    
    for (const property of properties) {
      const location = property.location || {};
      const address = location.address || {};
      
      // Extract photo URLs
      const photoUrls: string[] = [];
      if (property.photos) {
        property.photos.forEach((photo: any) => {
          if (photo.href) {
            photoUrls.push(photo.href);
          }
        });
      }

      // Only insert properties with photos
      if (photoUrls.length > 0) {
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
