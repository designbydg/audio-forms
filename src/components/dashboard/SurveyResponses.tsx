import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Question } from "@/types/question";
import { QuestionCard } from "../survey/responses/QuestionCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface SurveyResponsesProps {
  surveyId: string;
}

export function SurveyResponses({ surveyId }: SurveyResponsesProps) {
  const { data: questions, isLoading: questionsLoading } = useQuery({
    queryKey: ['survey-questions', surveyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('survey_id', surveyId)
        .order('order_index');
      
      if (error) throw error;

      return data.map(q => ({
        id: q.id,
        questionText: q.question_text,
        questionType: q.question_type as Question['questionType'],
        options: Array.isArray(q.options) ? q.options : [],
        orderIndex: q.order_index
      })) as Question[];
    },
  });

  const { data: responses, isLoading: responsesLoading, error } = useQuery({
    queryKey: ['survey-responses', surveyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('responses')
        .select('*')
        .eq('survey_id', surveyId)
        .order('created_at', { ascending: false }); // Sort by newest first
      
      if (error) throw error;
      return data;
    },
  });

  if (questionsLoading || responsesLoading) {
    return <div className="p-4">Loading responses...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load survey responses</AlertDescription>
      </Alert>
    );
  }

  if (!responses?.length) {
    return <div className="p-4 text-muted-foreground">No responses yet</div>;
  }

  return (
    <Accordion type="single" collapsible className="w-full space-y-4">
      {questions?.map((question, index) => (
        <AccordionItem 
          key={question.id} 
          value={question.id} 
          className="border rounded-lg bg-white shadow-sm"
        >
          <AccordionTrigger className="px-6 hover:no-underline">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full">
              <div className="flex flex-col md:flex-row md:items-center gap-2 text-left">
                <span className="text-sm font-medium text-muted-foreground">
                  Q{index + 1}:
                </span>
                <span className="font-medium">{question.questionText}</span>
              </div>
              <span className="text-xs bg-[#d3f8e6] text-[#0a7257] px-2.5 py-0.5 rounded-full mt-2 md:mt-0 md:mr-4 self-start md:self-auto" title={`${responses.length} responses received`}>
                {responses.length} Responses
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <QuestionCard
              question={question}
              responses={responses}
            />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}