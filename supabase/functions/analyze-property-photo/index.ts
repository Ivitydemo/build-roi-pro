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
    const { photoUrl, propertyId, analysisType = 'renovation' } = await req.json();
    
    if (!photoUrl) {
      return new Response(
        JSON.stringify({ error: 'Photo URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Analyzing photo:', photoUrl);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Create analysis prompt based on type
    const systemPrompt = `You are an expert property appraiser and renovation quality assessor. Analyze property photos to determine renovation quality, materials used, and estimated value impact.

Your analysis should include:
1. Overall renovation quality (poor, fair, good, excellent, luxury)
2. Specific materials identified (flooring, countertops, fixtures, finishes)
3. Rooms or spaces identified
4. Estimated value impact as a percentage (e.g., +15% for high-end kitchen, +5% for basic bath)
5. Confidence score (0-100)
6. Detailed notes about quality indicators

Be specific and data-driven. Consider:
- Material quality and brand indicators
- Craftsmanship and finish quality
- Design trends and market appeal
- Functional improvements vs cosmetic
- Regional market standards`;

    const userPrompt = analysisType === 'renovation' 
      ? 'Analyze this renovation photo and provide detailed assessment of quality, materials, and value impact.'
      : 'Analyze this property photo for condition, quality, and features that affect market value.';

    // Call Lovable AI with vision
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: [
              { type: 'text', text: userPrompt },
              { type: 'image_url', image_url: { url: photoUrl } }
            ]
          }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'property_analysis',
              description: 'Return structured property photo analysis',
              parameters: {
                type: 'object',
                properties: {
                  renovation_quality: {
                    type: 'string',
                    enum: ['poor', 'fair', 'good', 'excellent', 'luxury'],
                    description: 'Overall quality rating'
                  },
                  materials_detected: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Specific materials identified'
                  },
                  rooms_identified: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Rooms or spaces in the photo'
                  },
                  estimated_value_impact: {
                    type: 'number',
                    description: 'Estimated value impact percentage (e.g., 15 for +15%)'
                  },
                  confidence_score: {
                    type: 'number',
                    description: 'Confidence in analysis (0-100)'
                  },
                  detailed_notes: {
                    type: 'string',
                    description: 'Detailed analysis notes'
                  }
                },
                required: ['renovation_quality', 'materials_detected', 'rooms_identified', 'estimated_value_impact', 'confidence_score', 'detailed_notes'],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'property_analysis' } }
      }),
    });

    if (aiResponse.status === 429) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (aiResponse.status === 402) {
      return new Response(
        JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
        { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    console.log('AI response received:', aiData);

    // Extract tool call result
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error('No analysis result from AI');
    }

    const analysis = JSON.parse(toolCall.function.arguments);
    console.log('Parsed analysis:', analysis);

    // Store analysis in database if propertyId provided
    if (propertyId) {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );

      const { error: insertError } = await supabase
        .from('photo_analyses')
        .insert({
          property_id: propertyId,
          photo_url: photoUrl,
          analysis_data: analysis,
          renovation_quality: analysis.renovation_quality,
          estimated_value_impact: analysis.estimated_value_impact,
          materials_detected: analysis.materials_detected,
          rooms_identified: analysis.rooms_identified,
          confidence_score: analysis.confidence_score,
        });

      if (insertError) {
        console.error('Error storing analysis:', insertError);
        // Don't fail the request, just log the error
      }
    }

    return new Response(
      JSON.stringify({ success: true, analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in analyze-property-photo:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
