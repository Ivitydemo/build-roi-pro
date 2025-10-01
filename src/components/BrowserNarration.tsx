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

// Split long text into manageable chunks/sentences to improve reliability
function chunkText(text: string, maxLen = 220): string[] {
  // Split by sentence enders while keeping punctuation
  const parts = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const chunks: string[] = [];
  let buf = "";
  for (const p of parts) {
    if ((buf + " " + p).trim().length <= maxLen) {
      buf = (buf ? buf + " " : "") + p;
    } else {
      if (buf) chunks.push(buf);
      if (p.length <= maxLen) {
        chunks.push(p);
        buf = "";
      } else {
        // Hard wrap very long sentences
        for (let i = 0; i < p.length; i += maxLen) {
          chunks.push(p.slice(i, i + maxLen));
        }
        buf = "";
      }
    }
  }
  if (buf) chunks.push(buf);
  return chunks;
}

export default function BrowserNarration({ script }: BrowserNarrationProps) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceKey, setVoiceKey] = useState<string>("");
  const [rate, setRate] = useState<number>(1);
  const [pitch, setPitch] = useState<number>(1);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);

  const queueRef = useRef<string[]>([]);
  const idxRef = useRef<number>(0);
  const canceledRef = useRef<boolean>(false);

  // Load voices and set a stable unique key (voiceURI preferred)
  useEffect(() => {
    if (!supportsSpeech) return;

    const load = () => {
      const list = window.speechSynthesis.getVoices();
      // Deduplicate by voiceURI if present
      const map = new Map<string, SpeechSynthesisVoice>();
      for (const v of list) {
        const key = v.voiceURI || `${v.name}-${v.lang}`;
        if (!map.has(key)) map.set(key, v);
      }
      const unique = Array.from(map.values());
      setVoices(unique);

      if (!voiceKey && unique.length > 0) {
        const preferred =
          unique.find((v) => /en(-|_)?(US|GB)/i.test(v.lang) && /female/i.test(v.name)) ||
          unique.find((v) => /en(-|_)?(US|GB)/i.test(v.lang)) ||
          unique[0];
        setVoiceKey(preferred.voiceURI || `${preferred.name}-${preferred.lang}`);
      }
    };

    // Some browsers populate asynchronously
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [voiceKey]);

  const selectedVoice = useMemo(() => {
    if (!voiceKey) return null;
    return (
      voices.find((v) => (v.voiceURI || `${v.name}-${v.lang}`) === voiceKey) || null
    );
  }, [voices, voiceKey]);

  const stop = () => {
    if (!supportsSpeech) return;
    canceledRef.current = true;
    window.speechSynthesis.cancel();
    queueRef.current = [];
    idxRef.current = 0;
    setSpeaking(false);
    setPaused(false);
  };

  const speakNext = () => {
    if (!supportsSpeech) return;
    if (canceledRef.current) return;

    const idx = idxRef.current;
    if (idx >= queueRef.current.length) {
      setSpeaking(false);
      setPaused(false);
      return;
    }

    const u = new SpeechSynthesisUtterance(queueRef.current[idx]);
    u.rate = rate; // 0.1 - 10
    u.pitch = pitch; // 0 - 2
    if (selectedVoice) u.voice = selectedVoice;

    u.onend = () => {
      if (canceledRef.current) return;
      idxRef.current = idx + 1;
      speakNext();
    };
    u.onerror = () => {
      if (canceledRef.current) return;
      idxRef.current = idx + 1;
      speakNext();
    };

    window.speechSynthesis.speak(u);
  };

  const play = () => {
    if (!supportsSpeech) return;

    // If paused, just resume
    if (paused) {
      window.speechSynthesis.resume();
      setPaused(false);
      return;
    }

    // If already speaking, restart
    if (speaking) {
      stop();
    }

    canceledRef.current = false;
    queueRef.current = chunkText(script);
    idxRef.current = 0;

    if (queueRef.current.length === 0) return;

    setSpeaking(true);
    speakNext();
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
          <Select value={voiceKey} onValueChange={setVoiceKey}>
            <SelectTrigger>
              <SelectValue placeholder="Select a voice" />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              {voices.map((v, i) => {
                const key = v.voiceURI || `${v.name}-${v.lang}`;
                return (
                  <SelectItem key={key} value={key}>
                    {v.name} {v.lang ? `(${v.lang})` : ""}
                  </SelectItem>
                );
              })}
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
