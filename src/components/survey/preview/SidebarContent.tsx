import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface SidebarContentProps {
  title: string;
  currentQuestionIndex: number;
  totalQuestions: number;
  isPreview?: boolean;
  onBack?: () => void;
}

export const SidebarContent = ({
  title,
  currentQuestionIndex,
  totalQuestions,
  isPreview = false,
  onBack,
}: SidebarContentProps) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex items-center justify-start p-6">
        <div className="text-left">
          <h2 className="text-xl font-semibold text-sidebar-foreground mb-2">{title}</h2>
          <p className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </p>
        </div>
      </div>
      <div className="p-6 border-t border-sidebar-border">
        {isPreview && onBack ? (
          <Button 
            variant="outline" 
            onClick={onBack}
            className="w-full flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Exit Preview
          </Button>
        ) : (
          <p className="text-sm text-muted-foreground">
            Powered by Audioforms
          </p>
        )}
      </div>
    </div>
  );
};