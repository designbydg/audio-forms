import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SentimentAnalysis as SentimentData } from "@/types/analysis";
import { Smile, Meh, Frown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const SENTIMENT_COLORS = {
  negative: '#F94949',
  neutral: '#FFC772',
  positive: '#1bbb8b',
  default: '#94a3b8' // Using Tailwind's gray-400 for no responses
};

const SENTIMENT_BACKGROUND_COLORS = {
  negative: '#FFF1F1',
  neutral: '#FFF9F0',
  positive: '#F0FBF7',
  default: '#F9FAFB'
};

const SENTIMENT_BORDER_COLORS = {
  negative: '#FFE5E5',
  neutral: '#FFE5CC',
  positive: '#E5F5F0',
  default: '#E5E7EB'
};

const SENTIMENT_ICONS = {
  negative: Frown,
  neutral: Meh,
  positive: Smile
};

interface SentimentAnalysisProps {
  surveyId: string;
}

export function SentimentAnalysisCard({ surveyId }: SentimentAnalysisProps) {
  const { data: sentimentData, isLoading } = useQuery({
    queryKey: ['sentiment-analysis', surveyId],
    queryFn: async () => {
      console.log('Fetching sentiment analysis for survey:', surveyId);
      
      // Get the current session
      const { data: { session } } = await supabase.auth.getSession();
      
      const { data, error } = await supabase.functions.invoke('analyze-text', {
        body: { surveyId },
        headers: session?.access_token ? {
          Authorization: `Bearer ${session.access_token}`
        } : undefined
      });

      if (error) {
        console.error('Error fetching sentiment analysis:', error);
        return {
          positive: 0,
          negative: 0,
          neutral: 0
        };
      }

      console.log('Received sentiment data:', data);
      return data;
    },
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
  });

  if (isLoading) {
    return (
      <Card className="bg-white overflow-hidden">
        <CardHeader className="border-b border-gray-100 pb-4">
          <div className="space-y-1.5">
            <CardTitle className="text-lg font-semibold text-gray-900">Sentiment Analysis</CardTitle>
            <p className="text-sm text-gray-500">See how your audience feels about your content</p>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-[200px] text-gray-500">
            Loading sentiment analysis...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!sentimentData || !responses) {
    return (
      <Card className="bg-white overflow-hidden">
        <CardHeader className="border-b border-gray-100 pb-4">
          <div className="space-y-1.5">
            <CardTitle className="text-lg font-semibold text-gray-900">Sentiment Analysis</CardTitle>
            <p className="text-sm text-gray-500">See how your audience feels about your content</p>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-[200px] text-gray-500">
            No sentiment data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasResponses = responses.count > 0;

  // If there are no responses, all sentiment values should be 0
  const displayData = hasResponses ? sentimentData : {
    positive: 0,
    negative: 0,
    neutral: 0
  };

  return (
    <Card className="bg-white overflow-hidden">
      <CardHeader className="border-b border-gray-100 pb-4">
        <div className="space-y-1.5">
          <CardTitle className="text-lg font-semibold text-gray-900">Sentiment Analysis</CardTitle>
          <p className="text-sm text-gray-500">See how your audience feels about your content</p>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-8">
          <h3 className="text-2xl font-semibold text-gray-900">
            {!hasResponses 
              ? 'No responses received'
              : displayData.positive > 60 
              ? 'Overwhelmingly Positive'
              : displayData.positive > 40
              ? 'Generally Positive'
              : displayData.negative > 60
              ? 'Mostly Negative'
              : 'Mixed Feedback'}
          </h3>
          <div className="w-full h-2.5 bg-gray-100 rounded-full flex overflow-hidden">
            {!hasResponses ? (
              <div 
                className="h-full transition-all duration-500 ease-in-out" 
                style={{ 
                  width: '100%',
                  backgroundColor: SENTIMENT_COLORS.default 
                }} 
              />
            ) : (
              <>
                <div 
                  className="h-full transition-all duration-500 ease-in-out" 
                  style={{ 
                    width: `${displayData.negative}%`,
                    backgroundColor: SENTIMENT_COLORS.negative 
                  }} 
                />
                <div 
                  className="h-full transition-all duration-500 ease-in-out" 
                  style={{ 
                    width: `${displayData.neutral}%`,
                    backgroundColor: SENTIMENT_COLORS.neutral 
                  }} 
                />
                <div 
                  className="h-full transition-all duration-500 ease-in-out" 
                  style={{ 
                    width: `${displayData.positive}%`,
                    backgroundColor: SENTIMENT_COLORS.positive 
                  }} 
                />
              </>
            )}
          </div>
          
          <div className="grid grid-cols-3 gap-4 justify-items-center">
            {(['negative', 'neutral', 'positive'] as const).map((sentiment) => {
              const Icon = SENTIMENT_ICONS[sentiment];
              return (
                <div 
                  key={sentiment} 
                  className="text-center w-full p-4 rounded-lg transition-all duration-300"
                  style={{
                    backgroundColor: hasResponses ? SENTIMENT_BACKGROUND_COLORS[sentiment] : SENTIMENT_BACKGROUND_COLORS.default,
                    border: `1px solid ${hasResponses ? SENTIMENT_BORDER_COLORS[sentiment] : SENTIMENT_BORDER_COLORS.default}`
                  }}
                >
                  <p className="text-sm font-medium text-gray-500 mb-1.5 capitalize">{sentiment}</p>
                  <div className="flex items-center justify-center gap-2">
                    <Icon 
                      size={24}
                      className="stroke-current"
                      style={{ 
                        color: hasResponses ? SENTIMENT_COLORS[sentiment] : SENTIMENT_COLORS.default 
                      }}
                    />
                    <span className="text-2xl font-semibold text-gray-900">
                      {displayData[sentiment]}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}