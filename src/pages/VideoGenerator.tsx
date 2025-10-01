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
    "A luxury home exterior with financial graphs and ROI statistics floating holographically in the air. Professional, modern, high-tech visualization showing increasing property values and investment returns. Cinematic, 4K quality."
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [predictionId, setPredictionId] = useState<string | null>(null);
  const [isGeneratingNarration, setIsGeneratingNarration] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  // AI-generated pitch script for ValueBuilder Pro
  const pitchScript = `Transform your home service business with ValueBuilder Pro.
  
In today's competitive market, customers don't just want quotes - they want to understand the real value and return on investment of their projects.

ValueBuilder Pro revolutionizes how you present your services. In just 2 minutes, generate comprehensive value reports that showcase:

Market comparables that prove your competitive pricing
Financial projections showing long-term savings and ROI
Professional visualizations that build trust and credibility

Our clients see 3 to 5 times higher close rates because they're not competing on price alone - they're demonstrating undeniable value.

With seamless CRM integration, every report syncs automatically to your pipeline. No double entry, no missed follow-ups, just smooth workflows that scale with your business.

Stop losing deals to competitors who undercut on price. Start winning with value. ValueBuilder Pro - where every project tells a compelling story of return on investment.`;

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
          <h1 className="text-4xl font-bold mb-2">Generate Your Pitch Video</h1>
          <p className="text-muted-foreground mb-8">
            Create a compelling video pitch for ValueBuilder Pro
          </p>

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
              <div className="mt-8 p-6 bg-card rounded-lg border">
                <h2 className="text-2xl font-bold mb-4">Pitch Narration</h2>
                <div className="mb-4 p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-semibold mb-2">Script:</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
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