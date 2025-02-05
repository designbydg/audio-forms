import { WaveformDisplay } from './audio/WaveformDisplay';
import { RecordingControls } from './audio/RecordingControls';
import { useAudioRecording } from '@/hooks/use-audio-recording';
import { Type } from 'lucide-react';

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
  onSwitchToText: () => void;
}

export function AudioRecorder({ onRecordingComplete, onSwitchToText }: AudioRecorderProps) {
  const {
    isRecording,
    recordingTime,
    audioBlob,
    isPlaying,
    analyser,
    startRecording,
    stopRecording,
    togglePlayback,
    resetRecording,
  } = useAudioRecording(onRecordingComplete);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {(isRecording || audioBlob) && (
        <div className="mb-4">
          <WaveformDisplay
            analyser={analyser}
            isRecording={isRecording}
            recordingTime={recordingTime}
            onStopRecording={stopRecording}
            onReset={resetRecording}
          />
        </div>
      )}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <RecordingControls
            isRecording={isRecording}
            audioBlob={audioBlob}
            isPlaying={isPlaying}
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
            onTogglePlayback={togglePlayback}
            onReset={resetRecording}
          />
          {(!isRecording && !audioBlob) && (
            <>
              <span className="text-sm text-gray-500 font-medium">OR</span>
              <button
                onClick={onSwitchToText}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-200 text-sm text-gray-700"
              >
                <Type className="h-4 w-4" />
                <span className="font-medium">Enter text instead</span>
              </button>
            </>
          )}
        </div>
        <p className="text-sm text-gray-500 pt-4">You can record up to 2 minutes for free</p>
      </div>
    </div>
  );
}