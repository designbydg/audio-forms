import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface MultipleChoiceResponseProps {
  questionId: string;
  response: string | string[];
  options: string[];
  type: "multiple_choice" | "checkboxes";
  onResponseChange: (questionId: string, response: any) => void;
}

export const MultipleChoiceResponse = ({
  questionId,
  response,
  options,
  type,
  onResponseChange,
}: MultipleChoiceResponseProps) => {
  if (type === "multiple_choice") {
    return (
      <RadioGroup
        value={response as string}
        onValueChange={(value) => onResponseChange(questionId, value)}
      >
        {options.map((option, index) => (
          <div key={index} className="flex items-center space-x-2">
            <RadioGroupItem value={option} id={`${questionId}-${index}`} />
            <Label htmlFor={`${questionId}-${index}`}>{option}</Label>
          </div>
        ))}
      </RadioGroup>
    );
  }

  return (
    <div className="space-y-2">
      {options.map((option, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Checkbox
            id={`${questionId}-${index}`}
            checked={(response as string[])?.includes(option)}
            onCheckedChange={(checked) => {
              const currentResponses = (response as string[]) || [];
              const newResponses = checked
                ? [...currentResponses, option]
                : currentResponses.filter((r) => r !== option);
              onResponseChange(questionId, newResponses);
            }}
          />
          <Label htmlFor={`${questionId}-${index}`}>{option}</Label>
        </div>
      ))}
    </div>
  );
};