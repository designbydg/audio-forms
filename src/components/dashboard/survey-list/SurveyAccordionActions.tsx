import { Button } from "@/components/ui/button";
import { Survey } from "@/types/survey";
import { Link, BarChart2, Pencil, MessageSquare, Copy, Trash2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

interface SurveyAccordionActionsProps {
  survey: Survey;
  isExpired: boolean;
  onShare: (survey: Survey) => void;
  onInsights: (id: string) => void;
  onEdit: (id: string) => void;
  onResponses: (id: string) => void;
  onDuplicate: (survey: Survey) => void;
  onDelete: (id: string) => void;
}

export function SurveyAccordionActions({
  survey,
  isExpired,
  onShare,
  onInsights,
  onEdit,
  onResponses,
  onDuplicate,
  onDelete,
}: SurveyAccordionActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              onClick={() => onShare(survey)}
              className="h-8"
              disabled={survey.status !== 'published' || isExpired}
            >
              <Link className="h-4 w-4 mr-2" />
              Share
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
              onClick={() => onInsights(survey.id)}
              className="h-8"
              disabled={survey.status !== 'published'}
            >
              <BarChart2 className="h-4 w-4 mr-2" />
              Insights
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>View Insights</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              onClick={() => onEdit(survey.id)}
              className="h-8"
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Edit Survey</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              onClick={() => onResponses(survey.id)}
              className="h-8"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Responses
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>View Responses</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              onClick={() => onDuplicate(survey)}
              className="h-8"
            >
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Duplicate Survey</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              onClick={() => onDelete(survey.id)}
              className="h-8 text-red-600 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete Survey</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}