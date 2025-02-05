import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useState } from "react";

interface RatingResponseProps {
  questionId: string;
  response: number | null;
  options: string[];
  onResponseChange: (questionId: string, response: number) => void;
}

export const RatingResponse = ({
  questionId,
  response,
  options,
  onResponseChange,
}: RatingResponseProps) => {
  const [selectedRating, setSelectedRating] = useState<number | null>(response);
  const maxRating = options?.[0] ? JSON.parse(options[0]).max : 5;

  return (
    <div className="flex gap-2">
      {Array.from({ length: maxRating }, (_, i) => (
        <Button
          key={i}
          variant={selectedRating === i + 1 ? "default" : "outline"}
          size="sm"
          className="w-10 h-10"
          onClick={() => {
            setSelectedRating(i + 1);
            onResponseChange(questionId, i + 1);
          }}
        >
          <Star className={selectedRating && selectedRating >= i + 1 ? "fill-current" : ""} />
        </Button>
      ))}
    </div>
  );
};