import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface LinearScaleResponseProps {
  questionId: string;
  response: string;
  options: string[];
  onResponseChange: (questionId: string, response: string) => void;
}

export const LinearScaleResponse = ({
  questionId,
  response,
  options,
  onResponseChange,
}: LinearScaleResponseProps) => {
  const getScaleOptions = (optionStr: string | undefined) => {
    try {
      if (!optionStr) return { min: 1, max: 5 };
      const parsed = JSON.parse(optionStr);
      return {
        min: Number(parsed.min) || 1,
        max: Number(parsed.max) || 5
      };
    } catch (error) {
      console.error('Error parsing scale options:', error);
      return { min: 1, max: 5 };
    }
  };

  const scaleOptions = getScaleOptions(options?.[0]);

  return (
    <RadioGroup
      value={response}
      onValueChange={(value) => onResponseChange(questionId, value)}
      className="flex items-center justify-between"
    >
      {Array.from(
        { length: scaleOptions.max - scaleOptions.min + 1 },
        (_, i) => (
          <div key={i} className="flex flex-col items-center">
            <RadioGroupItem
              value={`${scaleOptions.min + i}`}
              id={`scale-${questionId}-${i}`}
            />
            <Label
              htmlFor={`scale-${questionId}-${i}`}
              className="mt-1"
            >
              {scaleOptions.min + i}
            </Label>
          </div>
        )
      )}
    </RadioGroup>
  );
};