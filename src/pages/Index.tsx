
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { useSurveys } from "@/hooks/use-surveys";
import { useAnalytics } from "@/hooks/use-analytics";

const Index = () => {
  const navigate = useNavigate();
  const [selectedSurveys, setSelectedSurveys] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUserId(session.user.id);
      } else {
        navigate('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const {
    surveysWithAnalytics = [],
    isLoading,
    error,
    deleteSurveyMutation,
    bulkDeleteMutation
  } = useSurveys(userId);

  const {
    totalViews,
    totalResponses,
    averageResponseRate,
    averageBounceRate,
    publishedSurveysCount,
    totalSurveysCount
  } = useAnalytics(surveysWithAnalytics);

  const handleDelete = (id: string) => {
    deleteSurveyMutation.mutate(id);
    setSelectedSurveys([]);
  };

  const handleBulkDelete = (ids: string[]) => {
    bulkDeleteMutation.mutate(ids);
    setSelectedSurveys([]);
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
            totalSurveys={totalSurveysCount}
            publishedSurveys={publishedSurveysCount}
            totalResponses={totalResponses}
            totalViews={totalViews}
            responseRate={averageResponseRate}
            bounceRate={averageBounceRate}
          />
        </div>
        <div className="px-2 sm:px-0">
          <DashboardContent
            surveys={surveysWithAnalytics}
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
