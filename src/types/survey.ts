export type SurveyStatus = "active" | "draft" | "closed" | "published";

export interface Survey {
  id: string;
  title: string;
  status: SurveyStatus;
  responseCount: number;
  createdAt: string;
}