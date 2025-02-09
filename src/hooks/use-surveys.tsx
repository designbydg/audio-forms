
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Survey, SurveyStatus } from "@/types/survey";

export const useSurveys = (userId: string | null) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: surveysWithAnalytics = [], isLoading, error } = useQuery({
    queryKey: ['surveys-with-analytics', userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data: surveys, error: surveysError } = await supabase
        .from('surveys')
        .select(`
          id,
          title,
          status,
          created_at,
          responses:responses(count),
          analytics:survey_response_rates!inner(
            views,
            submissions,
            response_rate,
            bounce_rate,
            starts
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (surveysError) {
        console.error('Error fetching surveys:', surveysError);
        throw surveysError;
      }

      return surveys.map(survey => ({
        id: survey.id,
        title: survey.title,
        status: survey.status as SurveyStatus,
        responseCount: survey.responses?.[0]?.count || 0,
        createdAt: survey.created_at,
        analytics: survey.analytics?.[0] || {
          views: 0,
          submissions: 0,
          response_rate: 0,
          bounce_rate: 0,
          starts: 0
        }
      }));
    },
    enabled: !!userId,
  });

  const deleteSurveyMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('surveys')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surveys-with-analytics'] });
      toast({
        title: "Survey deleted",
        description: "The survey has been successfully deleted.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete survey",
        variant: "destructive",
      });
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase
        .from('surveys')
        .delete()
        .in('id', ids);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surveys-with-analytics'] });
      toast({
        title: "Surveys deleted",
        description: "The selected surveys have been successfully deleted.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete surveys",
        variant: "destructive",
      });
    },
  });

  return {
    surveysWithAnalytics,
    isLoading,
    error,
    deleteSurveyMutation,
    bulkDeleteMutation
  };
};
