import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Survey } from "@/types/survey";
import { SurveyStatus } from "./SurveyStatus";
import { SurveyActions } from "./SurveyActions";
import { useNavigate } from "react-router-dom";
import { Link, BarChart2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SentimentTrend } from "./SentimentTrend";
import { format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const FREE_PLAN_RESPONSE_LIMIT = 10;

interface SurveyRowProps {
  survey: Survey;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  onDelete: () => void;
  onEdit: () => void;
  isLast: boolean;
}

export function SurveyRow({ 
  survey, 
  isSelected, 
  onSelect, 
  onDelete, 
  onEdit,
  isLast 
}: SurveyRowProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const viewResponses = (surveyId: string) => {
    navigate(`/view-responses/${surveyId}`);
  };

  const handleTitleClick = () => {
    window.open(`/respond/${survey.id}?preview=true`, '_blank');
  };

  const handleShare = () => {
    if (survey.status !== 'published') return;
    
    if (survey.responseCount >= FREE_PLAN_RESPONSE_LIMIT) {
      toast({
        title: "Survey unavailable",
        description: "This survey has reached the maximum number of responses allowed on the free plan.",
        variant: "destructive",
      });
      return;
    }
    
    const responseUrl = `${window.location.origin}/respond/${survey.id}`;
    navigator.clipboard.writeText(responseUrl);
    toast({
      title: "Link copied!",
      description: "The survey response link has been copied to your clipboard.",
    });
  };

  const handleInsights = () => {
    if (survey.status !== 'published') return;
    navigate(`/survey-insights/${survey.id}`);
  };

  const isExpired = survey.responseCount >= FREE_PLAN_RESPONSE_LIMIT;
  const isPublished = survey.status === 'published';

  return (
    <TableRow 
      className={cn(
        "hover:bg-muted/50",
        isLast && "last-of-type:border-0"
      )}
    >
      <TableCell className="w-[80px]">
        <Checkbox
          checked={isSelected}
          onCheckedChange={onSelect}
          aria-label={`Select survey ${survey.title}`}
        />
      </TableCell>
      <TableCell className="w-[350px]">
        <div className="flex flex-col space-y-1">
          <Button
            variant="ghost"
            className="p-0 h-auto hover:bg-transparent text-foreground justify-start"
            onClick={handleTitleClick}
          >
            {survey.title}
          </Button>
          <span className="text-xs text-muted-foreground">
            Created: {format(new Date(survey.createdAt), 'MMM d, yyyy')}
          </span>
        </div>
      </TableCell>
      <TableCell className="w-[180px]">
        <SurveyStatus status={isExpired ? 'unavailable' : survey.status} />
      </TableCell>
      <TableCell className="w-[180px]">
        <Button
          variant="ghost"
          className="hover:underline"
          onClick={() => viewResponses(survey.id)}
        >
          {survey.responseCount}
        </Button>
      </TableCell>
      <TableCell className="w-[180px]">
        <SentimentTrend surveyId={survey.id} isPublished={isPublished} />
      </TableCell>
      <TableCell className="w-[180px] p-0">
        <div className="flex items-center gap-2 px-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleShare}
                  className="h-8 w-8"
                  disabled={survey.status !== 'published' || isExpired}
                >
                  <Link className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {isExpired 
                    ? "Survey unavailable - Maximum responses reached" 
                    : "Copy Survey Link"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleInsights}
                  className="h-8 w-8"
                  disabled={survey.status !== 'published'}
                >
                  <BarChart2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View Insights</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <SurveyActions
            surveyId={survey.id}
            status={survey.status}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        </div>
      </TableCell>
    </TableRow>
  );
}