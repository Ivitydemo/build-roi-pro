import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";
import BrowserNarration from "@/components/BrowserNarration";
import { PitchVideoPlayer } from "@/components/PitchVideoPlayer";
import scene01 from "@/assets/pitch-scenes/scene-01.jpg";
import scene02 from "@/assets/pitch-scenes/scene-02.jpg";
import scene03 from "@/assets/pitch-scenes/scene-03.jpg";
import scene04 from "@/assets/pitch-scenes/scene-04.jpg";
import scene05 from "@/assets/pitch-scenes/scene-05.jpg";
import scene06 from "@/assets/pitch-scenes/scene-06.jpg";
import scene07 from "@/assets/pitch-scenes/scene-07.jpg";
import scene08 from "@/assets/pitch-scenes/scene-08.jpg";
import scene09 from "@/assets/pitch-scenes/scene-09.jpg";
import scene10 from "@/assets/pitch-scenes/scene-10.jpg";
import scene11 from "@/assets/pitch-scenes/scene-11.jpg";
import scene12 from "@/assets/pitch-scenes/scene-12.jpg";

const VideoGenerator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [prompt, setPrompt] = useState(
    "Emotional journey: Start with a frustrated contractor losing a deal, papers scattered. Transform to confident contractor presenting on tablet, client nodding with impressed smile. End with handshake and celebration. Professional, cinematic lighting, 4K quality showing before/after transformation."
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  // Define pitch scenes with pre-generated images
  const pitchScenes = [
    { duration: 15, imageUrl: scene01, prompt: "Professional contractor at desk" },
    { duration: 12, imageUrl: scene02, prompt: "Homeowner comparing quotes" },
    { duration: 18, imageUrl: scene03, prompt: "Quality comparison" },
    { duration: 15, imageUrl: scene04, prompt: "Late night bid work" },
    { duration: 20, imageUrl: scene05, prompt: "Presenting ValueBuilder Pro" },
    { duration: 15, imageUrl: scene06, prompt: "ValueBuilder interface" },
    { duration: 18, imageUrl: scene07, prompt: "Reviewing value report" },
    { duration: 12, imageUrl: scene08, prompt: "Successful deal closing" },
    { duration: 15, imageUrl: scene09, prompt: "Growth metrics" },
    { duration: 18, imageUrl: scene10, prompt: "All-weather success" },
    { duration: 12, imageUrl: scene11, prompt: "CRM automation" },
    { duration: 17, imageUrl: scene12, prompt: "Team celebration" }
  ];

  // AI-optimized pitch script using PAS framework + emotional storytelling
  const pitchScript = `Picture this: You just spent 3 hours preparing the perfect quote. Your work is solid. Your price is fair. Then you hear those dreaded words... "We're going with someone cheaper."

You know you're worth more. But how do you prove it when homeowners only see dollar signs?

Here's the truth: most builders think the challenge is winning enough work. But the real constraint? Delivery capability — doing the right jobs, at the right margin, with predictable outcomes. When you shift the conversation to delivery and results, price stops being the headline.

And here's what changes everything: with the right narrative, you're not responding to bids — you're creating the demand and the budget. You set the scope. You define the priorities. You control the timeline. You're not fighting to win work — you're proving you can deliver the best outcome, fast and confidently.

What if you could make that shift in 2 minutes, automatically?

That's ValueBuilder Pro.

Walk into your next appointment with a comprehensive value report that reframes the decision around outcomes, not price. It shows the revised value of their home after your work versus its current value, the financial impact of their investment, and the long-term returns they'll realize. It positions you as the trusted advisor — not a number on a page.

Homeowners see you differently now. You're not another bid to compare. You're the expert who educated them, made the decision frictionless, and showed the total value — not just the cost. Most people choose the firm that advised them on the idea itself.

The results? Our contractors close 3 to 5 times more deals. Not by dropping prices — by proving delivery capability and demonstrating undeniable value.

Even better: this works in every market condition. When others chase price, you control the conversation. When the market dips, you're still closing because you've mastered the one skill that transcends cycles: financial selling tied to delivery.

While your competitors struggle and hope for better conditions, you create your own opportunities — and the budget to fund them. You own your course entirely.

Every report syncs directly to your CRM. No data entry. No missed follow-ups. Just clean workflows that turn prospects into contracts, automatically.

Here's what this really means: scale at will, protect margin, and operate with unshakeable confidence.

But here's the reality: right now, your competitors are racing to the bottom on price. And while they're doing that, the smart ones? They're already using tools like this to separate themselves. Every day you wait, someone else in your market is closing deals you should be winning.

Don't get left behind.

Stop chasing bids. Start controlling your destiny. Get ValueBuilder Pro today and join the contractors who are already transforming their business.

Visit ValueBuilderPro dot com and get started in minutes. Your next deal is waiting — close it like a pro.`;

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
    
    try {
      toast({ title: "Generating", description: "Creating your pitch audio narration..." });
      
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
      
      setIsGenerating(false);
      
      toast({ 
        title: "Complete!", 
        description: "Your pitch video is ready to play!" 
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
              disabled={isGenerating || !prompt}
              size="lg"
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Audio...
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


            {audioUrl && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Your Complete Pitch Video</h2>
                <div className="mb-3 p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-sm">
                    ✨ <strong>Professional pitch video with narration ready!</strong> AI-generated scenes perfectly synced with your voice narration.
                  </p>
                </div>
                
                <PitchVideoPlayer scenes={pitchScenes} audioUrl={audioUrl} />

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