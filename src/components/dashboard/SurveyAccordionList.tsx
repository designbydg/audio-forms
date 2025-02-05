import { Survey } from "@/types/survey";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SurveyAccordionHeader } from "./survey-list/SurveyAccordionHeader";
import { SurveyAccordionActions } from "./survey-list/SurveyAccordionActions";
import { DeleteSurveyDialog } from "./survey-list/DeleteSurveyDialog";

interface SurveyAccordionListProps {
  surveys: Survey[];
  onDelete: (id: string) => void;
  onBulkDelete: (ids: string[]) => void;
  onEdit: (id: string) => void;
  selectedSurveys: string[];
  onSelectionChange: (ids: string[]) => void;
}

const FREE_PLAN_RESPONSE_LIMIT = 10;

export function SurveyAccordionList({
  surveys,
  onDelete,
  onEdit,
}: SurveyAccordionListProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [surveyToDelete, setSurveyToDelete] = useState<string | null>(null);

  const handleShare = (survey: Survey) => {
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

  const handleInsights = (surveyId: string) => {
    navigate(`/survey-insights/${surveyId}`);
  };

  const handleTitleClick = (surveyId: string) => {
    window.open(`/respond/${surveyId}?preview=true`, '_blank');
  };

  const handleResponses = (surveyId: string) => {
    navigate(`/view-responses/${surveyId}`);
  };

  const handleDuplicate = async (survey: Survey) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase.rpc('duplicate_survey', {
        original_survey_id: survey.id,
        p_user_id: user.id
      });

      if (error) throw error;

      toast({
        title: "Survey duplicated",
        description: "A copy of the survey has been created.",
      });

      window.location.reload();
    } catch (error) {
      console.error('Error duplicating survey:', error);
      toast({
        title: "Error",
        description: "Failed to duplicate survey",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClick = (surveyId: string) => {
    setSurveyToDelete(surveyId);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (surveyToDelete) {
      onDelete(surveyToDelete);
      setShowDeleteDialog(false);
      setSurveyToDelete(null);
    }
  };

  if (!surveys.length) {
    return (
      <div className="text-center p-8 bg-white rounded-lg border">
        <p className="text-muted-foreground">You haven't created any surveys yet.</p>
      </div>
    );
  }

  return (
    <>
      <Accordion type="single" collapsible className="w-full space-y-4">
        {surveys.map((survey) => {
          const isExpired = survey.responseCount >= FREE_PLAN_RESPONSE_LIMIT;
          
          return (
            <AccordionItem
              key={survey.id}
              value={survey.id}
              className="border rounded-lg bg-white shadow-sm"
            >
              <AccordionTrigger className="px-6 hover:no-underline">
                <SurveyAccordionHeader
                  survey={survey}
                  isExpired={isExpired}
                  onTitleClick={handleTitleClick}
                />
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <SurveyAccordionActions
                  survey={survey}
                  isExpired={isExpired}
                  onShare={handleShare}
                  onInsights={handleInsights}
                  onEdit={onEdit}
                  onResponses={handleResponses}
                  onDuplicate={handleDuplicate}
                  onDelete={handleDeleteClick}
                />
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      <DeleteSurveyDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}