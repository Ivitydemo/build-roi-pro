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
    const { propertyId } = await req.json();
    console.log('Analyzing targeted property:', propertyId);

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the property details
    const { data: property, error: fetchError } = await supabase
      .from('targeted_properties')
      .select('*')
      .eq('id', propertyId)
      .single();

    if (fetchError || !property) {
      throw new Error('Property not found');
    }

    // Update status to analyzing
    await supabase
      .from('targeted_properties')
      .update({ analysis_status: 'analyzing' })
      .eq('id', propertyId);

    const photoUrls = property.photo_urls || [];
    console.log('Analyzing', photoUrls.length, 'photos');

    if (photoUrls.length === 0) {
      throw new Error('No photos to analyze');
    }

    // Analyze up to 10 photos from the property
    const photosToAnalyze = photoUrls.slice(0, 10);
    const analyses: any[] = [];

    for (const photoUrl of photosToAnalyze) {
      try {
        const analysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You are a professional home renovation and materials expert. Analyze property photos to identify:
1. Quality level (Budget/Standard/Premium/Luxury)
2. Specific materials used (flooring, countertops, cabinets, fixtures, appliances)
3. Renovation status (Original/Partially Updated/Fully Renovated)
4. Value drivers (features that increase property value)
5. Estimated value impact ($)

Provide detailed, specific observations about materials and finishes that affect value.`
              },
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: 'Analyze this property photo and identify the quality level, materials, renovation status, and value impact.'
                  },
                  {
                    type: 'image_url',
                    image_url: {
                      url: photoUrl
                    }
                  }
                ]
              }
            ],
            max_tokens: 500
          }),
        });

        if (analysisResponse.ok) {
          const analysisData = await analysisResponse.json();
          const analysis = analysisData.choices[0].message.content;
          
          analyses.push({
            photo_url: photoUrl,
            analysis: analysis,
            timestamp: new Date().toISOString()
          });
          
          console.log('Analyzed photo:', photoUrl.substring(0, 50) + '...');
        } else {
          console.error('Analysis failed for photo:', photoUrl, analysisResponse.status);
        }

        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (photoError) {
        console.error('Error analyzing photo:', photoUrl, photoError);
      }
    }

    // Compile the analysis summary
    const summary = {
      total_photos_analyzed: analyses.length,
      analyses: analyses,
      overall_assessment: analyses.length > 0 ? 
        'Analysis completed. Review individual photo analyses for details.' :
        'No successful analyses',
      analyzed_at: new Date().toISOString()
    };

    // Update the property with analysis results
    const { error: updateError } = await supabase
      .from('targeted_properties')
      .update({ 
        analysis_status: 'completed',
        analysis_summary: summary
      })
      .eq('id', propertyId);

    if (updateError) {
      console.error('Error updating property analysis:', updateError);
      throw updateError;
    }

    // Update campaign analyzed count
    const { data: campaign } = await supabase
      .from('property_search_campaigns')
      .select('analyzed_properties')
      .eq('id', property.campaign_id)
      .single();

    if (campaign) {
      await supabase
        .from('property_search_campaigns')
        .update({ 
          analyzed_properties: (campaign.analyzed_properties || 0) + 1
        })
        .eq('id', property.campaign_id);
    }

    return new Response(JSON.stringify({ 
      success: true,
      summary: summary
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-targeted-properties:', error);
    
    // Try to update status to failed if we have a propertyId
    try {
      const { propertyId } = await req.json();
      if (propertyId) {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        
        await supabase
          .from('targeted_properties')
          .update({ analysis_status: 'failed' })
          .eq('id', propertyId);
      }
    } catch {}

    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
