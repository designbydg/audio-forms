import { Question } from "@/types/question";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MobileHeader } from "./preview/MobileHeader";
import { SidebarContent } from "./preview/SidebarContent";
import { SurveyContent } from "./preview/SurveyContent";
import { ThankYouPage } from "./preview/ThankYouPage";

interface FullPagePreviewProps {
  title: string;
  questions: Question[];
  onBack?: () => void;
  isPreview?: boolean;
  surveyId?: string;
}

export const FullPagePreview = ({
  title,
  questions,
  onBack,
  isPreview = false,
  surveyId,
}: FullPagePreviewProps) => {
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [showErrors, setShowErrors] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    const trackView = async () => {
      if (!isPreview && surveyId) {
        try {
          const { error } = await supabase
            .rpc('update_survey_analytics', {
              p_survey_id: surveyId,
              p_action: 'view'
            });

          if (error) {
            console.error('Error tracking view:', error);
          }
        } catch (error) {
          console.error('Error tracking view:', error);
        }
      }
    };

    trackView();
  }, [surveyId, isPreview]);

  const handleResponseChange = (questionId: string, response: any) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: response,
    }));
  };

  const validateCurrentQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion.required && !responses[currentQuestion.id]) {
      setShowErrors(true);
      toast({
        variant: "destructive",
        title: "Required Question",
        description: "Please answer this question before proceeding.",
      });
      return false;
    }
    return true;
  };

  const trackSurveyStart = async () => {
    if (!isPreview && surveyId && !hasStarted) {
      try {
        const { error } = await supabase
          .rpc('update_survey_analytics', {
            p_survey_id: surveyId,
            p_action: 'start'
          });

        if (error) {
          console.error('Error tracking survey start:', error);
        } else {
          setHasStarted(true);
        }
      } catch (error) {
        console.error('Error tracking survey start:', error);
      }
    }
  };

  const handleNext = async () => {
    if (!validateCurrentQuestion()) return;
    await trackSurveyStart();
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowErrors(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setShowErrors(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentQuestion()) return;
    
    const hasRequiredEmpty = questions.some(
      (q) => q.required && !responses[q.id]
    );

    if (hasRequiredEmpty) {
      toast({
        variant: "destructive",
        title: "Required Questions",
        description: "Please answer all required questions before submitting.",
      });
      return;
    }

    if (!surveyId || isPreview) {
      console.log("Preview mode - responses:", responses);
      toast({
        title: "Preview Mode",
        description: "Responses are not saved in preview mode.",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const { error: responseError } = await supabase
        .from('responses')
        .insert({
          survey_id: surveyId,
          response_data: responses
        });

      if (responseError) throw responseError;

      const { error: analyticsError } = await supabase
        .rpc('update_survey_analytics', {
          p_survey_id: surveyId,
          p_action: 'submit'
        });

      if (analyticsError) throw analyticsError;

      setIsSubmitted(true);

    } catch (error) {
      console.error('Error submitting survey:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit survey. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return <ThankYouPage />;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const canMoveNext = !currentQuestion.required || responses[currentQuestion.id];

  return (
    <div className="min-h-screen bg-background flex">
      {isMobile && (
        <MobileHeader
          title={title}
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          isPreview={isPreview}
          onBack={onBack}
        />
      )}

      {!isMobile && (
        <div className="hidden md:flex w-64 fixed left-0 top-0 bottom-0 bg-[#F8F9FB] border-r border-sidebar-border">
          <SidebarContent
            title={title}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={questions.length}
            isPreview={isPreview}
            onBack={onBack}
          />
        </div>
      )}

      <div className={`flex-1 ${isMobile ? 'mt-16' : 'md:ml-64'} w-full`}>
        <SurveyContent
          currentQuestion={currentQuestion}
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          responses={responses}
          showErrors={showErrors}
          canMoveNext={canMoveNext}
          isSubmitting={isSubmitting}
          onResponseChange={handleResponseChange}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};