import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import BrowserNarration from "@/components/BrowserNarration";
import { PitchVideoPlayer } from "@/components/PitchVideoPlayer";
import { getPitchScript } from "@/utils/pitchScripts";
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
  const [audioUrl, setAudioUrl] = useState<string>("/pitch-narration.mp3");
  const [campaignType, setCampaignType] = useState<'renovation' | 'new_home'>('renovation');
  
  useEffect(() => {
    document.title = "See ValueBuilder Pro in Action";
  }, []);

  const pitchScript = getPitchScript(campaignType);
  
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
            <h1 className="text-4xl font-bold mb-2">See ValueBuilder Pro in Action</h1>
            <p className="text-muted-foreground mb-4">
              Watch how top contractors transform price objections into closed deals
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-3 bg-background/50 rounded">
                <div className="font-semibold text-primary mb-1">🎯 The Problem</div>
                <div className="text-muted-foreground">Losing to cheaper bids</div>
              </div>
              <div className="p-3 bg-background/50 rounded">
                <div className="font-semibold text-primary mb-1">💡 The Solution</div>
                <div className="text-muted-foreground">Value-based selling</div>
              </div>
              <div className="p-3 bg-background/50 rounded">
                <div className="font-semibold text-primary mb-1">✅ The Results</div>
                <div className="text-muted-foreground">3-5x higher close rates</div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-card rounded-lg border border-primary/20 shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Watch How Top Contractors Win More Deals</h2>
              <PitchVideoPlayer scenes={pitchScenes} audioUrl={audioUrl} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoGenerator;