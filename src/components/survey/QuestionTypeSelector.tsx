import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { QuestionType } from "@/types/question";
import {
  AlignLeft,
  Calendar,
  Clock,
  Star,
  Grid,
  List,
  SlidersHorizontal,
  Type,
  CircleDot,
  Mic,
  ThumbsUp,
} from "lucide-react";
import { useState, useEffect } from "react";

interface QuestionTypeSelectorProps {
  value: QuestionType[];
  onChange: (types: QuestionType[]) => void;
  questionId: string;
}

const otherQuestionTypes: { type: QuestionType; label: string; icon: React.ComponentType }[] = [
  { type: "short_answer", label: "Short answer", icon: Type },
  { type: "paragraph", label: "Paragraph", icon: AlignLeft },
  { type: "multiple_choice", label: "Multiple choice", icon: CircleDot },
  { type: "dropdown", label: "Dropdown", icon: List },
  { type: "linear_scale", label: "Linear scale", icon: SlidersHorizontal },
  { type: "rating", label: "Rating", icon: Star },
  { type: "nps", label: "NPS Score", icon: ThumbsUp },
  { type: "multiple_choice_grid", label: "Multiple choice grid", icon: Grid },
  { type: "checkbox_grid", label: "Checkbox grid", icon: Grid },
  { type: "date", label: "Date", icon: Calendar },
  { type: "time", label: "Time", icon: Clock },
];

export const QuestionTypeSelector = ({ value, onChange, questionId }: QuestionTypeSelectorProps) => {
  const [showOtherTypes, setShowOtherTypes] = useState(false);

  useEffect(() => {
    if (value.length === 0) {
      setShowOtherTypes(false);
    }
  }, [value]);

  const handleTypeSelection = (type: QuestionType) => {
    onChange([type] as QuestionType[]);
  };

  return (
    <div className="space-y-4">
      <div className="relative pt-4">
        <input
          type="radio"
          id={`audio_response_${questionId}`}
          name={`response_type_${questionId}`}
          checked={value.includes("audio_response")}
          onChange={() => handleTypeSelection("audio_response")}
          className="peer sr-only"
        />
        <label
          htmlFor={`audio_response_${questionId}`}
          className="flex items-center space-x-3 w-full p-2 hover:bg-accent hover:text-accent-foreground peer-checked:bg-primary/10 rounded-md cursor-pointer transition-colors bg-[#EDF2FF]/40"
        >
          <Mic className="h-4 w-4" />
          <span className="text-sm font-medium">Record Audio (with an option to enter text)</span>
        </label>
      </div>

      <Separator className="my-2" />

      <div className="space-y-1">
        {otherQuestionTypes.map(({ type, label, icon: Icon }) => {
          const IconComponent = Icon as React.ComponentType<{ className?: string }>;
          const isSelected = value.includes(type);
          return (
            <div key={`${type}_${questionId}`} className="relative">
              <input
                type="radio"
                id={`${type}_${questionId}`}
                name={`response_type_${questionId}`}
                checked={isSelected}
                onChange={() => handleTypeSelection(type)}
                className="peer sr-only"
              />
              <label
                htmlFor={`${type}_${questionId}`}
                className="flex items-center space-x-3 w-full p-2 hover:bg-accent hover:text-accent-foreground peer-checked:bg-primary/10 rounded-md cursor-pointer transition-colors"
              >
                <IconComponent className="h-4 w-4" />
                <span className="text-sm font-medium">{label}</span>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};