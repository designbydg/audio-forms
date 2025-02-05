import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { AudioControls } from './audio/AudioControls';
import { TranscriptionDisplay } from './audio/TranscriptionDisplay';
import { cleanAudioUrl } from '@/utils/audioUtils';

interface AudioResponsePlayerProps {
  response: string;
  responseId: string;
}

export function AudioResponsePlayer({ response, responseId }: AudioResponsePlayerProps) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isTextResponse, setIsTextResponse] = useState(false);

  const requestTranscription = async (url: string) => {
    try {
      setIsTranscribing(true);
      
      const { data, error } = await supabase.functions.invoke('transcribe-audio', {
        body: { audioUrl: url },
      });

      if (error) throw error;

      if (data?.text) {
        setTranscription(data.text);
        
        const { error: insertError } = await supabase
          .from('transcriptions')
          .insert({
            response_id: responseId,
            audio_path: response,
            transcription: data.text
          });

        if (insertError) {
          console.error('Error saving transcription:', insertError);
          toast({
            title: "Error",
            description: "Failed to save transcription",
            variant: "destructive",
          });
        }
      }
    } catch (err) {
      console.error('Transcription error:', err);
      toast({
        title: "Error",
        description: "Failed to transcribe audio",
        variant: "destructive",
      });
    } finally {
      setIsTranscribing(false);
    }
  };

  useEffect(() => {
    const loadAudioAndTranscription = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Check if this is a text response (not a data URL or file path)
        if (!response.startsWith('data:audio') && !response.includes('.webm')) {
          setIsTextResponse(true);
          setTranscription(response);
          setIsLoading(false);
          return;
        }

        const { data: existingTranscription } = await supabase
          .from('transcriptions')
          .select('transcription')
          .eq('response_id', responseId)
          .eq('audio_path', response)
          .maybeSingle();

        if (existingTranscription?.transcription) {
          setTranscription(existingTranscription.transcription);
        }

        if (response.startsWith('data:audio')) {
          setAudioUrl(response);
        } else {
          const { data: audioData, error: storageError } = await supabase.storage
            .from('audio_responses')
            .createSignedUrl(response, 3600);

          if (storageError) {
            console.error('Storage error:', storageError);
            throw storageError;
          }

          if (audioData?.signedUrl) {
            const cleanUrl = cleanAudioUrl(audioData.signedUrl);
            console.log('Original URL:', audioData.signedUrl);
            console.log('Cleaned URL:', cleanUrl);
            
            setAudioUrl(cleanUrl);
            
            if (!transcription && !existingTranscription?.transcription && !isTranscribing) {
              await requestTranscription(cleanUrl);
            }
          } else {
            setError('Audio not found');
          }
        }
      } catch (err) {
        console.error('Error loading audio:', err);
        setError('Failed to load audio');
      } finally {
        setIsLoading(false);
      }
    };

    loadAudioAndTranscription();
  }, [response, responseId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isTextResponse) {
    return (
      <div className="space-y-2">
        <TranscriptionDisplay 
          transcription={transcription}
          isTranscribing={false}
          isTextResponse={true}
        />
      </div>
    );
  }

  if (error || !audioUrl) {
    return <div className="text-red-500">{error || 'Audio unavailable'}</div>;
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="w-full">
        <TranscriptionDisplay 
          transcription={transcription}
          isTranscribing={isTranscribing}
          isTextResponse={false}
        />
      </div>
      <div className="w-full sm:w-auto">
        <AudioControls 
          audioUrl={audioUrl}
          onError={setError}
        />
      </div>
    </div>
  );
}