import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Question } from "@/types/question";
import { ResponseRenderer } from "./ResponseRenderer";
import { format } from "date-fns";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FREE_PLAN_RESPONSE_LIMIT = 10;

interface RespondentResponsesProps {
  surveyId: string;
}

export function RespondentResponses({ surveyId }: RespondentResponsesProps) {
  const { data: questions, isLoading: questionsLoading, error: questionsError } = useQuery({
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
    retry: 3,
  });

  const { data: responses, isLoading: responsesLoading, error: responsesError } = useQuery({
    queryKey: ['survey-responses', surveyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('responses')
        .select('*')
        .eq('survey_id', surveyId)
        .order('created_at', { ascending: false })
        .limit(FREE_PLAN_RESPONSE_LIMIT);
      
      if (error) throw error;
      return data;
    },
    retry: 3,
  });

  if (questionsLoading || responsesLoading) {
    return <div className="p-4">Loading responses...</div>;
  }

  if (questionsError || responsesError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load survey responses. Please try refreshing the page.</AlertDescription>
      </Alert>
    );
  }

  if (!responses?.length) {
    return <div className="p-4 text-muted-foreground">No responses yet</div>;
  }

  return (
    <Accordion type="single" collapsible className="w-full space-y-4">
      {responses.map((response, responseIndex) => (
        <AccordionItem 
          key={response.id} 
          value={response.id}
          className="border rounded-lg bg-white shadow-sm"
        >
          <AccordionTrigger className="px-6 hover:no-underline">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full">
              <div className="flex flex-col md:flex-row md:items-center gap-2 text-left">
                <div className="flex flex-col">
                  <span className="font-medium">Response #{responseIndex + 1}</span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(response.created_at), 'MMM d, yyyy h:mm a')}
                  </span>
                </div>
              </div>
              <span className="text-xs bg-[#d3f8e6] text-[#0a7257] px-2.5 py-0.5 rounded-full mt-2 md:mt-0 self-start md:self-auto mr-4" title={`${questions?.length || 0} questions in this survey`}>
                {questions?.length || 0} Questions
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="space-y-8">
              {questions?.map((question, index) => (
                <div 
                  key={question.id} 
                  className={`pt-6 space-y-2 ${index !== 0 ? 'border-t border-gray-200' : ''}`}
                >
                  <div className="font-medium text-base text-muted-foreground">
                    <span className="inline-block mr-2">Q{index + 1}.</span>
                    {question.questionText}
                  </div>
                  <div className="ml-8 p-4 bg-muted rounded-md">
                    <ResponseRenderer
                      questionType={question.questionType}
                      response={response.response_data[question.id]}
                      responseId={response.id}
                    />
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}