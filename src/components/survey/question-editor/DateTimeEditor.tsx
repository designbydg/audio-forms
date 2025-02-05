import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DateTimeEditorProps {
  type: "date" | "time";
  value: string;
  onChange: (value: string) => void;
}

export const DateTimeEditor = ({ type, value, onChange }: DateTimeEditorProps) => {
  return (
    <div className="space-y-2">
      <Label>Default {type === "date" ? "Date" : "Time"} (Optional)</Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full"
      />
    </div>
  );
};