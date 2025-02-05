import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState } from "react";
import { TrendHeader, MetricKey, TimePeriod } from "./trend/TrendHeader";
import { TrendChart } from "./trend/TrendChart";
import { useTrendAnalytics } from "./trend/useTrendAnalytics";

interface TrendAnalysisProps {
  surveyId: string;
}

export function TrendAnalysis({ surveyId }: TrendAnalysisProps) {
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>('views');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('weekly');
  const { data: analyticsData } = useTrendAnalytics(surveyId, timePeriod);

  return (
    <Card className="bg-white overflow-hidden">
      <CardHeader className="border-b border-gray-100 pb-4">
        <TrendHeader
          selectedMetric={selectedMetric}
          setSelectedMetric={setSelectedMetric}
          timePeriod={timePeriod}
          setTimePeriod={setTimePeriod}
        />
      </CardHeader>
      <CardContent className="pt-6">
        <TrendChart 
          data={analyticsData} 
          selectedMetric={selectedMetric}
        />
      </CardContent>
    </Card>
  );
}