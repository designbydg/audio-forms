import { Button } from "@/components/ui/button";
import { Eye, Save, Upload, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SurveyFormHeaderProps {
  onSave: () => void;
  onPublish: () => void;
  isSaving: boolean;
  isPreview: boolean;
  onPreviewToggle: () => void;
  surveyTitle?: string;
  surveyId?: string;
  title: string;
  onTitleChange: (title: string) => void;
}

export const SurveyFormHeader = ({
  onSave,
  onPublish,
  isSaving,
  isPreview,
  onPreviewToggle,
  title,
  onTitleChange,
}: SurveyFormHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-8 mb-8">
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className="h-8 w-8 shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Enter survey title"
          className="text-2xl border-none focus:outline-none focus:ring-0 placeholder:text-[#222222] bg-transparent w-full"
        />
      </div>
      <div className="flex flex-wrap gap-2 sm:gap-4 w-full sm:w-auto">
        <Button 
          variant={isPreview ? "outline" : "outline"}
          onClick={onPreviewToggle}
          className="flex-1 sm:flex-none"
        >
          <Eye className="mr-2 h-4 w-4" />
          {isPreview ? "Edit" : "Preview"}
        </Button>
        <Button 
          variant="outline" 
          onClick={onSave} 
          disabled={isSaving}
          className="flex-1 sm:flex-none"
        >
          <Save className="mr-2 h-4 w-4" />
          Save Draft
        </Button>
        <Button 
          onClick={onPublish} 
          disabled={isSaving}
          className="flex-1 sm:flex-none"
        >
          <Upload className="mr-2 h-4 w-4" />
          Publish
        </Button>
      </div>
    </div>
  );
};