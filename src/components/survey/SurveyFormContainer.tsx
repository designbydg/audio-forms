import { useState } from "react";
import { Question } from "@/types/question";
import { SurveyFormHeader } from "./SurveyFormHeader";
import { EditSurveyForm } from "./EditSurveyForm";
import { FullPagePreview } from "./FullPagePreview";
import { SurveyFormNavbar } from "./SurveyFormNavbar";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface SurveyFormContainerProps {
  initialTitle?: string;
  initialQuestions?: Question[];
  onSave: (title: string, questions: Question[], status: 'draft' | 'published') => void;
  isSaving: boolean;
  surveyId?: string;
}

export const SurveyFormContainer = ({
  initialTitle = "",
  initialQuestions = [],
  onSave,
  isSaving,
  surveyId,
}: SurveyFormContainerProps) => {
  const [isPreview, setIsPreview] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [validationError, setValidationError] = useState<string | null>(null);
  const { toast } = useToast();

  const validateQuestions = () => {
    const invalidQuestions = questions.filter(
      q => !q.questionText || q.questionText.trim() === "" || !q.questionType
    );
    
    if (invalidQuestions.length > 0) {
      const questionNumbers = invalidQuestions.map(
        (_, index) => questions.indexOf(invalidQuestions[index]) + 1
      );
      
      const errorMessage = `Please fill in question text and select response type for question${
        questionNumbers.length > 1 ? 's' : ''
      } ${questionNumbers.join(', ')}`;
      
      setValidationError(errorMessage);
      return false;
    }
    setValidationError(null);
    return true;
  };

  const handlePreviewToggle = () => {
    if (!isPreview) {
      if (questions.length === 0) {
        setValidationError("Please add at least one question before previewing the survey.");
        return;
      }
      
      if (!validateQuestions()) {
        return;
      }
    }
    setValidationError(null);
    setIsPreview(!isPreview);
  };

  const handleSave = (status: 'draft' | 'published' = 'draft') => {
    if (!validateQuestions()) {
      return;
    }
    const finalTitle = title.trim() || "Untitled Survey";
    onSave(finalTitle, questions, status);
  };

  if (isPreview) {
    return (
      <FullPagePreview
        title={title.trim() || "Untitled Survey"}
        questions={questions}
        onBack={() => setIsPreview(false)}
        isPreview
      />
    );
  }

  return (
    <div className="min-h-screen bg-dashboard-background">
      <div className="bg-white">
        <SurveyFormNavbar />
      </div>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-[900px] mx-auto">
          {validationError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{validationError}</AlertDescription>
            </Alert>
          )}
          <SurveyFormHeader
            onSave={() => handleSave('draft')}
            onPublish={() => handleSave('published')}
            isSaving={isSaving}
            isPreview={isPreview}
            onPreviewToggle={handlePreviewToggle}
            title={title}
            onTitleChange={setTitle}
            surveyId={surveyId}
          />
          <EditSurveyForm
            title={title}
            onTitleChange={setTitle}
            questions={questions}
            onQuestionsChange={setQuestions}
          />
        </div>
      </div>
    </div>
  );
};