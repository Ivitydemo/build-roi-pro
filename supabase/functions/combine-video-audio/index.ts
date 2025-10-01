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
    const { videoUrl, audioBase64 } = await req.json()

    if (!videoUrl || !audioBase64) {
      return new Response(
        JSON.stringify({ error: "Missing videoUrl or audioBase64" }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    console.log("Downloading video from:", videoUrl)
    
    // Download the video
    const videoResponse = await fetch(videoUrl)
    if (!videoResponse.ok) {
      throw new Error(`Failed to download video: ${videoResponse.statusText}`)
    }
    const videoBlob = await videoResponse.blob()
    const videoArrayBuffer = await videoBlob.arrayBuffer()
    
    // Convert base64 audio to binary
    console.log("Converting audio from base64")
    const audioBuffer = Uint8Array.from(atob(audioBase64), c => c.charCodeAt(0))
    
    // Write temporary files
    const videoPath = `/tmp/input_video_${Date.now()}.mp4`
    const audioPath = `/tmp/input_audio_${Date.now()}.mp3`
    const outputPath = `/tmp/output_${Date.now()}.mp4`
    
    await Deno.writeFile(videoPath, new Uint8Array(videoArrayBuffer))
    await Deno.writeFile(audioPath, audioBuffer)
    
    console.log("Running FFmpeg to combine video and audio")
    
    // Use FFmpeg to combine video and audio
    const ffmpegProcess = new Deno.Command("ffmpeg", {
      args: [
        "-i", videoPath,
        "-i", audioPath,
        "-c:v", "copy",
        "-c:a", "aac",
        "-shortest",
        "-y",
        outputPath
      ],
      stdout: "piped",
      stderr: "piped",
    })
    
    const { code, stderr } = await ffmpegProcess.output()
    
    if (code !== 0) {
      const errorString = new TextDecoder().decode(stderr)
      console.error("FFmpeg error:", errorString)
      throw new Error(`FFmpeg failed with code ${code}`)
    }
    
    console.log("Reading combined video file")
    const combinedVideo = await Deno.readFile(outputPath)
    
    // Clean up temporary files
    try {
      await Deno.remove(videoPath)
      await Deno.remove(audioPath)
      await Deno.remove(outputPath)
    } catch (e) {
      console.warn("Failed to clean up temp files:", e)
    }
    
    // Convert to base64 for transfer
    const base64Video = btoa(String.fromCharCode(...combinedVideo))
    
    return new Response(
      JSON.stringify({ videoBase64: base64Video }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error("Error combining video and audio:", error)
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
