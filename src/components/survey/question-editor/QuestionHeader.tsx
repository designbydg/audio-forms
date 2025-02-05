import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash } from "lucide-react";

interface QuestionHeaderProps {
  questionNumber: number;
  questionText: string;
  onQuestionTextChange: (text: string) => void;
  onDelete?: () => void;
}

export const QuestionHeader = ({
  questionNumber,
  questionText,
  onQuestionTextChange,
  onDelete,
}: QuestionHeaderProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="font-medium text-muted-foreground">
          {questionNumber}.
        </span>
        <Label>Question Text</Label>
        {onDelete && (
          <Button
            variant="outline"
            size="icon"
            onClick={onDelete}
            className="ml-auto border-destructive hover:border-destructive/90"
          >
            <Trash className="h-4 w-4 text-destructive" />
          </Button>
        )}
      </div>
      <Textarea
        value={questionText}
        onChange={(e) => onQuestionTextChange(e.target.value)}
        placeholder="Enter your question"
      />
    </div>
  );
};