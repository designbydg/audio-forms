import { Button } from '@/components/ui/button';
import { Square, Play, X, RotateCcw } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface RecordingControlsProps {
  isRecording: boolean;
  audioBlob: Blob | null;
  isPlaying: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onTogglePlayback: () => void;
  onReset: () => void;
}

export function RecordingControls({
  isRecording,
  audioBlob,
  isPlaying,
  onStartRecording,
  onStopRecording,
  onTogglePlayback,
  onReset,
}: RecordingControlsProps) {
  if (!audioBlob && !isRecording) {
    return (
      <button
        onClick={onStartRecording}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-200 text-sm text-gray-700"
      >
        <Square className="h-4 w-4" />
        <span className="font-medium">Record answer</span>
      </button>
    );
  }

  if (isRecording) {
    return (
      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          size="icon"
          className="h-10 w-10 rounded-full bg-gray-200 hover:bg-gray-300"
          onClick={onStopRecording}
        >
          <Square className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="h-10 w-10 rounded-full bg-gray-200 hover:bg-gray-300"
          onClick={onReset}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="secondary"
        size="icon"
        className="h-10 w-10 rounded-full bg-gray-200 hover:bg-gray-300"
        onClick={onTogglePlayback}
      >
        {isPlaying ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="secondary"
            size="icon"
            className="h-10 w-10 rounded-full bg-gray-200 hover:bg-gray-300"
          >
            <X className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Recording</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel? Your recording will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Recording</AlertDialogCancel>
            <AlertDialogAction onClick={onReset}>Yes, Cancel</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}