import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

interface SurveyTableHeaderProps {
  onSelectAll: (checked: boolean) => void;
  isAllSelected: boolean;
  hasItems: boolean;
}

export function SurveyTableHeader({ onSelectAll, isAllSelected, hasItems }: SurveyTableHeaderProps) {
  return (
    <TableHeader>
      <TableRow className="hover:bg-transparent">
        <TableHead className="w-[80px]">
          <Checkbox
            checked={isAllSelected && hasItems}
            onCheckedChange={(checked) => onSelectAll(checked as boolean)}
            aria-label="Select all surveys"
          />
        </TableHead>
        <TableHead>Survey Title</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>
          <span className="font-medium">Responses</span>
        </TableHead>
        <TableHead>Sentiments</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}