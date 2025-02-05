export interface SurveyAnalytics {
  id: string;
  survey_id: string;
  views: number;
  starts: number;
  submissions: number;
  avg_completion_time: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface SentimentData {
  positive: number;
  neutral: number;
  negative: number;
}

export interface ResponseAnalytics {
  sentiment_analysis?: SentimentData;
  keyword_analysis?: Array<{
    keyword: string;
    count: number;
  }>;
}

export type ResponseData = {
  [key: string]: string | number | boolean | ResponseAnalytics | null;
};