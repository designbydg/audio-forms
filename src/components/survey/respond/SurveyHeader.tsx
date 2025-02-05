import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SurveyHeaderProps {
  title: string;
}

export const SurveyHeader = ({ title }: SurveyHeaderProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-sm text-muted-foreground">
          Please answer all questions to complete the survey.
        </div>
      </CardContent>
    </Card>
  );
};