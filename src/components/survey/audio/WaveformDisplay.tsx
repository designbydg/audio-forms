import { useEffect, useRef } from 'react';
import { Progress } from '@/components/ui/progress';

interface WaveformDisplayProps {
  analyser: AnalyserNode | null;
  isRecording: boolean;
  recordingTime: number;
  onStopRecording: () => void;
  onReset: () => void;
}

const MAX_RECORDING_TIME = 120; // 2 minutes in seconds

export function WaveformDisplay({ 
  analyser, 
  isRecording, 
  recordingTime,
  onStopRecording,
  onReset
}: WaveformDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = (recordingTime / MAX_RECORDING_TIME) * 100;

  useEffect(() => {
    if (!analyser || !canvasRef.current || !isRecording) return;

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const draw = () => {
      if (!analyser || !canvasCtx) return;
      
      animationFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      canvasCtx.fillStyle = '#f8f9fb';
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        
        // Create gradient for bars
        const gradient = canvasCtx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, '#4f46e5');
        gradient.addColorStop(1, '#818cf8');
        
        canvasCtx.fillStyle = gradient;
        
        // Draw bar with rounded corners
        const x = (barWidth + 1) * i;
        const y = canvas.height - barHeight;
        
        canvasCtx.beginPath();
        canvasCtx.roundRect(x, y, barWidth, barHeight, [2]);
        canvasCtx.fill();
      }
    };

    draw();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [analyser, isRecording]);

  return (
    <div className="space-y-2">
      {isRecording && (
        <canvas 
          ref={canvasRef} 
          className="w-full h-24 bg-[#f8f9fb] rounded-lg"
          width={800}
          height={96}
        />
      )}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Progress value={progressPercentage} className="flex-1 h-1" />
          <span className="text-sm text-gray-500 whitespace-nowrap">
            {isRecording ? formatTime(MAX_RECORDING_TIME - recordingTime) : formatTime(recordingTime)}
          </span>
        </div>
      </div>
    </div>
  );
}