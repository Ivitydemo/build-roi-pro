import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
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
  const [audioUrl] = useState<string>("/path-to-pregenerated-audio.mp3"); // Will be set to actual audio
  
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

Here's the truth: finding the right talent is usually the number one issue for builders. But how can you secure top talent with too little or inconsistent demand?

You're constantly toggling. Do I have enough work? Do I have enough capacity? Grow your team for demand, then demand slips — now you risk losing the great talent and subs you worked so hard to secure. It's whack-a-mole on a tightrope.

What if you could remove project demand as an obstacle entirely? Stop the back-and-forth. Focus where true value lives: delivery.

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