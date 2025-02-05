import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DropdownResponseProps {
  questionId: string;
  response: string;
  options: string[];
  onResponseChange: (questionId: string, response: string) => void;
}

export const DropdownResponse = ({
  questionId,
  response,
  options,
  onResponseChange,
}: DropdownResponseProps) => {
  return (
    <Select
      value={response}
      onValueChange={(value) => onResponseChange(questionId, value)}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option, index) => (
          <SelectItem key={index} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};