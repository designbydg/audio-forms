import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface SurveySelectorProps {
  surveys: Array<{ id: string; title: string; status: string }>;
  selectedSurveyId?: string;
  onSurveySelect: (surveyId: string) => void;
  isMobile: boolean;
}

export function SurveySelector({ surveys, selectedSurveyId, onSurveySelect, isMobile }: SurveySelectorProps) {
  if (isMobile) {
    return (
      <div className="mb-6 space-y-2">
        <label className="text-sm font-medium text-gray-700">Your Surveys</label>
        <Select
          value={selectedSurveyId}
          onValueChange={onSurveySelect}
        >
          <SelectTrigger className="w-full bg-white">
            <SelectValue placeholder="Select a survey" />
          </SelectTrigger>
          <SelectContent>
            {surveys?.map((survey) => (
              <SelectItem key={survey.id} value={survey.id}>
                {survey.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="font-semibold mb-4">Your Surveys</h2>
      <ScrollArea className="h-[calc(100vh-150px)]">
        <div className="space-y-1">
          {surveys?.map((survey) => (
            <Button
              key={survey.id}
              variant={selectedSurveyId === survey.id ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start text-left font-normal",
                selectedSurveyId === survey.id && "bg-secondary"
              )}
              onClick={() => onSurveySelect(survey.id)}
            >
              <span className="truncate">{survey.title}</span>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}