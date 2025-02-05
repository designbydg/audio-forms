import { Card } from "@/components/ui/card";
import { SurveyList } from "@/components/dashboard/SurveyList";
import { RecentResponses } from "@/components/dashboard/RecentResponses";
import { Survey } from "@/types/survey";

interface DashboardContentProps {
  surveys: Survey[];
  onDelete: (id: string) => void;
  onBulkDelete: (ids: string[]) => void;
  onEdit: (id: string) => void;
  selectedSurveys: string[];
  onSelectionChange: (ids: string[]) => void;
}

export const DashboardContent = ({
  surveys,
  onDelete,
  onBulkDelete,
  onEdit,
  selectedSurveys,
  onSelectionChange,
}: DashboardContentProps) => {
  return (
    <div className="grid gap-4 sm:gap-6">
      <div>
        <h2 className="text-lg sm:text-xl font-medium mb-3 sm:mb-4">Recent surveys</h2>
        {surveys.length === 0 ? (
          <Card className="p-4 sm:p-8 text-center bg-white">
            <p className="text-muted-foreground mb-2">
              You haven't created any surveys yet.
            </p>
          </Card>
        ) : (
          <div className="overflow-x-auto">
            <SurveyList
              surveys={surveys}
              onDelete={onDelete}
              onBulkDelete={onBulkDelete}
              onEdit={onEdit}
              selectedSurveys={selectedSurveys}
              onSelectionChange={onSelectionChange}
            />
          </div>
        )}

        <h2 className="text-lg sm:text-xl font-medium mb-3 sm:mb-4 mt-6 sm:mt-8">Recent responses</h2>
        <RecentResponses />
      </div>
    </div>
  );
}