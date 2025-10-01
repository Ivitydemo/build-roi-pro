import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not set')
    }

    const { scenes } = await req.json()

    if (!scenes || !Array.isArray(scenes)) {
      return new Response(
        JSON.stringify({ error: "scenes array is required" }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    console.log(`Generating ${scenes.length} scene images...`)

    const generatedScenes = []

    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i]
      console.log(`Generating scene ${i + 1}: ${scene.prompt}`)

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image-preview",
          messages: [
            {
              role: "user",
              content: scene.prompt
            }
          ],
          modalities: ["image", "text"]
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Error generating scene ${i + 1}:`, errorText)
        throw new Error(`Failed to generate scene ${i + 1}: ${errorText}`)
      }

      const data = await response.json()
      const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url

      if (!imageUrl) {
        throw new Error(`No image generated for scene ${i + 1}`)
      }

      generatedScenes.push({
        ...scene,
        imageUrl
      })

      console.log(`Scene ${i + 1} generated successfully`)
    }

    return new Response(
      JSON.stringify({ scenes: generatedScenes }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error("Error in generate-pitch-scenes function:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
