import { Question } from "@/types/question";
import { SurveyQuestion } from "../respond/SurveyQuestion";
import { SurveyNavigation } from "../respond/SurveyNavigation";
import { Card, CardContent } from "@/components/ui/card";

interface SurveyContentProps {
  currentQuestion: Question;
  currentQuestionIndex: number;
  totalQuestions: number;
  responses: Record<string, any>;
  showErrors: boolean;
  canMoveNext: boolean;
  isSubmitting: boolean;
  onResponseChange: (questionId: string, response: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
}

export const SurveyContent = ({
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  responses,
  showErrors,
  canMoveNext,
  isSubmitting,
  onResponseChange,
  onNext,
  onPrevious,
  onSubmit,
}: SurveyContentProps) => {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 min-h-screen flex flex-col justify-center">
      <div className="space-y-4">
        <Card className="border-0 bg-[#F8F9FB]">
          <CardContent className="p-4 sm:p-8 md:p-12">
            <SurveyQuestion
              question={currentQuestion}
              responses={responses}
              onResponseChange={onResponseChange}
              showErrors={showErrors}
            />
          </CardContent>
        </Card>
        <div className="mt-4">
          <SurveyNavigation
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={totalQuestions}
            canMoveNext={canMoveNext}
            onNext={onNext}
            onPrevious={onPrevious}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};