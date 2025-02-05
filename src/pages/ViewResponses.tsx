import { useParams, useNavigate } from "react-router-dom";
import { SurveyResponses } from "@/components/dashboard/SurveyResponses";
import { RespondentResponses } from "@/components/survey/responses/RespondentResponses";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ClipboardList, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";

const ViewResponses = () => {
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
              {survey?.title ? `${survey.title} Responses` : 'Loading...'}
            </h1>
          </div>
        </div>

        <Tabs defaultValue="by-question" className="w-full">
          <TabsList className="w-full bg-transparent px-4 h-auto rounded-none">
            <div className="flex w-full">
              <TabsTrigger 
                value="by-question"
                className="flex-1 items-center gap-2 border-b-2 border-muted px-1 pb-4 pt-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-tr-lg rounded-tl-lg h-14"
              >
                <div className="flex items-center justify-center gap-2 w-full">
                  <ClipboardList className="h-4 w-4" />
                  By Question
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="by-respondent"
                className="flex-1 items-center gap-2 border-b-2 border-muted px-1 pb-4 pt-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-tr-lg rounded-tl-lg h-14"
              >
                <div className="flex items-center justify-center gap-2 w-full">
                  <Users className="h-4 w-4" />
                  By Respondent
                </div>
              </TabsTrigger>
            </div>
          </TabsList>
          <TabsContent value="by-question" className="mt-6 px-4">
            <SurveyResponses surveyId={id} />
          </TabsContent>
          <TabsContent value="by-respondent" className="mt-6 px-4">
            <RespondentResponses surveyId={id} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ViewResponses;