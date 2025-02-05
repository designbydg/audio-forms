export interface KeywordAnalysis {
  keyword: string;
  count: number;
}

export interface SentimentAnalysis {
  positive: number;
  neutral: number;
  negative: number;
}

export interface ResponseData {
  [key: string]: string | number | boolean | null | {
    keyword_analysis?: KeywordAnalysis[];
    sentiment_analysis?: SentimentAnalysis;
    transcription?: string;
  };
}