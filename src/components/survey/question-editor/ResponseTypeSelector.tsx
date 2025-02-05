import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { QuestionTypeSelector } from "../QuestionTypeSelector";
import { QuestionType } from "@/types/question";

interface ResponseTypeSelectorProps {
  questionType: QuestionType;
  showResponseTypes: boolean;
  onResponseTypeChange: (types: QuestionType[]) => void;
  onToggleResponseTypes: () => void;
  questionId?: string;
}

export const ResponseTypeSelector = ({
  questionType,
  showResponseTypes,
  onResponseTypeChange,
  onToggleResponseTypes,
  questionId,
}: ResponseTypeSelectorProps) => {
  const getQuestionTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      audio_response: "Record Audio Response",
      short_answer: "Short Answer",
      paragraph: "Paragraph",
      multiple_choice: "Multiple Choice",
      dropdown: "Dropdown",
      linear_scale: "Linear Scale",
      rating: "Rating",
      multiple_choice_grid: "Multiple Choice Grid",
      checkbox_grid: "Checkbox Grid",
      date: "Date",
      time: "Time",
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={onToggleResponseTypes}
        >
          {questionType ? (
            getQuestionTypeLabel(questionType)
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Add Response Type
            </>
          )}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onToggleResponseTypes}
        >
          {showResponseTypes ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>
      {showResponseTypes && (
        <div className="mt-2">
          <QuestionTypeSelector
            value={[questionType]}
            onChange={onResponseTypeChange}
            questionId={questionId}
          />
        </div>
      )}
    </div>
  );
};