import { Question } from "@/types/question";
import { useState } from "react";
import { QuestionHeader } from "./question-editor/QuestionHeader";
import { ResponseTypeSelector } from "./question-editor/ResponseTypeSelector";
import { OptionsEditor } from "./question-editor/OptionsEditor";
import { GridEditor } from "./question-editor/GridEditor";
import { ScaleEditor } from "./question-editor/ScaleEditor";
import { RatingEditor } from "./question-editor/RatingEditor";
import { DateTimeEditor } from "./question-editor/DateTimeEditor";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface QuestionEditorProps {
  question: Question;
  onUpdate: (question: Question) => void;
  onDelete?: () => void;
  questionNumber: number;
}

export const QuestionEditor = ({
  question,
  onUpdate,
  onDelete,
  questionNumber,
}: QuestionEditorProps) => {
  const [minScale, setMinScale] = useState(1);
  const [maxScale, setMaxScale] = useState(5);
  const [ratingMax, setRatingMax] = useState(5);
  const [showResponseTypes, setShowResponseTypes] = useState(false);

  const updateQuestion = (updates: Partial<Question>) => {
    const updatedQuestion = {
      ...question,
      ...updates,
      required: updates.hasOwnProperty('required') ? updates.required : question.required,
    };
    onUpdate(updatedQuestion);
  };

  const addOption = () => {
    const newOptions = [...(question.options || []), ""];
    updateQuestion({ options: newOptions });
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...(question.options || [])];
    if (index < newOptions.length) {
      newOptions[index] = value;
      updateQuestion({ options: newOptions });
    }
  };

  const addGridOption = (type: 'row' | 'column') => {
    const currentOptions = question.options?.[0] ? JSON.parse(question.options[0]) : { rows: [], columns: [] };
    if (type === 'row') {
      currentOptions.rows.push(`Row ${currentOptions.rows.length + 1}`);
    } else {
      currentOptions.columns.push(`Column ${currentOptions.columns.length + 1}`);
    }
    updateQuestion({ options: [JSON.stringify(currentOptions)] });
  };

  const updateGridOption = (type: 'row' | 'column', index: number, value: string) => {
    const currentOptions = question.options?.[0] ? JSON.parse(question.options[0]) : { rows: [], columns: [] };
    if (type === 'row') {
      currentOptions.rows[index] = value;
    } else {
      currentOptions.columns[index] = value;
    }
    updateQuestion({ options: [JSON.stringify(currentOptions)] });
  };

  const needsOptions = ["multiple_choice", "checkboxes", "dropdown"].includes(question.questionType);
  const hasLinearScale = question.questionType === "linear_scale";
  const hasRating = question.questionType === "rating";
  const isGrid = ["multiple_choice_grid", "checkbox_grid"].includes(question.questionType);
  const isDate = question.questionType === "date";
  const isTime = question.questionType === "time";

  const gridOptions = isGrid ? (question.options?.[0] ? JSON.parse(question.options[0]) : { rows: [], columns: [] }) : null;

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card">
      <QuestionHeader
        questionNumber={questionNumber}
        questionText={question.questionText}
        onQuestionTextChange={(text) => updateQuestion({ questionText: text })}
        onDelete={onDelete}
      />

      <ResponseTypeSelector
        questionType={question.questionType}
        showResponseTypes={showResponseTypes}
        onResponseTypeChange={(types) => {
          updateQuestion({ questionType: types[0] });
          setShowResponseTypes(false);
        }}
        onToggleResponseTypes={() => setShowResponseTypes(!showResponseTypes)}
        questionId={question.id}
      />

      <div className="flex items-center space-x-2">
        <Switch
          id={`required-${question.id || questionNumber}`}
          checked={question.required}
          onCheckedChange={(checked) => updateQuestion({ required: checked })}
        />
        <Label htmlFor={`required-${question.id || questionNumber}`}>Mandatory Question</Label>
      </div>

      {needsOptions && (
        <OptionsEditor
          options={question.options || []}
          onOptionChange={updateOption}
          onAddOption={addOption}
        />
      )}

      {isGrid && gridOptions && (
        <GridEditor
          rows={gridOptions.rows}
          columns={gridOptions.columns}
          onRowChange={(index, value) => updateGridOption('row', index, value)}
          onColumnChange={(index, value) => updateGridOption('column', index, value)}
          onAddRow={() => addGridOption('row')}
          onAddColumn={() => addGridOption('column')}
        />
      )}

      {hasLinearScale && (
        <ScaleEditor
          minScale={minScale}
          maxScale={maxScale}
          onScaleChange={(min, max) => {
            setMinScale(min);
            setMaxScale(max);
            updateQuestion({ options: [JSON.stringify({ min, max })] });
          }}
        />
      )}

      {hasRating && (
        <RatingEditor
          ratingMax={ratingMax}
          onRatingChange={(max) => {
            setRatingMax(max);
            updateQuestion({ options: [JSON.stringify({ max })] });
          }}
        />
      )}

      {isDate && (
        <DateTimeEditor
          type="date"
          value={question.options?.[0] || ""}
          onChange={(value) => updateQuestion({ options: [value] })}
        />
      )}

      {isTime && (
        <DateTimeEditor
          type="time"
          value={question.options?.[0] || ""}
          onChange={(value) => updateQuestion({ options: [value] })}
        />
      )}
    </div>
  );
};
