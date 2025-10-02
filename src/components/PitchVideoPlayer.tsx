import { useEffect, useRef, useState } from "react";

interface Scene {
  duration: number;
  imageUrl: string;
  prompt: string;
}

interface PitchVideoPlayerProps {
  scenes: Scene[];
  audioUrl: string;
}

export const PitchVideoPlayer = ({ scenes, audioUrl }: PitchVideoPlayerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const animationRef = useRef<number>();
  const imagesRef = useRef<HTMLImageElement[]>([]);

  // Preload all images
  useEffect(() => {
    const loadImages = async () => {
      const imagePromises = scenes.map((scene, index) => {
        return new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => {
            console.log(`Image ${index + 1} loaded successfully`);
            resolve(img);
          };
          img.onerror = (e) => {
            console.error(`Error loading image ${index + 1}:`, e);
            reject(e);
          };
          img.src = scene.imageUrl;
        });
      });

      try {
        imagesRef.current = await Promise.all(imagePromises);
        console.log("All images loaded, drawing first scene");
        // Draw the first scene immediately
        drawScene(0);
      } catch (error) {
        console.error("Error loading images:", error);
      }
    };

    loadImages();
  }, [scenes]);

  // Redraw when canvas ref is available
  useEffect(() => {
    if (canvasRef.current && imagesRef.current.length > 0) {
      drawScene(0);
    }
  }, [canvasRef.current]);

  // Draw current scene on canvas
  const drawScene = (time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.log("No canvas ref");
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.log("No canvas context");
      return;
    }

    let elapsed = 0;
    let currentSceneIndex = 0;

    for (let i = 0; i < scenes.length; i++) {
      if (time < elapsed + scenes[i].duration) {
        currentSceneIndex = i;
        break;
      }
      elapsed += scenes[i].duration;
    }

    // If the time exceeds total video duration, clamp to the last scene
    if (time >= totalDuration) {
      currentSceneIndex = scenes.length - 1;
    }

    console.log(`Drawing scene ${currentSceneIndex + 1} at time ${time.toFixed(1)}s`);

    const img = imagesRef.current[currentSceneIndex];
    if (!img) {
      console.log(`No image available for scene ${currentSceneIndex + 1}`);
      return;
    }

    if (!img.complete) {
      console.log(`Image ${currentSceneIndex + 1} not fully loaded yet`);
      return;
    }

    // Clear canvas
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate aspect ratio fit
    const imgAspect = img.width / img.height;
    const canvasAspect = canvas.width / canvas.height;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (imgAspect > canvasAspect) {
      drawWidth = canvas.width;
      drawHeight = canvas.width / imgAspect;
      offsetX = 0;
      offsetY = (canvas.height - drawHeight) / 2;
    } else {
      drawHeight = canvas.height;
      drawWidth = canvas.height * imgAspect;
      offsetX = (canvas.width - drawWidth) / 2;
      offsetY = 0;
    }

    try {
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      console.log(`Successfully drew scene ${currentSceneIndex + 1}`);
    } catch (error) {
      console.error(`Error drawing image ${currentSceneIndex + 1}:`, error);
    }
  };

  // Animation loop
  const animate = () => {
    const audio = audioRef.current;
    if (!audio || audio.paused) return;

    const time = audio.currentTime;
    setCurrentTime(time);
    drawScene(time);

    animationRef.current = requestAnimationFrame(animate);
  };

  const handlePlay = () => {
    const audio = audioRef.current;
    if (audio) {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          animationRef.current = requestAnimationFrame(animate);
        })
        .catch((err) => {
          console.error("Audio play failed:", err);
        });
    }
  };

  const handlePause = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      setIsPlaying(false);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (audio) {
      const time = parseFloat(e.target.value);
      audio.currentTime = time;
      setCurrentTime(time);
      drawScene(time);
    }
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const totalDuration = scenes.reduce((sum, scene) => sum + scene.duration, 0);

  const handleDownloadAudio = () => {
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = 'pitch-narration.mp3';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      <div className="relative bg-black rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          width={1920}
          height={1080}
          className="w-full h-auto"
        />
      </div>

      <audio
        ref={audioRef}
        src={audioUrl}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />

      <div className="space-y-2">
        <div className="flex gap-2 flex-wrap">
          {!isPlaying ? (
            <button
              onClick={handlePlay}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              ▶ Play
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              ⏸ Pause
            </button>
          )}
          <span className="px-4 py-2 text-sm">
            {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, "0")} / {Math.floor(totalDuration / 60)}:{Math.floor(totalDuration % 60).toString().padStart(2, "0")}
          </span>
          <button
            onClick={handleDownloadAudio}
            className="ml-auto px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90"
          >
            📥 Download Audio
          </button>
        </div>

        <input
          type="range"
          min="0"
          max={totalDuration}
          step="0.1"
          value={currentTime}
          onChange={handleSeek}
          className="w-full"
        />
      </div>
    </div>
  );
};
