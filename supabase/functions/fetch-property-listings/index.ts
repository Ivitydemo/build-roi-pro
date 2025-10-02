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
    const { searchType: originalSearchType, searchParams: originalSearchParams, campaignId, useMock } = await req.json();
    console.log('Fetch property listings request:', { searchType: originalSearchType, searchParams: originalSearchParams, campaignId, useMock });

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const RAPIDAPI_KEY = Deno.env.get('RAPIDAPI_KEY');
    const shouldUseMock = Boolean(useMock) || !RAPIDAPI_KEY;
    if (!RAPIDAPI_KEY) {
      console.warn('RAPIDAPI_KEY not configured. Falling back to mock data.');
    }
    let properties: any[] = [];
    
    // Allow mutation of search parameters for subdivision lookup
    let searchType = originalSearchType;
    let searchParams = originalSearchParams;

    // Build the API request based on search type OR fall back to mock comps for Taramore
    if (shouldUseMock) {
      console.log('Using mock Taramore comps due to missing API key or useMock flag');

      const dateWithinDays = (days: number) => {
        const d = new Date();
        d.setDate(d.getDate() - days);
        return d.toISOString().split('T')[0];
      };

      properties = [
        {
          location: { address: { line: '1234 Taramore Dr', city: 'Brentwood', state_code: 'TN', postal_code: '37027' } },
          sold_date: dateWithinDays(45),
          price: 1350000,
          beds: 5,
          baths: 4.5,
          photos: [
            { href: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80' },
            { href: 'https://images.unsplash.com/photo-1505691723518-36a5ac3b2bba?auto=format&fit=crop&w=1600&q=80' },
            { href: 'https://images.unsplash.com/photo-1505691723147-36a5ac3b2bba?auto=format&fit=crop&w=1600&q=80' },
          ],
          primary_photo: { href: 'https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1600&q=80' }
        },
        {
          location: { address: { line: '1456 Taramore Ln', city: 'Brentwood', state_code: 'TN', postal_code: '37027' } },
          sold_date: dateWithinDays(72),
          price: 1495000,
          beds: 5,
          baths: 5,
          photos: [
            { href: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1600&q=80' },
            { href: 'https://images.unsplash.com/photo-1502673530728-f79b4cab31b1?auto=format&fit=crop&w=1600&q=80' },
            { href: 'https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?auto=format&fit=crop&w=1600&q=80' },
          ],
          primary_photo: { href: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80' }
        },
        {
          location: { address: { line: '1688 Hamilton Chase', city: 'Brentwood', state_code: 'TN', postal_code: '37027' } },
          sold_date: dateWithinDays(30),
          price: 1280000,
          beds: 4,
          baths: 4,
          photos: [
            { href: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1600&q=80' },
            { href: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=1600&q=80' },
            { href: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1600&q=80' },
          ],
          primary_photo: { href: 'https://images.unsplash.com/photo-1505692794403-34d4982fd1bd?auto=format&fit=crop&w=1600&q=80' }
        },
        {
          location: { address: { line: '1702 Taramore Ct', city: 'Brentwood', state_code: 'TN', postal_code: '37027' } },
          sold_date: dateWithinDays(95),
          price: 1420000,
          beds: 5,
          baths: 4.5,
          photos: [
            { href: 'https://images.unsplash.com/photo-1505691723147-36a5ac3b2bba?auto=format&fit=crop&w=1600&q=80' },
            { href: 'https://images.unsplash.com/photo-1507086181904-9cf9e1e6c1f8?auto=format&fit=crop&w=1600&q=80' },
            { href: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1600&q=80' },
          ],
          primary_photo: { href: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=80' }
        },
        {
          location: { address: { line: '1805 Taramore Ln', city: 'Brentwood', state_code: 'TN', postal_code: '37027' } },
          sold_date: dateWithinDays(20),
          price: 1390000,
          beds: 4,
          baths: 4,
          photos: [
            { href: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=80' },
            { href: 'https://images.unsplash.com/photo-1505691723518-36a5ac3b2bba?auto=format&fit=crop&w=1600&q=80' },
            { href: 'https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=1600&q=80' },
          ],
          primary_photo: { href: 'https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=1600&q=80' }
        }
      ];
    } else {
      // Live API mode
      const apiKey = RAPIDAPI_KEY as string;

      // If searching by address and want subdivision comps, first get the subdivision name
      if (searchType === 'address' && searchParams.findSubdivision) {
        console.log('Looking up subdivision for address:', searchParams.address);
        
        const addressLookupOptions = {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': 'realtor16.p.rapidapi.com'
          } as Record<string, string>
        };

        // Search for the specific property to get its details including subdivision
        const lookupUrl = `https://realtor16.p.rapidapi.com/search/forsale?location=${encodeURIComponent(searchParams.address)}&limit=1`;
        console.log('Address lookup URL:', lookupUrl);
        
        const lookupResponse = await fetch(lookupUrl, addressLookupOptions);
        
        if (lookupResponse.ok) {
          const lookupData = await lookupResponse.json();
          const foundProperty = lookupData?.properties?.[0];
          
          if (foundProperty) {
            const neighborhood = foundProperty.location?.neighborhoods?.[0]?.name;
            const subdivision = foundProperty.location?.address?.subdivision;
            const subName = neighborhood || subdivision;
            
            console.log('Found subdivision:', subName);
            
            if (subName) {
              // Now search for sold comps in that subdivision
              searchType = 'subdivision';
              searchParams = {
                subdivisionName: subName,
                city: foundProperty.location?.address?.city || 'Brentwood',
                state: foundProperty.location?.address?.state_code || 'TN'
              };
            }
          }
        }
      }

      if (searchType === 'address' || searchType === 'zip_code') {
        // Search for properties by address or zip
        const location = searchType === 'address' ? searchParams.address : searchParams.zipCode;
        
        const options = {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': 'realtor16.p.rapidapi.com'
          } as Record<string, string>
        };

        // Fetch SOLD property listings for comparables analysis
        // Filter for recent sales (last 6 months)
        const soldDateMin = new Date();
        soldDateMin.setDate(soldDateMin.getDate() - 180); // 6 months ago
        const soldDateMinStr = soldDateMin.toISOString().split('T')[0];
        
        const listingsUrl = `https://realtor16.p.rapidapi.com/search/forsold?location=${encodeURIComponent(location)}&limit=50&sold_date_min=${soldDateMinStr}`;
        console.log('Fetching comps near:', location);
        
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
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': 'realtor16.p.rapidapi.com'
          } as Record<string, string>
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
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': 'realtor16.p.rapidapi.com'
          } as Record<string, string>
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
