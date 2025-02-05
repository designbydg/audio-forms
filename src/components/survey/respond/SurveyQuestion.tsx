import { Question } from "@/types/question";
import { AudioResponse } from "./question-types/AudioResponse";
import { TextResponse } from "./question-types/TextResponse";
import { RatingResponse } from "./question-types/RatingResponse";
import { MultipleChoiceResponse } from "./question-types/MultipleChoiceResponse";
import { GridResponse } from "./question-types/GridResponse";
import { DateTimeResponse } from "./question-types/DateTimeResponse";
import { LinearScaleResponse } from "./question-types/LinearScaleResponse";
import { DropdownResponse } from "./question-types/DropdownResponse";
import { NPSResponse } from "./question-types/NPSResponse";

interface SurveyQuestionProps {
  question: Question;
  onResponseChange: (questionId: string, response: any) => void;
  responses: Record<string, any>;
  showErrors?: boolean;
}

export const SurveyQuestion = ({
  question,
  onResponseChange,
  responses,
  showErrors = false,
}: SurveyQuestionProps) => {
  const response = responses[question.id];
  const isEmptyResponse = (response: any) => {
    if (Array.isArray(response)) return response.length === 0;
    if (typeof response === 'string') return response.trim() === '';
    if (typeof response === 'object' && response !== null) {
      return Object.keys(response).length === 0;
    }
    return response === undefined || response === null;
  };

  const showError = showErrors && question.required && isEmptyResponse(response);

  const renderResponseInput = () => {
    switch (question.questionType) {
      case "nps":
        return (
          <NPSResponse
            questionId={question.id}
            response={responses[question.id]}
            onResponseChange={onResponseChange}
          />
        );
      case "audio_response":
        return (
          <AudioResponse
            questionId={question.id}
            response={responses[question.id]}
            onResponseChange={onResponseChange}
          />
        );
      case "short_answer":
      case "paragraph":
        return (
          <TextResponse
            questionId={question.id}
            response={responses[question.id]}
            type={question.questionType}
            onResponseChange={onResponseChange}
          />
        );
      case "rating":
        return (
          <RatingResponse
            questionId={question.id}
            response={responses[question.id]}
            options={question.options || []}
            onResponseChange={onResponseChange}
          />
        );
      case "multiple_choice":
      case "checkboxes":
        return (
          <MultipleChoiceResponse
            questionId={question.id}
            response={responses[question.id]}
            options={question.options || []}
            type={question.questionType}
            onResponseChange={onResponseChange}
          />
        );
      case "dropdown":
        return (
          <DropdownResponse
            questionId={question.id}
            response={responses[question.id]}
            options={question.options || []}
            onResponseChange={onResponseChange}
          />
        );
      case "linear_scale":
        return (
          <LinearScaleResponse
            questionId={question.id}
            response={responses[question.id]}
            options={question.options || []}
            onResponseChange={onResponseChange}
          />
        );
      case "multiple_choice_grid":
      case "checkbox_grid":
        return (
          <GridResponse
            questionId={question.id}
            response={responses[question.id]}
            options={question.options || []}
            type={question.questionType}
            onResponseChange={onResponseChange}
          />
        );
      case "date":
      case "time":
        return (
          <DateTimeResponse
            questionId={question.id}
            response={responses[question.id]}
            type={question.questionType}
            onResponseChange={onResponseChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-3">
      <div className="font-medium">
        {question.questionText}
        {question.required && <span className="text-red-500 ml-1">*</span>}
      </div>
      {renderResponseInput()}
      {showError && (
        <div className="text-sm text-red-500">This question is required</div>
      )}
    </div>
  );
};
