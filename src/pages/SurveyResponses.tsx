
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { useIsMobile } from "@/hooks/use-mobile";
import { SurveySelector } from "@/components/survey/responses/SurveySelector";
import { ResponseTabs } from "@/components/survey/responses/ResponseTabs";
import { useEffect, useState } from "react";

const SurveyResponsesPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
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

  // Effect to select the latest published survey when no survey is selected
  useEffect(() => {
    if (!id && !surveysLoading && surveys?.length) {
      const latestPublishedSurvey = surveys.find(s => s.status === 'published');
      if (latestPublishedSurvey) {
        navigate(`/responses/${latestPublishedSurvey.id}`);
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
            <SurveySelector
              surveys={surveys || []}
              selectedSurveyId={id}
              onSurveySelect={(surveyId) => navigate(`/responses/${surveyId}`)}
              isMobile={true}
            />
            {id ? (
              <div className="space-y-6">
                <h1 className="text-xl sm:text-2xl font-semibold">
                  {survey?.title ? `${survey.title} Responses` : 'Loading...'}
                </h1>
                <ResponseTabs surveyId={id} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-[calc(100vh-250px)]">
                <div className="text-center text-muted-foreground">
                  <p>Select a survey from the dropdown to view responses</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-6">
            <div className="hidden lg:block w-64 shrink-0">
              <div className="bg-white rounded-lg border shadow-sm">
                <SurveySelector
                  surveys={surveys || []}
                  selectedSurveyId={id}
                  onSurveySelect={(surveyId) => navigate(`/responses/${surveyId}`)}
                  isMobile={false}
                />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              {id ? (
                <div className="space-y-6">
                  <h1 className="text-xl sm:text-2xl font-semibold">
                    {survey?.title ? `${survey.title} Responses` : 'Loading...'}
                  </h1>
                  <ResponseTabs surveyId={id} />
                </div>
              ) : (
                <div className="flex items-center justify-center h-[calc(100vh-250px)]">
                  <div className="text-center text-muted-foreground">
                    <p>Select a survey from the sidebar to view responses</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SurveyResponsesPage;
