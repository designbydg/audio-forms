export type QuestionType = 
  | "audio_response"
  | "short_answer"
  | "paragraph"
  | "multiple_choice"
  | "checkboxes"
  | "dropdown"
  | "linear_scale"
  | "rating"
  | "multiple_choice_grid"
  | "checkbox_grid"
  | "date"
  | "time"
  | "nps";

export interface Question {
  id?: string;
  questionText: string;
  questionType: QuestionType;
  options?: any[];
  orderIndex: number;
  required?: boolean;
}