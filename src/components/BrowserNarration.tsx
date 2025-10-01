import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Pause, Play, Square } from "lucide-react";

interface BrowserNarrationProps {
  script: string;
}

const supportsSpeech = typeof window !== "undefined" && "speechSynthesis" in window;

export default function BrowserNarration({ script }: BrowserNarrationProps) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceName, setVoiceName] = useState<string>("");
  const [rate, setRate] = useState<number>(1);
  const [pitch, setPitch] = useState<number>(1);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load voices (handle async population in some browsers)
  useEffect(() => {
    if (!supportsSpeech) return;

    const load = () => {
      const list = window.speechSynthesis.getVoices();
      setVoices(list);
      // Pick a sensible default once voices are available
      if (!voiceName && list.length > 0) {
        const preferred =
          list.find(v => /en(-|_)?(US|GB)/i.test(v.lang) && /female/i.test(v.name)) ||
          list.find(v => /en(-|_)?(US|GB)/i.test(v.lang)) ||
          list[0];
        setVoiceName(preferred?.name || list[0].name);
      }
    };

    load();
    window.speechSynthesis.onvoiceschanged = load;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [voiceName]);

  const selectedVoice = useMemo(
    () => voices.find(v => v.name === voiceName) || null,
    [voices, voiceName]
  );

  const stop = () => {
    if (!supportsSpeech) return;
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setSpeaking(false);
    setPaused(false);
  };

  const play = () => {
    if (!supportsSpeech) return;
    // If currently paused, just resume
    if (paused) {
      window.speechSynthesis.resume();
      setPaused(false);
      return;
    }

    // If already speaking, restart
    if (speaking) {
      stop();
    }

    const u = new SpeechSynthesisUtterance(script);
    u.rate = rate; // 0.1 - 10
    u.pitch = pitch; // 0 - 2
    if (selectedVoice) u.voice = selectedVoice;

    u.onend = () => {
      setSpeaking(false);
      setPaused(false);
      utteranceRef.current = null;
    };
    u.onerror = () => {
      setSpeaking(false);
      setPaused(false);
      utteranceRef.current = null;
    };

    utteranceRef.current = u;
    window.speechSynthesis.speak(u);
    setSpeaking(true);
  };

  const pause = () => {
    if (!supportsSpeech) return;
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setPaused(true);
    }
  };

  if (!supportsSpeech) {
    return (
      <div className="p-4 rounded border border-destructive/40 bg-destructive/10 text-destructive">
        Your browser does not support speech synthesis. Please try Chrome, Edge, or Safari.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Voice</Label>
          <Select value={voiceName} onValueChange={setVoiceName}>
            <SelectTrigger>
              <SelectValue placeholder="Select a voice" />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              {voices.map((v) => (
                <SelectItem key={v.name} value={v.name}>
                  {v.name} {v.lang ? `(${v.lang})` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Rate: {rate.toFixed(2)}</Label>
          <Slider
            value={[rate]}
            onValueChange={(val) => setRate(val[0])}
            min={0.75}
            max={1.25}
            step={0.01}
          />
        </div>

        <div className="space-y-2">
          <Label>Pitch: {pitch.toFixed(2)}</Label>
          <Slider
            value={[pitch]}
            onValueChange={(val) => setPitch(val[0])}
            min={0.75}
            max={1.25}
            step={0.01}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {!speaking || paused ? (
          <Button onClick={play} size="lg">
            <Play className="mr-2 h-4 w-4" />
            {paused ? "Resume" : "Play"}
          </Button>
        ) : (
          <Button onClick={pause} variant="secondary" size="lg">
            <Pause className="mr-2 h-4 w-4" />
            Pause
          </Button>
        )}
        <Button onClick={stop} variant="outline" size="lg">
          <Square className="mr-2 h-4 w-4" />
          Stop
        </Button>
      </div>
    </div>
  );
}
