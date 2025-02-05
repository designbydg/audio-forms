import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Survey, SurveyStatus } from "@/types/survey";
import { Layout } from "@/components/layout/Layout";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

const fetchSurveys = async () => {
  const { data: surveys, error: surveysError } = await supabase
    .from('surveys')
    .select(`
      id,
      title,
      status,
      created_at,
      responses:responses(count)
    `)
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
    createdAt: survey.created_at
  }));
};

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedSurveys, setSelectedSurveys] = useState<string[]>([]);
  const queryClient = useQueryClient();

  const { data: surveys = [], isLoading, error } = useQuery({
    queryKey: ['surveys'],
    queryFn: fetchSurveys,
  });

  const { data: analyticsData } = useQuery({
    queryKey: ['survey-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('survey_analytics')
        .select('*');
      
      if (error) throw error;
      return data;
    },
  });

  // Calculate metrics
  const publishedSurveys = surveys.filter(s => s.status === 'published');
  const totalResponses = surveys.reduce((acc, survey) => acc + survey.responseCount, 0);
  const totalViews = analyticsData?.reduce((acc, analytics) => acc + (analytics.views || 0), 0) || 0;
  const responseRate = totalViews > 0 
    ? ((totalResponses / totalViews) * 100).toFixed(1) 
    : '0';

  const totalStarts = analyticsData?.reduce((acc, analytics) => acc + (analytics.starts || 0), 0) || 0;
  const totalSubmissions = analyticsData?.reduce((acc, analytics) => acc + (analytics.submissions || 0), 0) || 0;
  const bounceRate = totalStarts > 0 
    ? (((totalStarts - totalSubmissions) / totalStarts) * 100).toFixed(1)
    : '0';

  const deleteSurveyMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('surveys')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
      setSelectedSurveys([]);
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
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
      setSelectedSurveys([]);
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

  const handleDelete = (id: string) => {
    deleteSurveyMutation.mutate(id);
  };

  const handleBulkDelete = (ids: string[]) => {
    bulkDeleteMutation.mutate(ids);
  };

  const handleEdit = (id: string) => {
    navigate(`/edit-survey/${id}`);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-destructive">Error loading surveys</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-4 md:space-y-6 clear-both">
        <DashboardHeader />
        <div className="px-2 sm:px-0 clear-both">
          <DashboardMetrics
            totalSurveys={surveys.length}
            publishedSurveys={publishedSurveys.length}
            totalResponses={totalResponses}
            totalViews={totalViews}
            responseRate={responseRate}
            bounceRate={bounceRate}
          />
        </div>
        <div className="px-2 sm:px-0">
          <DashboardContent
            surveys={surveys}
            onDelete={handleDelete}
            onBulkDelete={handleBulkDelete}
            onEdit={handleEdit}
            selectedSurveys={selectedSurveys}
            onSelectionChange={setSelectedSurveys}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Index;