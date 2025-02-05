import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface GridEditorProps {
  rows: string[];
  columns: string[];
  onRowChange: (index: number, value: string) => void;
  onColumnChange: (index: number, value: string) => void;
  onAddRow: () => void;
  onAddColumn: () => void;
}

export const GridEditor = ({
  rows,
  columns,
  onRowChange,
  onColumnChange,
  onAddRow,
  onAddColumn,
}: GridEditorProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label>Rows</Label>
        {rows.map((row, index) => (
          <Input
            key={index}
            value={row}
            onChange={(e) => onRowChange(index, e.target.value)}
            placeholder={`Row ${index + 1}`}
            className="mt-2"
          />
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={onAddRow}
          className="mt-2"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Row
        </Button>
      </div>
      <div>
        <Label>Columns</Label>
        {columns.map((column, index) => (
          <Input
            key={index}
            value={column}
            onChange={(e) => onColumnChange(index, e.target.value)}
            placeholder={`Column ${index + 1}`}
            className="mt-2"
          />
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={onAddColumn}
          className="mt-2"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Column
        </Button>
      </div>
    </div>
  );
};