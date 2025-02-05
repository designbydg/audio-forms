import { Survey } from "@/types/survey";
import { Table, TableBody } from "@/components/ui/table";
import { BulkActions } from "./survey-list/BulkActions";
import { SurveyTableHeader } from "./survey-list/SurveyTableHeader";
import { SurveyRow } from "./survey-list/SurveyRow";

interface SurveyListProps {
  surveys: Survey[];
  onDelete: (id: string) => void;
  onBulkDelete: (ids: string[]) => void;
  onEdit: (id: string) => void;
  selectedSurveys: string[];
  onSelectionChange: (ids: string[]) => void;
}

export function SurveyList({ 
  surveys, 
  onDelete, 
  onBulkDelete,
  onEdit, 
  selectedSurveys,
  onSelectionChange 
}: SurveyListProps) {
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(surveys.map(survey => survey.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectSurvey = (id: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedSurveys, id]);
    } else {
      onSelectionChange(selectedSurveys.filter(surveyId => surveyId !== id));
    }
  };

  return (
    <div className="rounded-lg border bg-white overflow-hidden">
      {selectedSurveys.length > 0 && (
        <BulkActions
          selectedCount={selectedSurveys.length}
          onBulkDelete={() => onBulkDelete(selectedSurveys)}
        />
      )}
      <Table>
        <SurveyTableHeader
          onSelectAll={handleSelectAll}
          isAllSelected={selectedSurveys.length === surveys.length}
          hasItems={surveys.length > 0}
        />
        <TableBody>
          {surveys.map((survey, index) => (
            <SurveyRow
              key={survey.id}
              survey={survey}
              isSelected={selectedSurveys.includes(survey.id)}
              onSelect={(checked) => handleSelectSurvey(survey.id, checked)}
              onDelete={() => onDelete(survey.id)}
              onEdit={() => onEdit(survey.id)}
              isLast={index === surveys.length - 1}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}