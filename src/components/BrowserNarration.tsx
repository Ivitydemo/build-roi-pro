import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Square, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface BrowserNarrationProps {
  script: string;
}

// Top OpenAI voices with excellent quality
const OPENAI_VOICES = [
  { id: 'alloy', name: 'Alloy - Neutral & Clear', description: 'Balanced, neutral voice for professional use' },
  { id: 'echo', name: 'Echo - Professional Male', description: 'Warm, professional male voice' },
  { id: 'fable', name: 'Fable - Warm & Expressive', description: 'Engaging and expressive' },
  { id: 'onyx', name: 'Onyx - Deep & Authoritative', description: 'Deep, commanding voice' },
  { id: 'nova', name: 'Nova - Friendly Female', description: 'Bright, friendly female voice' },
  { id: 'shimmer', name: 'Shimmer - Energetic Female', description: 'Energetic and vibrant' },
];

export default function BrowserNarration({ script }: BrowserNarrationProps) {
  const [voiceId, setVoiceId] = useState<string>('alloy'); // Default to Alloy
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const generateAudio = async () => {
    if (!script.trim()) {
      toast({
        title: "No script",
        description: "Please provide a script to narrate",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      console.log('Generating narration with OpenAI...');
      
      const { data, error } = await supabase.functions.invoke('generate-narration', {
        body: { script, voice: voiceId }
      });

      if (error) throw error;
      
      if (data?.audioContent) {
        // Clean up old audio URL if it exists
        if (audioUrl) {
          URL.revokeObjectURL(audioUrl);
        }

        // Convert base64 to blob
        const binaryString = atob(data.audioContent);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: 'audio/mpeg' });
        const url = URL.createObjectURL(blob);
        
        setAudioUrl(url);
        
        toast({
          title: "Audio generated!",
          description: "Ultra-realistic narration ready to play"
        });
      }
    } catch (error) {
      console.error('Error generating narration:', error);
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Failed to generate audio",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const playAudio = () => {
    if (!audioUrl) {
      toast({
        title: "No audio",
        description: "Generate audio first",
        variant: "destructive"
      });
      return;
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
        <p className="text-sm text-muted-foreground mb-2">
          🎙️ <strong>Professional AI Voices</strong> - Powered by OpenAI
        </p>
        <p className="text-xs text-muted-foreground">
          High-quality, natural-sounding voices perfect for professional presentations
        </p>
      </div>

      <div className="space-y-2">
        <Label>Voice Selection</Label>
        <Select value={voiceId} onValueChange={setVoiceId}>
          <SelectTrigger>
            <SelectValue placeholder="Select a voice" />
          </SelectTrigger>
          <SelectContent className="max-h-72">
            {OPENAI_VOICES.map((voice) => (
              <SelectItem key={voice.id} value={voice.id}>
                <div className="flex flex-col">
                  <span className="font-medium">{voice.name}</span>
                  <span className="text-xs text-muted-foreground">{voice.description}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-3">
        <Button 
          onClick={generateAudio} 
          disabled={isGenerating}
          size="lg"
          className="min-w-[140px]"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Audio'
          )}
        </Button>

        {audioUrl && (
          <>
            <Button 
              onClick={playAudio} 
              variant={isPlaying ? "secondary" : "default"}
              size="lg"
            >
              {isPlaying ? (
                <>
                  <Square className="mr-2 h-4 w-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Play
                </>
              )}
            </Button>

            <Button 
              onClick={stopAudio} 
              variant="outline" 
              size="lg"
            >
              <Square className="mr-2 h-4 w-4" />
              Stop
            </Button>
          </>
        )}
      </div>

      {/* Hidden audio element */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
        />
      )}
    </div>
  );
}
