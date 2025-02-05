import { StatsCard } from "./StatsCard";
import { FileAudio, BarChart3 } from "lucide-react";
import { Survey } from "@/types/survey";

interface DashboardStatsProps {
  surveys: Survey[];
}

export function DashboardStats({ surveys }: DashboardStatsProps) {
  const totalResponses = surveys.reduce((acc, survey) => acc + survey.responseCount, 0);

  return (
    <div className="grid gap-6 md:grid-cols-2 mb-8">
      <StatsCard
        title="Total Surveys"
        value={surveys.length}
        icon={<FileAudio className="h-6 w-6" style={{ color: "hsl(222.2 84% 4.9%)" }} />}
      />
      <StatsCard
        title="Total Responses"
        value={totalResponses}
        icon={<BarChart3 className="h-6 w-6" style={{ color: "hsl(222.2 84% 4.9%)" }} />}
      />
    </div>
  );
}