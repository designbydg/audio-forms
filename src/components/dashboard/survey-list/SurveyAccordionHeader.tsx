import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { SurveyStatus } from "./SurveyStatus";
import { SentimentTrend } from "./SentimentTrend";
import { Survey } from "@/types/survey";

interface SurveyAccordionHeaderProps {
  survey: Survey;
  isExpired: boolean;
  onTitleClick: (id: string) => void;
}

export function SurveyAccordionHeader({ survey, isExpired, onTitleClick }: SurveyAccordionHeaderProps) {
  return (
    <div className="grid grid-cols-12 w-full gap-4 items-center">
      <div className="col-span-5 flex flex-col justify-center items-start gap-1">
        <Button
          variant="ghost"
          className="p-0 h-auto hover:bg-transparent text-foreground justify-start"
          onClick={() => onTitleClick(survey.id)}
        >
          {survey.title}
        </Button>
        <span className="text-xs text-muted-foreground">
          Created: {format(new Date(survey.createdAt), 'MMM d, yyyy h:mm a')}
        </span>
      </div>

      <div className="col-span-2 flex items-center justify-start">
        <SurveyStatus status={isExpired ? 'unavailable' : survey.status} />
      </div>

      <div className="col-span-3 flex items-center justify-start">
        <SentimentTrend surveyId={survey.id} isPublished={survey.status === 'published'} />
      </div>

      <div className="col-span-2 flex items-center justify-start">
        <span 
          className="text-xs bg-[#d3f8e6] text-[#0a7257] px-2.5 py-0.5 rounded-full"
          title={`${survey.responseCount} responses received`}
        >
          {survey.responseCount} Responses
        </span>
      </div>
    </div>
  );
}