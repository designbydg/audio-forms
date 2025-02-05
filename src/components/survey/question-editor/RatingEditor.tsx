import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface RatingEditorProps {
  ratingMax: number;
  onRatingChange: (max: number) => void;
}

export const RatingEditor = ({ ratingMax, onRatingChange }: RatingEditorProps) => {
  return (
    <div className="space-y-4">
      <Label>Maximum Rating</Label>
      <Slider
        value={[ratingMax]}
        onValueChange={(value) => onRatingChange(value[0])}
        min={1}
        max={10}
        step={1}
        className="w-full"
      />
      <div className="text-sm text-muted-foreground">
        Maximum rating: {ratingMax}
      </div>
    </div>
  );
};