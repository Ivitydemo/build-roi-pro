import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { script, voice } = await req.json()

    if (!script) {
      throw new Error('Script is required')
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured')
    }

    // Use professional voice for business pitch (default: alloy)
    const voiceId = voice || 'alloy'
    
    console.log(`Generating narration with OpenAI voice ${voiceId}`)

    const response = await fetch(
      'https://api.openai.com/v1/audio/speech',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'tts-1',
          input: script,
          voice: voiceId,
          response_format: 'mp3',
        })
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      let message = `OpenAI TTS error (${response.status})`
      try {
        const parsed = JSON.parse(errorText)
        message = parsed.error?.message || message
      } catch {}

      // Surface quota/rate-limit clearly to client
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'OpenAI quota exceeded or rate limited. Please add billing/credits or try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ error: message }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get the audio as array buffer
    const arrayBuffer = await response.arrayBuffer()
    
    // Convert to base64 safely (without stack overflow)
    const bytes = new Uint8Array(arrayBuffer)
    let binary = ''
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    const base64Audio = btoa(binary)

    return new Response(
      JSON.stringify({ audioContent: base64Audio }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error in generate-narration function:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
