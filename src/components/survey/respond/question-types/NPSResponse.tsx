import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface NPSResponseProps {
  questionId: string;
  response: string;
  onResponseChange: (questionId: string, response: string) => void;
  showSentiment?: boolean;
}

const getSentiment = (value: number) => {
  if (value >= 9) return "Promoters 😍";
  if (value >= 7) return "Passives 😐";
  return "Detractors 😕";
};

export const NPSResponse = ({
  questionId,
  response,
  onResponseChange,
  showSentiment = false, // Default to false for survey pages
}: NPSResponseProps) => {
  const [sentiment, setSentiment] = useState<string>("");

  useEffect(() => {
    if (response && showSentiment) {
      setSentiment(getSentiment(parseInt(response)));
    } else {
      setSentiment("");
    }
  }, [response, showSentiment]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-1">
          {Array.from({ length: 11 }, (_, i) => i).map((value) => (
            <Button
              key={value}
              variant="outline"
              className={cn(
                "h-10 w-10 text-base border-[#EDF2FF] hover:bg-[#EDF2FF] hover:text-primary",
                response === value.toString() && "bg-[#EDF2FF] text-primary border-primary"
              )}
              onClick={() => onResponseChange(questionId, value.toString())}
            >
              {value}
            </Button>
          ))}
        </div>
        {showSentiment && sentiment && (
          <div className="text-sm font-medium text-primary">{sentiment}</div>
        )}
      </div>
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>0 → Not likely at all</span>
        <span>10 → Extremely likely</span>
      </div>
    </div>
  );
};