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