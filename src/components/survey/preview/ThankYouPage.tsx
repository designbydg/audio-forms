import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const ThankYouPage = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">Thank You!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p className="text-muted-foreground">
            Your response has been successfully submitted. We appreciate your time and feedback.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};