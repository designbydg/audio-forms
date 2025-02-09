
import { Survey } from "@/types/survey";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAnalytics = (surveys: Survey[]) => {
  const { data: analytics } = useQuery({
    queryKey: ['dashboard-analytics', surveys.map(s => s.id)],
    queryFn: async () => {
      // Check for active session first
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const surveyIds = surveys.map(s => s.id);
      if (surveyIds.length === 0) return null;

      const { data, error } = await supabase
        .from('survey_analytics')
        .select('*')
        .in('survey_id', surveyIds);

      if (error) throw error;
      return data;
    },
    enabled: surveys.length > 0,
    retry: false, // Don't retry failed requests to avoid spamming when not authenticated
  });

  // Calculate totals from analytics
  const totalViews = analytics?.reduce((sum, stat) => sum + (stat.views || 0), 0) || 0;
  const totalResponses = analytics?.reduce((sum, stat) => sum + (stat.submissions || 0), 0) || 0;
  const totalStarts = analytics?.reduce((sum, stat) => sum + (stat.starts || 0), 0) || 0;
  
  // Calculate aggregate response rate (total submissions / total views)
  const aggregateResponseRate = totalViews > 0 
    ? ((totalResponses / totalViews) * 100).toFixed(1)
    : "0";

  // Calculate aggregate bounce rate (started but not completed / total starts)
  const aggregateBounceRate = totalStarts > 0
    ? (((totalStarts - totalResponses) / totalStarts) * 100).toFixed(1)
    : "0";

  return {
    totalViews,
    totalResponses,
    averageResponseRate: aggregateResponseRate,
    averageBounceRate: aggregateBounceRate,
    publishedSurveysCount: surveys.filter(s => s.status === 'published').length,
    totalSurveysCount: surveys.length
  };
};
