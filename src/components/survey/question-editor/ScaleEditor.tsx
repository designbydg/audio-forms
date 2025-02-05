import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ScaleEditorProps {
  minScale: number;
  maxScale: number;
  onScaleChange: (min: number, max: number) => void;
}

export const ScaleEditor = ({
  minScale,
  maxScale,
  onScaleChange,
}: ScaleEditorProps) => {
  return (
    <div className="space-y-4">
      <Label>Linear Scale Range</Label>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Minimum</Label>
          <Input
            type="number"
            value={minScale}
            onChange={(e) => onScaleChange(parseInt(e.target.value), maxScale)}
            min={1}
            max={maxScale - 1}
          />
        </div>
        <div>
          <Label>Maximum</Label>
          <Input
            type="number"
            value={maxScale}
            onChange={(e) => onScaleChange(minScale, parseInt(e.target.value))}
            min={minScale + 1}
            max={10}
          />
        </div>
      </div>
    </div>
  );
};