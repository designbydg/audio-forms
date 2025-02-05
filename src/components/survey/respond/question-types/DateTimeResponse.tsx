import { Input } from "@/components/ui/input";

interface DateTimeResponseProps {
  questionId: string;
  response: string;
  type: "date" | "time";
  onResponseChange: (questionId: string, response: string) => void;
}

export const DateTimeResponse = ({
  questionId,
  response,
  type,
  onResponseChange,
}: DateTimeResponseProps) => {
  return (
    <Input
      type={type}
      value={response || ""}
      onChange={(e) => onResponseChange(questionId, e.target.value)}
      className="w-full"
    />
  );
};