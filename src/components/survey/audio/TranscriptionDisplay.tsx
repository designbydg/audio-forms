
interface TranscriptionDisplayProps {
  transcription: string | null;
  isTranscribing: boolean;
  isTextResponse?: boolean;
}

export function TranscriptionDisplay({ 
  transcription, 
  isTranscribing,
  isTextResponse = false 
}: TranscriptionDisplayProps) {
  if (isTranscribing) {
    return <div className="text-sm text-muted-foreground">Transcribing...</div>;
  }

  if (transcription) {
    return (
      <div className="rounded-lg p-4">
        <p className="text-sm text-muted-foreground mb-2">
          {isTextResponse ? "Text Response:" : "Transcribed Text:"}
        </p>
        <p className="text-sm">{transcription}</p>
      </div>
    );
  }

  return null;
}
