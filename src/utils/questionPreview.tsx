import { Question } from "@/types/question";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mic, Star } from "lucide-react";
import { useState } from "react";

export const renderQuestionPreview = (question: Question) => {
  return renderResponseTypePreview(question.questionType, question);
};

const renderResponseTypePreview = (type: string, question: Question) => {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  switch (type) {
    case "short_answer":
      return <Input placeholder="Short answer text" />;
    case "paragraph":
      return <Textarea placeholder="Long answer text" />;
    case "multiple_choice":
      return (
        <RadioGroup>
          {question.options?.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`${question.id}-${index}`} />
              <Label htmlFor={`${question.id}-${index}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
      );
    case "checkboxes":
      return (
        <div className="space-y-2">
          {question.options?.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Checkbox id={`${question.id}-${index}`} />
              <Label htmlFor={`${question.id}-${index}`}>{option}</Label>
            </div>
          ))}
        </div>
      );
    case "dropdown":
      return (
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {question.options?.map((option, index) => (
              <SelectItem key={index} value={option}>{option}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    case "linear_scale":
      const scaleOptions = question.options?.[0] ? JSON.parse(question.options[0]) : { min: 1, max: 5 };
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">{scaleOptions.min}</span>
            <span className="text-sm">{scaleOptions.max}</span>
          </div>
          <RadioGroup className="flex items-center justify-between">
            {Array.from({ length: scaleOptions.max - scaleOptions.min + 1 }, (_, i) => (
              <div key={i} className="flex flex-col items-center">
                <RadioGroupItem
                  value={`${scaleOptions.min + i}`}
                  id={`scale-${question.id}-${i}`}
                />
                <Label htmlFor={`scale-${question.id}-${i}`} className="mt-1">
                  {scaleOptions.min + i}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      );
    case "rating":
      const ratingOptions = question.options?.[0] ? JSON.parse(question.options[0]) : { max: 5 };
      return (
        <div className="flex gap-2">
          {Array.from({ length: ratingOptions.max }, (_, i) => (
            <Button
              key={i}
              variant="outline"
              size="sm"
              className={`w-10 h-10 ${selectedRating && selectedRating >= i + 1 ? 'bg-primary text-primary-foreground' : ''}`}
              onClick={() => setSelectedRating(i + 1)}
            >
              <Star className={selectedRating && selectedRating >= i + 1 ? "fill-current" : ""} />
            </Button>
          ))}
        </div>
      );
    case "multiple_choice_grid":
    case "checkbox_grid":
      const gridOptions = question.options?.[0] ? JSON.parse(question.options[0]) : { rows: [], columns: [] };
      const isCheckbox = type === "checkbox_grid";
      
      return (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2 border"></th>
                {gridOptions.columns.map((column: string, colIndex: number) => (
                  <th key={colIndex} className="p-2 border text-center">{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {gridOptions.rows.map((row: string, rowIndex: number) => (
                <tr key={rowIndex}>
                  <td className="p-2 border">{row}</td>
                  {gridOptions.columns.map((column: string, colIndex: number) => (
                    <td key={colIndex} className="p-2 border text-center">
                      {isCheckbox ? (
                        <Checkbox
                          id={`${question.id}-${rowIndex}-${colIndex}`}
                          className="mx-auto"
                        />
                      ) : (
                        <RadioGroup>
                          <RadioGroupItem
                            value={column}
                            id={`${question.id}-${rowIndex}-${colIndex}`}
                            className="mx-auto"
                          />
                        </RadioGroup>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "audio_response":
      return (
        <div className="flex gap-4 items-center">
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Mic className="mr-2 h-4 w-4" />
            Record Audio
          </Button>
          <Button
            variant="ghost"
            size="sm"
          >
            Enter Text Instead
          </Button>
        </div>
      );
    case "date":
      return <Input type="date" className="w-full" />;
    case "time":
      return <Input type="time" className="w-full" />;
    case "nps":
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-2">
            {Array.from({ length: 11 }, (_, i) => i).map((value) => (
              <Button
                key={value}
                variant="outline"
                className={`h-14 w-14 text-lg border-[#EDF2FF] hover:bg-[#EDF2FF] hover:text-primary ${selectedRating === value ? "bg-[#EDF2FF] text-primary border-primary" : ""}`}
                onClick={() => setSelectedRating(value)}
              >
                {value}
              </Button>
            ))}
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>0 → Not likely at all</span>
            <span>10 → Extremely likely</span>
          </div>
        </div>
      );
    default:
      return <div>Preview not implemented for this question type yet</div>;
  }
};
