import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";

interface OptionsEditorProps {
  options: string[];
  onOptionChange: (index: number, value: string) => void;
  onAddOption: () => void;
}

export const OptionsEditor = ({
  options,
  onOptionChange,
  onAddOption,
}: OptionsEditorProps) => {
  const handleRemoveOption = (indexToRemove: number) => {
    // Create new array without the removed option
    const newOptions = options.filter((_, index) => index !== indexToRemove);
    
    // Update each remaining option with its new index
    newOptions.forEach((option, index) => {
      onOptionChange(index, option);
    });
  };

  return (
    <div className="space-y-2">
      <Label>Options</Label>
      {options.map((option, index) => (
        <div key={index} className="flex gap-2 items-center">
          <Input
            value={option}
            onChange={(e) => onOptionChange(index, e.target.value)}
            placeholder={`Option ${index + 1}`}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleRemoveOption(index)}
            type="button"
            disabled={options.length <= 1}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onAddOption}
        type="button"
        className="mt-2"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Option
      </Button>
    </div>
  );
};