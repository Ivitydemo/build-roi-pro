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

      // Fetch SOLD property listings for comparables analysis
      // Filter for recent sales (last 90-180 days) in Taramore subdivision
      const soldDateMin = new Date();
      soldDateMin.setDate(soldDateMin.getDate() - 180); // 6 months ago
      const soldDateMinStr = soldDateMin.toISOString().split('T')[0];
      
      const listingsUrl = `https://realtor16.p.rapidapi.com/search/forsold?location=${encodeURIComponent(location)}&limit=20&sold_date_min=${soldDateMinStr}`;
      console.log('Fetching recently sold properties from Taramore from:', listingsUrl);
      
      const listingsResponse = await fetch(listingsUrl, options);
      
      if (!listingsResponse.ok) {
        const errorText = await listingsResponse.text();
        console.error('Listings API error:', listingsResponse.status, errorText);
        throw new Error(`Realtor API error: ${listingsResponse.status} - ${errorText}`);
      }

      const listingsData = await listingsResponse.json();
      console.log('Properties found:', listingsData?.properties?.length || 0);

      properties = listingsData?.properties || [];
      
    } else if (searchType === 'radius') {
      // Search by radius around a location
      const { address, radiusMiles } = searchParams;
      
      const soldDateMin2 = new Date();
      soldDateMin2.setDate(soldDateMin2.getDate() - 180); // 6 months ago
      const soldDateMinStr2 = soldDateMin2.toISOString().split('T')[0];
      
      const options2 = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'realtor16.p.rapidapi.com'
        }
      };

      const listingsUrl2 = `https://realtor16.p.rapidapi.com/search/forsold?location=${encodeURIComponent(address)}&limit=50&sold_date_min=${soldDateMinStr2}`;
      console.log('Fetching recently sold properties from:', listingsUrl2);
      
      const listingsResponse2 = await fetch(listingsUrl2, options2);
      
      if (!listingsResponse2.ok) {
        const errorText = await listingsResponse2.text();
        console.error('Listings API error:', listingsResponse2.status, errorText);
        throw new Error(`Realtor API error: ${listingsResponse2.status}`);
      }

      const listingsData2 = await listingsResponse2.json();
      properties = listingsData2?.properties || [];
      
    } else if (searchType === 'subdivision') {
      // Search by subdivision/neighborhood - Taramore specifically
      const { subdivisionName, city, state } = searchParams;
      const location = `${subdivisionName}, ${city}, ${state}`;
      
      const soldDateMin3 = new Date();
      soldDateMin3.setDate(soldDateMin3.getDate() - 180); // 6 months ago
      const soldDateMinStr3 = soldDateMin3.toISOString().split('T')[0];
      
      const options3 = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'realtor16.p.rapidapi.com'
        }
      };

      const listingsUrl3 = `https://realtor16.p.rapidapi.com/search/forsold?location=${encodeURIComponent(location)}&limit=50&sold_date_min=${soldDateMinStr3}`;
      console.log('Fetching recently sold properties from Taramore from:', listingsUrl3);
      
      const listingsResponse3 = await fetch(listingsUrl3, options3);
      
      if (!listingsResponse3.ok) {
        const errorText = await listingsResponse3.text();
        console.error('Listings API error:', listingsResponse3.status, errorText);
        throw new Error(`Realtor API error: ${listingsResponse3.status}`);
      }

      const listingsData3 = await listingsResponse3.json();
      properties = listingsData3?.properties || [];
    }

    // Process and store properties
    const processedProperties = [];
    
    for (const property of properties) {
      const location = property.location || {};
      const address = location.address || {};
      
      // Extract photo URLs from the new API format
      const photoUrls: string[] = [];
      if (property.photos && Array.isArray(property.photos)) {
        property.photos.forEach((photo: any) => {
          if (photo.href) {
            photoUrls.push(photo.href);
          }
        });
      }
      
      // Also add primary photo if available
      if (property.primary_photo?.href && !photoUrls.includes(property.primary_photo.href)) {
        photoUrls.unshift(property.primary_photo.href);
      }

      // Only insert properties with photos (we need interior photos for analysis)
      // Minimum 3 photos to ensure we have interior shots, not just exterior
      if (photoUrls.length >= 3) {
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

    console.log('Processed properties with 3+ photos:', processedProperties.length);

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
