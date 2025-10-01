import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";
import BrowserNarration from "@/components/BrowserNarration";
import { PitchVideoPlayer } from "@/components/PitchVideoPlayer";

const VideoGenerator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [prompt, setPrompt] = useState(
    "Emotional journey: Start with a frustrated contractor losing a deal, papers scattered. Transform to confident contractor presenting on tablet, client nodding with impressed smile. End with handshake and celebration. Professional, cinematic lighting, 4K quality showing before/after transformation."
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [scenes, setScenes] = useState<any[] | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isGeneratingScenes, setIsGeneratingScenes] = useState(false);
  
  // Define pitch scenes with timing
  const pitchScenes = [
    {
      duration: 15,
      prompt: "Professional contractor sitting at desk, frustrated expression, scattered papers and calculator, rejected quote document visible, dramatic lighting, photorealistic, 4K quality"
    },
    {
      duration: 12,
      prompt: "Close-up of homeowner comparing multiple contractor quotes on kitchen table, calculator and pen, confused expression, overhead lighting, photorealistic"
    },
    {
      duration: 18,
      prompt: "Split screen comparison: left side showing cheap contractor with poor work quality, right side showing professional contractor with quality materials, dramatic contrast, photorealistic"
    },
    {
      duration: 15,
      prompt: "Contractor responding to bid request on laptop, clock showing late hours, stack of bid requests, tired expression, home office setting, cinematic lighting"
    },
    {
      duration: 20,
      prompt: "Confident contractor presenting ValueBuilder Pro report on tablet to interested homeowner couple in their living room, nodding with impressed smiles, modern home interior, professional lighting"
    },
    {
      duration: 15,
      prompt: "Tablet screen showing ValueBuilder Pro interface with home value comparison before and after renovation, graphs and charts, clean modern UI design, close-up shot"
    },
    {
      duration: 18,
      prompt: "Homeowner couple looking at detailed value report, pointing at financial impact section, engaged and educated expressions, comfortable home setting, warm lighting"
    },
    {
      duration: 12,
      prompt: "Contractor shaking hands with happy homeowner clients, signed contract visible on table, celebration mood, professional attire, bright daylight through windows"
    },
    {
      duration: 15,
      prompt: "Graph showing 3-5x increase in closed deals, upward trending arrow, professional business chart with ValueBuilder Pro branding, clean corporate aesthetic"
    },
    {
      duration: 18,
      prompt: "Contractor working confidently in different market conditions - sunny day, rainy day, showing adaptability and success, split timeline view, cinematic quality"
    },
    {
      duration: 12,
      prompt: "ValueBuilder Pro CRM dashboard on computer screen showing automated workflow, synced customer data, clean interface, professional workspace background"
    },
    {
      duration: 17,
      prompt: "Successful contractor team in modern office, growth charts on wall, confident poses, celebrating success, professional business environment, bright lighting"
    }
  ];

  // AI-optimized pitch script using PAS framework + emotional storytelling
  const pitchScript = `Picture this: You just spent 3 hours preparing the perfect quote. Your work is solid. Your price is fair. Then you hear those dreaded words... "We're going with someone cheaper."

You know you're worth more. But how do you prove it when homeowners only see dollar signs?

Here's the brutal truth: 73% of contractors lose deals not because they're too expensive, but because they can't demonstrate their value. You're competing with a number on a page... and numbers lie.

And here's the real trap: You're responding to bids. Huge time investments. Lower odds of closing. Razor-thin margins. You're at the mercy of whoever's shopping around for the lowest price.

But here's what the top contractors know: Your biggest obstacle isn't opportunity. It's delivery capacity. When you can prove value instantly, you control your destiny. You're not responding to bids anymore. You're creating demand. Not the market. You do.

What if instead, you could step out of the comparison game entirely? In 2 minutes. Automatically.

That's ValueBuilder Pro.

Imagine walking into your next appointment with a comprehensive value report that shows homeowners the transformation you're creating for their most valuable asset.

This isn't about comparing you to other contractors. It's a complete paradigm shift. Your report reveals the revised value of their home after your work versus its current value. The financial impact of their investment. The long-term returns they'll realize. All presented with the professionalism and education that positions you as their trusted advisor.

Homeowners see you differently now. You're not another bid to compare. You're the expert who educated them, made their decision frictionless, and showed them the true value of their investment. Most will go with the firm that advised them on the idea itself.

The results? Our contractors close 3 to 5 times more deals. Not by dropping prices. By demonstrating undeniable value.

And here's where it gets really powerful: This financial selling capability works in every market condition. When others are struggling, you're thriving. When the market dips, your competitors disappear. But you? You're closing deals because you've mastered the one skill that transcends market cycles.

You're not a victim of the market. You're not even a victor in the market. You own your course entirely. While others pray for better conditions, you create your own opportunities.

Every report syncs directly to your CRM. No data entry. No missed follow-ups. Just smooth workflows that turn prospects into contracts, automatically.

Here's what this really means: Scale at will. Higher margins. Unshakeable confidence. And the freedom to grow your business on your terms, regardless of what the economy is doing.

Stop chasing bids. Start controlling your destiny.

Right now, while your competitors are racing to the bottom on price, you can rise above with value. The choice is yours.

ValueBuilder Pro. Stop losing on price. Start winning on value. Own your market.`;

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
    setScenes(null);
    
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
      
      // Convert base64 to blob URL and store
      const audioBlob = await fetch(`data:audio/mp3;base64,${audioData.audioContent}`).then(r => r.blob());
      const audioBlobUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioBlobUrl);
      
      const audioDuration = await getAudioDuration(audioBlob);
      
      console.log("Audio duration:", audioDuration, "seconds");
      
      // Step 2: Generate scene images
      setIsGeneratingScenes(true);
      toast({ title: "Step 2/2", description: "Generating scene images for your pitch..." });
      
      const scenesResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-pitch-scenes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ scenes: pitchScenes }),
        }
      );

      if (!scenesResponse.ok) {
        throw new Error("Failed to generate scene images");
      }

      const scenesData = await scenesResponse.json();
      setScenes(scenesData.scenes);
      setIsGeneratingScenes(false);
      setIsGenerating(false);
      
      toast({ 
        title: "Complete!", 
        description: "Your pitch video with narration is ready to play!" 
      });
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
              disabled={isGenerating || isGeneratingScenes || !prompt}
              size="lg"
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isGeneratingScenes ? "Generating Scene Images..." : "Generating Audio..."}
                </>
              ) : (
                "Generate Complete Pitch Video"
              )}
            </Button>

            <div className="mt-8 p-6 bg-card rounded-lg border border-primary/20 shadow-lg">
              <h2 className="text-2xl font-bold mb-4">🎙️ AI Voice Narration</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Generate professional voiceover using OpenAI's text-to-speech. Requires OpenAI API key.
              </p>
              <BrowserNarration script={pitchScript} />
            </div>


            {scenes && audioUrl && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Your Complete Pitch Video</h2>
                <div className="mb-3 p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-sm">
                    ✨ <strong>Professional pitch video with narration ready!</strong> AI-generated scenes perfectly synced with your voice narration.
                  </p>
                </div>
                
                <PitchVideoPlayer scenes={scenes} audioUrl={audioUrl} />

                <div className="mt-4 flex gap-4">
                  <Button
                    onClick={() => {
                      const a = document.createElement('a');
                      a.href = audioUrl;
                      a.download = 'pitch-narration.mp3';
                      a.click();
                    }}
                    variant="outline"
                  >
                    Download Audio
                  </Button>
                  <Button 
                    onClick={() => { 
                      setScenes(null); 
                      setAudioUrl(null); 
                    }} 
                    variant="outline"
                  >
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