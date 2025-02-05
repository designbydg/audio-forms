import { format } from "date-fns";
import { ResponseRenderer } from "./ResponseRenderer";
import { AudioResponsePlayer } from "@/components/survey/AudioResponsePlayer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ResponseItemProps {
  index: number;
  questionType: string;
  responseData: Record<string, any>;
  questionId: string;
  responseId: string;
  createdAt: string;
}

export function ResponseItem({
  index,
  questionType,
  responseData,
  questionId,
  responseId,
  createdAt
}: ResponseItemProps) {
  const { data: transcription } = useQuery({
    queryKey: ['transcription', responseId],
    queryFn: async () => {
      if (questionType !== 'audio_response') return null;
      
      const { data, error } = await supabase
        .from('transcriptions')
        .select('transcription')
        .eq('response_id', responseId)
        .single();
      
      if (error) throw error;
      return data?.transcription;
    },
    enabled: questionType === 'audio_response'
  });

  return (
    <div className="py-4 border-b last:border-b-0">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-muted-foreground">
          Response #{index + 1} • {format(new Date(createdAt), 'MMM d, yyyy h:mm a')}
        </div>
      </div>
      
      <div className="space-y-4 bg-[#F6F6F7] p-4 rounded-md">
        {questionType === 'audio_response' ? (
          <AudioResponsePlayer response={responseData[questionId]} responseId={responseId} />
        ) : (
          <ResponseRenderer
            questionType={questionType}
            response={responseData[questionId]}
            responseId={responseId}
          />
        )}
      </div>
    </div>
  );
}