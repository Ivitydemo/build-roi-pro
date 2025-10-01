import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";
import BrowserNarration from "@/components/BrowserNarration";

const VideoGenerator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [prompt, setPrompt] = useState(
    "Emotional journey: Start with a frustrated contractor losing a deal, papers scattered. Transform to confident contractor presenting on tablet, client nodding with impressed smile. End with handshake and celebration. Professional, cinematic lighting, 4K quality showing before/after transformation."
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [predictionId, setPredictionId] = useState<string | null>(null);
  
  // AI-optimized pitch script using PAS framework + emotional storytelling
  const pitchScript = `Picture this: You just spent 3 hours preparing the perfect quote. Your work is solid. Your price is fair. Then you hear those dreaded words... "We're going with someone cheaper."

You know you're worth more. But how do you prove it when homeowners only see dollar signs?

Here's the brutal truth: 73% of contractors lose deals not because they're too expensive, but because they can't demonstrate their value. You're competing with a number on a page... and numbers lie.

And here's the real trap: You're responding to bids. Huge time investments. Lower odds of closing. Razor-thin margins. You're at the mercy of whoever's shopping around for the lowest price.

But here's what the top contractors know: Your biggest obstacle isn't opportunity. It's delivery capacity. When you can prove value instantly, you control your destiny. You're not responding to bids anymore. You're creating demand. Not the market. You do.

What if instead, you could show your prospects exactly why you're worth every penny? In 2 minutes. Automatically.

That's ValueBuilder Pro.

Imagine walking into your next appointment with a comprehensive value report that proves you're not just the better choice - you're the only choice that makes financial sense.

Your report shows market comparables proving your pricing is competitive. Financial projections revealing how much homeowners save long-term. Risk analysis showing why cutting corners costs more. All presented in stunning visuals that scream professional credibility.

Homeowners see the full picture. Suddenly, you're not competing on price anymore. You're the trusted advisor who just showed them something no other contractor could.

The results? Our contractors close 3 to 5 times more deals. Not by dropping prices. By demonstrating undeniable value.

And here's where it gets really powerful: This financial selling capability works in every market condition. When others are struggling, you're thriving. When the market dips, your competitors disappear. But you? You're closing deals because you've mastered the one skill that transcends market cycles.

You're not a victim of the market. You're not even a victor in the market. You own your course entirely. While others pray for better conditions, you create your own opportunities.

Every report syncs directly to your CRM. No data entry. No missed follow-ups. Just smooth workflows that turn prospects into contracts, automatically.

Here's what this really means: Scale at will. Higher margins. Unshakeable confidence. And the freedom to grow your business on your terms, regardless of what the economy is doing.

Stop chasing bids. Start controlling your destiny.

Right now, while your competitors are racing to the bottom on price, you can rise above with value. The choice is yours.

ValueBuilder Pro. Stop losing on price. Start winning on value. Own your market.`;

  const checkStatus = async (id: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-video`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ predictionId: id }),
        }
      );

      const data = await response.json();
      
      if (data.status === "succeeded") {
        const out = data.output;
        const url = typeof out === "string" ? out : out?.url ?? out?.[0]?.url ?? out?.[0];
        if (url) setVideoUrl(url as string);
        setIsGenerating(false);
        toast({
          title: "Video generated!",
          description: "Your pitch video is ready.",
        });
      } else if (data.status === "failed") {
        setIsGenerating(false);
        toast({
          title: "Generation failed",
          description: "There was an error generating your video.",
          variant: "destructive",
        });
      } else {
        // Still processing, check again in 3 seconds
        setTimeout(() => checkStatus(id), 3000);
      }
    } catch (error) {
      console.error("Error checking status:", error);
      setIsGenerating(false);
      toast({
        title: "Error",
        description: "Failed to check video status.",
        variant: "destructive",
      });
    }
  };

  // Helper to get audio duration from blob
  const getAudioDuration = (blob: Blob): Promise<number> => {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.src = URL.createObjectURL(blob);
      audio.addEventListener('loadedmetadata', () => {
        URL.revokeObjectURL(audio.src);
        resolve(audio.duration);
      });
      audio.addEventListener('error', reject);
    });
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setVideoUrl(null);
    
    try {
      // Step 1: Generate audio first to get duration
      toast({ title: "Step 1/2", description: "Generating voice narration..." });
      
      const audioResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-narration`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ 
            script: pitchScript,
            voice: "nova"
          }),
        }
      );

      if (!audioResponse.ok) {
        throw new Error("Failed to generate audio narration");
      }

      const audioData = await audioResponse.json();
      
      // Convert base64 to blob and get duration
      const audioBlob = await fetch(`data:audio/mp3;base64,${audioData.audioContent}`).then(r => r.blob());
      const audioDuration = await getAudioDuration(audioBlob);
      
      console.log("Audio duration:", audioDuration, "seconds");
      
      // Step 2: Generate video with duration info
      toast({ title: "Step 2/2", description: "Generating video to match narration..." });
      
      const enhancedPrompt = `${prompt} Duration: approximately ${Math.ceil(audioDuration)} seconds to match voice narration.`;
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-video`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ prompt: enhancedPrompt }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const msg = data?.error as string | undefined;
        if (response.status === 429) {
          toast({
            title: "Rate limited",
            description: "Replicate free tier limit hit. Please wait a few seconds or add a payment method to your Replicate account.",
            variant: "destructive",
          });
          setIsGenerating(false);
          return;
        }
        if (response.status === 422) {
          toast({
            title: "Model access error",
            description: msg || "The selected video model isn't available. Please try again.",
            variant: "destructive",
          });
          setIsGenerating(false);
          return;
        }
        toast({ title: "Error", description: msg || "Failed to start video generation.", variant: "destructive" });
        setIsGenerating(false);
        return;
      }

      if (data.id) {
        setPredictionId(data.id);
        toast({
          title: "Generating video...",
          description: `Creating ${Math.ceil(audioDuration)}s video to match narration.`,
        });
        checkStatus(data.id);
      } else if (data.output) {
        const out = data.output;
        const url = typeof out === "string" ? out : out?.url ?? out?.[0]?.url ?? out?.[0];
        if (url) {
          setVideoUrl(url as string);
          setIsGenerating(false);
          toast({ title: "Video generated!", description: "Your pitch video is ready with synced narration." });
        } else {
          throw new Error("No output URL found");
        }
      } else {
        throw new Error("No prediction ID returned");
      }
    } catch (error) {
      console.error("Error generating video:", error);
      setIsGenerating(false);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate video.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="max-w-4xl mx-auto">
          <div className="mb-8 p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
            <h1 className="text-4xl font-bold mb-2">Generate Your Pitch Video</h1>
            <p className="text-muted-foreground mb-4">
              Create a compelling video pitch that makes prospects feel the transformation
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-3 bg-background/50 rounded">
                <div className="font-semibold text-primary mb-1">🎯 Hook</div>
                <div className="text-muted-foreground">Start with their pain</div>
              </div>
              <div className="p-3 bg-background/50 rounded">
                <div className="font-semibold text-primary mb-1">💡 Solution</div>
                <div className="text-muted-foreground">Show transformation</div>
              </div>
              <div className="p-3 bg-background/50 rounded">
                <div className="font-semibold text-primary mb-1">✅ Proof</div>
                <div className="text-muted-foreground">3-5x higher close rates</div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Video Description
              </label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={6}
                placeholder="Describe the video you want to generate..."
                className="w-full"
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt}
              size="lg"
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Video...
                </>
              ) : (
                "Generate Video"
              )}
            </Button>

            <div className="mt-8 p-6 bg-card rounded-lg border border-primary/20 shadow-lg">
              <h2 className="text-2xl font-bold mb-4">🎙️ AI Voice Narration</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Generate professional voiceover using OpenAI's text-to-speech. Requires OpenAI API key.
              </p>
              <BrowserNarration script={pitchScript} />
            </div>


            {videoUrl && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Your Video</h2>
                <div className="mb-3 p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-sm">
                    ✨ <strong>Video & narration synced!</strong> The video was generated to match the voice narration duration for seamless playback.
                  </p>
                </div>
                <video
                  src={videoUrl}
                  controls
                  className="w-full rounded-lg shadow-lg"
                  autoPlay
                  loop
                >
                  Your browser does not support the video tag.
                </video>
                <div className="mt-4 flex gap-4">
                  <Button
                    onClick={() => window.open(videoUrl, "_blank")}
                    variant="outline"
                  >
                    Download Video
                  </Button>
                  <Button onClick={() => setVideoUrl(null)} variant="outline">
                    Generate Another
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoGenerator;