import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

interface GridResponseProps {
  questionId: string;
  response: Record<string, any>;
  options: string[];
  type: "multiple_choice_grid" | "checkbox_grid";
  onResponseChange: (questionId: string, response: any) => void;
}

export const GridResponse = ({
  questionId,
  response = {},
  options,
  type,
  onResponseChange,
}: GridResponseProps) => {
  // Safely parse grid options with fallback
  const gridOptions = (() => {
    try {
      return options?.[0] ? JSON.parse(options[0]) : { rows: [], columns: [] };
    } catch (error) {
      console.error('Error parsing grid options:', error);
      return { rows: [], columns: [] };
    }
  })();

  const isCheckbox = type === "checkbox_grid";

  const handleGridChange = (row: string, value: any) => {
    if (isCheckbox) {
      const currentValues = response?.[row] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v: string) => v !== value)
        : [...currentValues, value];
      onResponseChange(questionId, { ...response, [row]: newValues });
    } else {
      onResponseChange(questionId, { ...response, [row]: value });
    }
  };

  if (!gridOptions.rows?.length || !gridOptions.columns?.length) {
    return <div className="text-muted-foreground">No grid options available</div>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="min-w-full border-collapse bg-white">
        <thead>
          <tr className="bg-gray-50">
            <th className="p-3 border text-left"></th>
            {gridOptions.columns.map((column: string, colIndex: number) => (
              <th key={colIndex} className="p-3 border text-center text-sm font-medium text-gray-700">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {gridOptions.rows.map((row: string, rowIndex: number) => (
            <tr 
              key={rowIndex}
              className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
            >
              <td className="p-3 border text-sm text-gray-700">{row}</td>
              {gridOptions.columns.map((column: string, colIndex: number) => (
                <td key={colIndex} className="p-3 border text-center">
                  {isCheckbox ? (
                    <Checkbox
                      checked={(response?.[row] || []).includes(column)}
                      onCheckedChange={(checked) => {
                        handleGridChange(row, column);
                      }}
                      className="mx-auto"
                    />
                  ) : (
                    <RadioGroup
                      value={response?.[row] || ''}
                      onValueChange={(value) => handleGridChange(row, value)}
                      className="flex justify-center"
                    >
                      <RadioGroupItem value={column} className="mx-auto" />
                    </RadioGroup>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};