import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Question } from "@/types/question";
import { FullPagePreview } from "@/components/survey/FullPagePreview";
import { useSearchParams } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const FREE_PLAN_RESPONSE_LIMIT = 10;

const RespondSurvey = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get("preview") === "true";

  const { data: survey, isLoading, error } = useQuery({
    queryKey: ["survey", id],
    queryFn: async () => {
      if (!id) throw new Error("Survey ID is required");

      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        throw new Error("Invalid survey ID format");
      }

      // First fetch the survey
      const { data: surveyData, error: surveyError } = await supabase
        .from("surveys")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (surveyError) throw surveyError;
      if (!surveyData) throw new Error("Survey not found");

      // Get response count
      const { count: responseCount, error: countError } = await supabase
        .from("responses")
        .select("*", { count: "exact", head: true })
        .eq("survey_id", id);

      if (countError) throw countError;

      // Then fetch the questions
      const { data: questionsData, error: questionsError } = await supabase
        .from("questions")
        .select("*")
        .eq("survey_id", id)
        .order("order_index");

      if (questionsError) throw questionsError;

      return {
        survey: surveyData,
        questions: questionsData.map(q => ({
          id: q.id,
          questionText: q.question_text,
          questionType: q.question_type,
          options: q.options,
          orderIndex: q.order_index,
          required: q.required
        })) as Question[],
        responseCount
      };
    },
    enabled: !!id
  });

  if (!id) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Invalid survey ID</AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error instanceof Error ? error.message : "Failed to load survey"}
        </AlertDescription>
      </Alert>
    );
  }

  if (!survey) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Survey not found</AlertDescription>
      </Alert>
    );
  }

  // Check if survey has reached response limit
  if (!isPreview && survey.responseCount >= FREE_PLAN_RESPONSE_LIMIT) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Survey Unavailable</AlertTitle>
          <AlertDescription>
            This survey is currently unavailable. Please check back later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <FullPagePreview
      title={survey.survey.title}
      questions={survey.questions}
      onBack={isPreview ? () => window.close() : undefined}
      isPreview={isPreview}
      surveyId={id}
    />
  );
};

export default RespondSurvey;