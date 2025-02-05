import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface TextResponseProps {
  questionId: string;
  response: string;
  type: "short_answer" | "paragraph";
  onResponseChange: (questionId: string, response: string) => void;
}

export const TextResponse = ({
  questionId,
  response,
  type,
  onResponseChange,
}: TextResponseProps) => {
  if (type === "short_answer") {
    return (
      <Input
        value={response || ""}
        onChange={(e) => onResponseChange(questionId, e.target.value)}
        placeholder="Enter your answer"
      />
    );
  }

  return (
    <Textarea
      value={response || ""}
      onChange={(e) => onResponseChange(questionId, e.target.value)}
      placeholder="Enter your answer"
    />
  );
};