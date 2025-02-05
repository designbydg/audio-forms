import { StatsCard } from "@/components/dashboard/StatsCard";
import { FileText, Users, BarChart3, ArrowDownUp } from "lucide-react";

interface DashboardMetricsProps {
  totalSurveys: number;
  publishedSurveys: number;
  totalResponses: number;
  totalViews: number;
  responseRate: string;
  bounceRate: string;
}

export const DashboardMetrics = ({
  totalSurveys,
  publishedSurveys,
  totalResponses,
  totalViews,
  responseRate,
  bounceRate,
}: DashboardMetricsProps) => {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Surveys Created"
        value={totalSurveys}
        icon={<FileText className="h-6 w-6 sm:h-7 sm:w-7 text-[#00A37A]" />}
        change={`${publishedSurveys} Published`}
      />
      <StatsCard
        title="Survey Responses"
        value={totalResponses}
        icon={<Users className="h-6 w-6 sm:h-7 sm:w-7 text-[#00A37A]" />}
        change={`${totalViews} Total Views`}
      />
      <StatsCard
        title="Response Rate"
        value={`${responseRate}%`}
        icon={<BarChart3 className="h-6 w-6 sm:h-7 sm:w-7 text-[#00A37A]" />}
        change="Responses vs Views"
      />
      <StatsCard
        title="Bounce Rate"
        value={`${bounceRate}%`}
        icon={<ArrowDownUp className="h-6 w-6 sm:h-7 sm:w-7 text-[#00A37A]" />}
        change="Started but Not Completed"
      />
    </div>
  );
};