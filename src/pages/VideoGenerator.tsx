import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";

const VideoGenerator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [prompt, setPrompt] = useState(
    "Emotional journey: Start with a frustrated contractor losing a deal, papers scattered. Transform to confident contractor presenting on tablet, client nodding with impressed smile. End with handshake and celebration. Professional, cinematic lighting, 4K quality showing before/after transformation."
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [predictionId, setPredictionId] = useState<string | null>(null);
  const [isGeneratingNarration, setIsGeneratingNarration] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  // AI-optimized pitch script using PAS framework + emotional storytelling
  const pitchScript = `Picture this: You just spent 3 hours preparing the perfect quote. Your work is solid. Your price is fair. Then you hear those dreaded words... "We're going with someone cheaper."

You know you're worth more. But how do you prove it when homeowners only see dollar signs?

Here's the brutal truth: 73% of contractors lose deals not because they're too expensive, but because they can't demonstrate their value. You're competing with a number on a page... and numbers lie.

What if instead, you could show your prospects exactly why you're worth every penny? In 2 minutes. Automatically.

That's ValueBuilder Pro.

Imagine walking into your next appointment with a comprehensive value report that proves you're not just the better choice - you're the only choice that makes financial sense.

Your report shows market comparables proving your pricing is competitive. Financial projections revealing how much homeowners save long-term. Risk analysis showing why cutting corners costs more. All presented in stunning visuals that scream professional credibility.

Homeowners see the full picture. Suddenly, you're not competing on price anymore. You're the trusted advisor who just showed them something no other contractor could.

The results? Our contractors close 3 to 5 times more deals. Not by dropping prices. By demonstrating undeniable value.

And it gets better: Every report syncs directly to your CRM. No data entry. No missed follow-ups. Just smooth workflows that turn prospects into contracts, automatically.

Here's what this really means: More wins. Higher margins. Less stress. And finally, getting paid what you're actually worth.

Right now, while your competitors are racing to the bottom on price, you can rise above with value. The choice is yours.

ValueBuilder Pro. Stop losing on price. Start winning on value.`;

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

  const handleGenerateNarration = async () => {
    setIsGeneratingNarration(true);
    setAudioUrl(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-narration`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ script: pitchScript }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate narration");
      }

      // Convert base64 to blob and create URL
      const audioBlob = base64ToBlob(data.audioContent, 'audio/mpeg');
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);

      toast({
        title: "Narration generated!",
        description: "Your pitch voiceover is ready.",
      });
    } catch (error) {
      console.error("Error generating narration:", error);
      toast({
        title: "Error",
        description: "Failed to generate narration. Make sure your ElevenLabs API key is configured.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingNarration(false);
    }
  };

  const base64ToBlob = (base64: string, mimeType: string) => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setVideoUrl(null);
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-video`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ prompt }),
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
          description: "This may take a few minutes.",
        });
        checkStatus(data.id);
      } else if (data.output) {
        const out = data.output;
        const url = typeof out === "string" ? out : out?.url ?? out?.[0]?.url ?? out?.[0];
        if (url) {
          setVideoUrl(url as string);
          setIsGenerating(false);
          toast({ title: "Video generated!", description: "Your pitch video is ready." });
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
        description: "Failed to start video generation.",
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <Button
                onClick={handleGenerateNarration}
                disabled={isGeneratingNarration}
                size="lg"
                variant="secondary"
                className="w-full"
              >
                {isGeneratingNarration ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Narration...
                  </>
                ) : (
                  "Generate AI Narration"
                )}
              </Button>
            </div>

            {audioUrl && (
              <div className="mt-8 p-6 bg-card rounded-lg border border-primary/20 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">🎤 Your Pitch Narration</h2>
                  <span className="text-sm text-primary font-semibold">Ready to convert!</span>
                </div>
                <div className="mb-4 p-4 bg-gradient-to-br from-muted/50 to-muted/30 rounded-lg border border-muted">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <span className="text-primary">📝</span> 
                    Optimized Script (PAS Framework)
                  </h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                    {pitchScript}
                  </p>
                </div>
                <audio
                  src={audioUrl}
                  controls
                  className="w-full"
                >
                  Your browser does not support the audio tag.
                </audio>
                <div className="mt-4">
                  <Button
                    onClick={() => {
                      const a = document.createElement('a');
                      a.href = audioUrl;
                      a.download = 'valuebuilder-pitch-narration.mp3';
                      a.click();
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Download Narration
                  </Button>
                </div>
              </div>
            )}

            {videoUrl && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Your Video</h2>
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