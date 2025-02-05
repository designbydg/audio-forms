import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StatsCards } from "@/components/dashboard/insights/StatsCards";
import { SentimentAnalysisCard } from "@/components/dashboard/insights/SentimentAnalysis";
import { TrendAnalysis } from "@/components/dashboard/insights/TrendAnalysis";
import { Layout } from "@/components/layout/Layout";
import { SurveyAnalytics } from "@/types/analytics";

const SurveyInsights = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: survey } = useQuery({
    queryKey: ['survey', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('surveys')
        .select('title')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: analytics } = useQuery({
    queryKey: ['survey-analytics', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('survey_analytics')
        .select('*')
        .eq('survey_id', id)
        .single();

      if (error) throw error;
      return data as SurveyAnalytics;
    },
  });

  if (!id) {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4">Survey ID not found</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl">
              {survey?.title ? `${survey.title} Insights` : 'Loading...'}
            </h1>
          </div>
        </div>

        {analytics && <StatsCards analytics={analytics} />}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <SentimentAnalysisCard surveyId={id} />
          <TrendAnalysis surveyId={id} />
        </div>
      </div>
    </Layout>
  );
};

export default SurveyInsights;