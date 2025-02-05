import { StatsCards } from "./StatsCards";
import { SentimentAnalysisCard } from "./SentimentAnalysis";
import { TrendAnalysis } from "./TrendAnalysis";
import { SurveyAnalytics } from "@/types/analytics";

interface InsightsContentProps {
  surveyId: string;
  surveyTitle?: string;
  analytics?: SurveyAnalytics;
}

export function InsightsContent({ surveyId, surveyTitle, analytics }: InsightsContentProps) {
  if (!surveyId) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-250px)]">
        <div className="text-center text-muted-foreground px-4">
          <p>Select a survey from the sidebar to view insights</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <h1 className="text-xl sm:text-2xl">
        {surveyTitle ? `${surveyTitle} Insights` : 'Loading...'}
      </h1>

      {analytics && <StatsCards analytics={analytics} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8">
        <div className="w-full overflow-x-auto">
          <SentimentAnalysisCard surveyId={surveyId} />
        </div>
        <div className="w-full overflow-x-auto">
          <TrendAnalysis surveyId={surveyId} />
        </div>
      </div>
    </div>
  );
}