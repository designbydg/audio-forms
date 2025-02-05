import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Pause, Play } from 'lucide-react';

interface AudioControlsProps {
  audioUrl: string;
  onError: (error: string) => void;
}

export function AudioControls({ audioUrl, onError }: AudioControlsProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(audioUrl);
    audioRef.current.addEventListener('ended', () => setIsPlaying(false));
    audioRef.current.addEventListener('error', () => {
      onError('Failed to load audio');
      setIsPlaying(false);
    });

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', () => setIsPlaying(false));
        audioRef.current.removeEventListener('error', () => {
          onError('Failed to load audio');
          setIsPlaying(false);
        });
        audioRef.current.pause();
      }
    };
  }, [audioUrl, onError]);

  const handleTogglePlayback = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex justify-start sm:justify-end">
      <Button 
        variant="dark"
        size="sm" 
        onClick={handleTogglePlayback}
        className="hover:bg-[#020817]/90 transition-colors duration-200"
      >
        {isPlaying ? (
          <>
            <Pause className="mr-2" />
            Pause Recording
          </>
        ) : (
          <>
            <Play className="mr-2" />
            Play Recording
          </>
        )}
      </Button>
    </div>
  );
}