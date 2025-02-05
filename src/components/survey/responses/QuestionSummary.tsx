import { Question } from "@/types/question";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

interface QuestionSummaryProps {
  question: Question;
  responses: any[];
}

export function QuestionSummary({ question, responses }: QuestionSummaryProps) {
  const validResponses = responses.filter(r => 
    r.response_data && r.response_data[question.id] !== undefined && 
    r.response_data[question.id] !== null && 
    r.response_data[question.id] !== ''
  );

  const { data: sentimentData } = useQuery({
    queryKey: ['sentiment-analysis', responses[0]?.survey_id],
    queryFn: async () => {
      if (question.questionType !== 'audio_response') return null;
      
      const { data, error } = await supabase.functions.invoke('analyze-text', {
        body: { surveyId: responses[0]?.survey_id },
      });

      if (error) {
        console.error('Error fetching sentiment analysis:', error);
        return null;
      }

      return data;
    },
    enabled: question.questionType === 'audio_response' && responses.length > 0,
  });

  const renderSentimentAnalysis = () => {
    if (!sentimentData) return null;

    const data = [
      { name: 'Positive', value: sentimentData.positive, color: '#1bbb8b' },
      { name: 'Neutral', value: sentimentData.neutral, color: '#FFC772' },
      { name: 'Negative', value: sentimentData.negative, color: '#F94949' },
    ];

    return (
      <div className="mt-4 space-y-4">
        <div className="text-sm font-medium">Sentiment Analysis</div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div className="w-full sm:w-1/2 h-[200px] min-w-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full sm:w-1/2 space-y-2 mt-4 sm:mt-0">
            {data.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{item.name}</span>
                <span className="text-sm font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const calculateSummary = () => {
    switch (question.questionType) {
      case 'multiple_choice':
      case 'dropdown': {
        const counts: Record<string, number> = {};
        validResponses.forEach(response => {
          const answer = response.response_data[question.id];
          counts[answer] = (counts[answer] || 0) + 1;
        });
        return (
          <div className="space-y-2">
            {Object.entries(counts).map(([option, count]) => (
              <div key={option} className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0">
                <span className="text-sm text-muted-foreground">{option}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{count}</span>
                  <span className="text-xs text-muted-foreground">
                    ({Math.round((count / validResponses.length) * 100)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        );
      }
      case 'checkboxes': {
        const counts: Record<string, number> = {};
        validResponses.forEach(response => {
          const answers = response.response_data[question.id];
          if (Array.isArray(answers)) {
            answers.forEach(answer => {
              counts[answer] = (counts[answer] || 0) + 1;
            });
          }
        });
        return (
          <div className="space-y-2">
            {Object.entries(counts).map(([option, count]) => (
              <div key={option} className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0">
                <span className="text-sm text-muted-foreground">{option}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{count}</span>
                  <span className="text-xs text-muted-foreground">
                    ({Math.round((count / validResponses.length) * 100)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        );
      }
      case 'rating':
      case 'linear_scale': {
        const total = validResponses.reduce((sum, response) => 
          sum + Number(response.response_data[question.id]), 0
        );
        const average = total / validResponses.length;
        return (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <span className="text-sm text-muted-foreground">Average Rating</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-semibold">{average.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">
                ({validResponses.length} responses)
              </span>
            </div>
          </div>
        );
      }
      default:
        return (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <span className="text-sm text-muted-foreground">Total Responses</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-semibold">{validResponses.length}</span>
              <span className="text-xs text-muted-foreground">responses received</span>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg border p-4 sm:p-6 shadow-sm">
      {calculateSummary()}
      {question.questionType === 'audio_response' && renderSentimentAnalysis()}
    </div>
  );
}