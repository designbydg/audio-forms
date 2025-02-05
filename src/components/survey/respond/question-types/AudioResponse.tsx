import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Type } from "lucide-react";
import { useState } from "react";
import { AudioRecorder } from "@/components/survey/AudioRecorder";
import { supabase } from "@/integrations/supabase/client";

interface AudioResponseProps {
  questionId: string;
  response: string;
  onResponseChange: (questionId: string, response: any) => void;
}

export const AudioResponse = ({
  questionId,
  response,
  onResponseChange,
}: AudioResponseProps) => {
  const [showTextInput, setShowTextInput] = useState(false);

  const handleAudioRecording = async (audioBlob: Blob) => {
    try {
      const filename = `${crypto.randomUUID()}.webm`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('audio_responses')
        .upload(filename, audioBlob);

      if (uploadError) {
        console.error('Error uploading audio:', uploadError);
        throw uploadError;
      }

      onResponseChange(questionId, filename);
    } catch (error) {
      console.error('Error handling audio recording:', error);
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = () => {
        const base64data = reader.result as string;
        onResponseChange(questionId, base64data);
      };
    }
  };

  const handleSwitchToText = () => {
    setShowTextInput(true);
    // Clear any existing response when switching to text input
    onResponseChange(questionId, '');
  };

  return (
    <div className="space-y-4">
      {showTextInput ? (
        <div className="space-y-4">
          <Textarea
            value={response || ""}
            onChange={(e) => onResponseChange(questionId, e.target.value)}
            placeholder="Enter your answer"
            className="min-h-[100px]"
          />
          <Button
            onClick={() => setShowTextInput(false)}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <Mic className="h-4 w-4" />
            Switch to Audio Recording
          </Button>
        </div>
      ) : (
        <AudioRecorder 
          onRecordingComplete={handleAudioRecording} 
          onSwitchToText={handleSwitchToText}
        />
      )}
    </div>
  );
};