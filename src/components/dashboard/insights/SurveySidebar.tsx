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
import { useNavigate } from "react-router-dom";

interface SurveySidebarProps {
  surveys: Array<{ id: string; title: string }>;
  selectedSurveyId?: string;
  isMobile?: boolean;
}

export function SurveySidebar({ surveys, selectedSurveyId, isMobile }: SurveySidebarProps) {
  const navigate = useNavigate();

  if (isMobile) {
    return (
      <div className="mb-6 space-y-2">
        <label className="text-sm font-medium text-gray-700">Your Surveys</label>
        <Select
          value={selectedSurveyId}
          onValueChange={(value) => navigate(`/insights/${value}`)}
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
    <div className="w-64 shrink-0">
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Your Surveys</h2>
        </div>
        <ScrollArea className="h-[calc(100vh-250px)]">
          <div className="p-2">
            {surveys?.map((survey) => (
              <Button
                key={survey.id}
                variant={selectedSurveyId === survey.id ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start text-left font-normal mb-1",
                  selectedSurveyId === survey.id && "bg-secondary"
                )}
                onClick={() => navigate(`/insights/${survey.id}`)}
              >
                <span className="truncate">{survey.title}</span>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}