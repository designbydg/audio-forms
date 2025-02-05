import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SurveyNavigationProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  canMoveNext: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export const SurveyNavigation = ({
  currentQuestionIndex,
  totalQuestions,
  canMoveNext,
  onNext,
  onPrevious,
  onSubmit,
  isSubmitting = false,
}: SurveyNavigationProps) => {
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  return (
    <div className="flex justify-between pt-4">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentQuestionIndex === 0 || isSubmitting}
      >
        Previous
      </Button>
      {isLastQuestion ? (
        <Button 
          onClick={onSubmit}
          disabled={!canMoveNext || isSubmitting}
          variant="dark"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Survey'
          )}
        </Button>
      ) : (
        <Button
          onClick={onNext}
          disabled={!canMoveNext || isSubmitting}
          variant="dark"
        >
          Next Question
        </Button>
      )}
    </div>
  );
};