import { ClipboardList, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SurveyResponses } from "@/components/dashboard/SurveyResponses";
import { RespondentResponses } from "@/components/survey/responses/RespondentResponses";

interface ResponseTabsProps {
  surveyId: string;
}

export function ResponseTabs({ surveyId }: ResponseTabsProps) {
  return (
    <Tabs defaultValue="by-question" className="w-full">
      <TabsList className="w-full bg-transparent h-auto rounded-none">
        <div className="flex w-full flex-col sm:flex-row">
          <TabsTrigger 
            value="by-question"
            className="flex-1 items-center gap-2 border-b-2 border-muted px-1 pb-4 pt-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-tr-lg rounded-tl-lg h-14"
          >
            <div className="flex items-center justify-center gap-2 w-full">
              <ClipboardList className="h-4 w-4" />
              <span className="sm:hidden text-sm">By Questions</span>
              <span className="hidden sm:inline">By Questions</span>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="by-respondent"
            className="flex-1 items-center gap-2 border-b-2 border-muted px-1 pb-4 pt-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-tr-lg rounded-tl-lg h-14"
          >
            <div className="flex items-center justify-center gap-2 w-full">
              <Users className="h-4 w-4" />
              <span className="sm:hidden text-sm">By Respondents</span>
              <span className="hidden sm:inline">By Respondents</span>
            </div>
          </TabsTrigger>
        </div>
      </TabsList>
      <TabsContent value="by-question" className="mt-6">
        <div className="overflow-x-auto">
          <SurveyResponses surveyId={surveyId} />
        </div>
      </TabsContent>
      <TabsContent value="by-respondent" className="mt-6">
        <div className="overflow-x-auto">
          <RespondentResponses surveyId={surveyId} />
        </div>
      </TabsContent>
    </Tabs>
  );
}