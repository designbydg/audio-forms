import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SentimentTrendProps {
  surveyId: string;
  isPublished: boolean;
}

export function SentimentTrend({ surveyId, isPublished }: SentimentTrendProps) {
  const { data: sentimentData } = useQuery({
    queryKey: ['sentiment-analysis', surveyId],
    queryFn: async () => {
      console.log('Fetching sentiment analysis for survey:', surveyId);
      const { data, error } = await supabase.functions.invoke('analyze-text', {
        body: { surveyId }
      });

      if (error) {
        console.error('Error fetching sentiment analysis:', error);
        return { positive: 0, negative: 0, neutral: 0 };
      }

      console.log('Received sentiment data:', data);
      return data;
    },
    enabled: isPublished,
  });

  const { data: responses } = useQuery({
    queryKey: ['survey-responses-count', surveyId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('responses')
        .select('*', { count: 'exact', head: true })
        .eq('survey_id', surveyId);

      if (error) {
        console.error('Error fetching survey response count:', error);
        return { count: 0 };
      }

      return { count: count || 0 };
    },
    enabled: isPublished,
  });

  if (!isPublished) {
    return (
      <div className="flex items-center gap-2">
        <div 
          className="w-24 h-1.5 rounded-full bg-gray-200" 
        />
      </div>
    );
  }

  if (!sentimentData || !responses) return null;

  const hasResponses = responses.count > 0;

  // If there are no responses, all sentiment values should be 0
  const displayData = hasResponses ? sentimentData : {
    positive: 0,
    negative: 0,
    neutral: 0
  };

  const { positive = 0, negative = 0, neutral = 0 } = displayData;

  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div 
              className="w-24 h-1.5 rounded-full cursor-pointer" 
              style={{ 
                background: hasResponses 
                  ? `linear-gradient(to right, 
                      #F94949 ${negative}%, 
                      #FFC772 ${negative}% ${negative + neutral}%, 
                      #1bbb8b ${negative + neutral}%)`
                  : '#94a3b8' // Tailwind gray-400 for no responses
              }} 
            />
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#F94949]" />
                <span>Negative: {negative}%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#FFC772]" />
                <span>Neutral: {neutral}%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#1bbb8b]" />
                <span>Positive: {positive}%</span>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}