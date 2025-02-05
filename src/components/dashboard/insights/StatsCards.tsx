import { Card } from "@/components/ui/card";
import { Eye, Play, Upload, Percent, Clock } from "lucide-react";
import { SurveyAnalytics } from "@/types/analytics";

interface StatsCardsProps {
  analytics: SurveyAnalytics;
}

const formatAvgTime = (interval: string | null) => {
  if (!interval) return 'N/A';
  
  const matches = interval.match(/(\d+):(\d+):(\d+)/);
  if (!matches) return interval;
  
  const [, hours, minutes, seconds] = matches;
  
  if (Number(hours) > 0) {
    return `${hours}h ${minutes}m`;
  } else if (Number(minutes) > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
};

export function StatsCards({ analytics }: StatsCardsProps) {
  const completionRate = analytics?.views 
    ? ((analytics.submissions / analytics.views) * 100).toFixed(1) 
    : '0';

  return (
    <div className="grid gap-4 md:grid-cols-5">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Views</p>
          <Eye className="h-6 w-6 sm:h-7 sm:w-7 text-[#00A37A]" />
        </div>
        <div className="mt-2">
          <h3 className="text-2xl font-semibold">{analytics?.views || 0}</h3>
          <p className="text-sm text-muted-foreground mt-1">Total URL Views</p>
        </div>
      </Card>
      
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Starts</p>
          <Play className="h-6 w-6 sm:h-7 sm:w-7 text-[#00A37A]" />
        </div>
        <div className="mt-2">
          <h3 className="text-2xl font-semibold">{analytics?.starts || 0}</h3>
          <p className="text-sm text-muted-foreground mt-1">Survey Starts</p>
        </div>
      </Card>
      
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Submissions</p>
          <Upload className="h-6 w-6 sm:h-7 sm:w-7 text-[#00A37A]" />
        </div>
        <div className="mt-2">
          <h3 className="text-2xl font-semibold">{analytics?.submissions || 0}</h3>
          <p className="text-sm text-muted-foreground mt-1">Completed Surveys</p>
        </div>
      </Card>
      
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Completion Rate</p>
          <Percent className="h-6 w-6 sm:h-7 sm:w-7 text-[#00A37A]" />
        </div>
        <div className="mt-2">
          <h3 className="text-2xl font-semibold">{completionRate}%</h3>
          <p className="text-sm text-muted-foreground mt-1">Views to Submissions</p>
        </div>
      </Card>
      
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Avg. Time</p>
          <Clock className="h-6 w-6 sm:h-7 sm:w-7 text-[#00A37A]" />
        </div>
        <div className="mt-2">
          <h3 className="text-2xl font-semibold">
            {formatAvgTime(analytics?.avg_completion_time?.toString() || null)}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">To Complete</p>
        </div>
      </Card>
    </div>
  );
}