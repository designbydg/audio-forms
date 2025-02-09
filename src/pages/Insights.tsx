
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { SurveySidebar } from "@/components/dashboard/insights/SurveySidebar";
import { InsightsContent } from "@/components/dashboard/insights/InsightsContent";
import { SurveyAnalytics } from "@/types/analytics";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const InsightsPage = () => {
  const { id } = useParams();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
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

  const { data: surveys, isLoading: surveysLoading } = useQuery({
    queryKey: ['user-surveys', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('surveys')
        .select('id, title, status')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const { data: survey } = useQuery({
    queryKey: ['survey', id],
    queryFn: async () => {
      if (!id || !userId) return null;
      const { data, error } = await supabase
        .from('surveys')
        .select('title')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id && !!userId,
  });

  const { data: analytics } = useQuery<SurveyAnalytics>({
    queryKey: ['survey-analytics', id],
    queryFn: async () => {
      if (!id || !userId) return null;
      const { data, error } = await supabase
        .from('survey_analytics')
        .select('*')
        .eq('survey_id', id)
        .single();

      if (error) throw error;

      return {
        ...data,
        avg_completion_time: data.avg_completion_time?.toString() || null
      } as SurveyAnalytics;
    },
    enabled: !!id && !!userId,
  });

  // Effect to select the latest published survey when no survey is selected
  useEffect(() => {
    if (!id && !surveysLoading && surveys?.length) {
      const latestPublishedSurvey = surveys.find(s => s.status === 'published');
      if (latestPublishedSurvey) {
        navigate(`/insights/${latestPublishedSurvey.id}`);
      }
    }
  }, [id, surveys, surveysLoading, navigate]);

  if (!surveys && surveysLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-4 sm:py-6 px-2 sm:px-4">
        {isMobile ? (
          <div className="space-y-6">
            <SurveySidebar 
              surveys={surveys || []} 
              selectedSurveyId={id}
              isMobile={true}
            />
            <div className="flex-1">
              <InsightsContent 
                surveyId={id || ''} 
                surveyTitle={survey?.title}
                analytics={analytics}
              />
            </div>
          </div>
        ) : (
          <div className="flex gap-8">
            <SurveySidebar 
              surveys={surveys || []} 
              selectedSurveyId={id}
              isMobile={false}
            />
            <div className="flex-1">
              <InsightsContent 
                surveyId={id || ''} 
                surveyTitle={survey?.title}
                analytics={analytics}
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default InsightsPage;
