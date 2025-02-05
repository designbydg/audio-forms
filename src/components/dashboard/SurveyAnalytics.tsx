import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface SurveyAnalytics {
  views: number;
  starts: number;
  submissions: number;
  avg_completion_time: string | null;
}

interface SurveyAnalyticsProps {
  surveyId: string;
}

function formatTime(timeString: string | null): string {
  if (!timeString) return 'N/A';
  
  // Parse the interval string
  const matches = timeString.match(/(\d+):(\d+):(\d+)/);
  if (!matches) return timeString;
  
  const [, hours, minutes, seconds] = matches;
  
  // Format based on duration
  if (Number(hours) > 0) {
    return `${hours}h ${minutes}m`;
  } else if (Number(minutes) > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}

export function SurveyAnalytics({ surveyId }: SurveyAnalyticsProps) {
  const { data: analytics, isLoading, error } = useQuery({
    queryKey: ['survey-analytics', surveyId],
    queryFn: async () => {
      console.log('Fetching analytics for survey:', surveyId);
      
      // First try to get existing analytics
      const { data, error } = await supabase
        .from('survey_analytics')
        .select('*')
        .eq('survey_id', surveyId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching analytics:', error);
        throw error;
      }
      
      console.log('Fetched analytics data:', data);
      
      // If no analytics exist, initialize them using the RPC function
      if (!data) {
        console.log('No analytics found, initializing...');
        const { error: rpcError } = await supabase
          .rpc('initialize_survey_analytics', { p_survey_id: surveyId }); // Updated parameter name here
          
        if (rpcError) {
          console.error('Error initializing analytics:', rpcError);
          throw rpcError;
        }
        
        // Fetch the newly created analytics
        const { data: newData, error: refetchError } = await supabase
          .from('survey_analytics')
          .select('*')
          .eq('survey_id', surveyId)
          .maybeSingle();
          
        if (refetchError) {
          console.error('Error fetching new analytics:', refetchError);
          throw refetchError;
        }
        
        return newData || {
          views: 0,
          starts: 0,
          submissions: 0,
          avg_completion_time: null
        } as SurveyAnalytics;
      }
      
      return data as SurveyAnalytics;
    },
    staleTime: 1000, // Consider data fresh for 1 second
    refetchInterval: 5000, // Refetch every 5 seconds to keep analytics up to date
  });

  if (isLoading) {
    return <div className="flex items-center justify-center p-4">Loading analytics...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load survey analytics</AlertDescription>
      </Alert>
    );
  }

  const completionRate = analytics.starts > 0 
    ? ((analytics.submissions / analytics.starts) * 100).toFixed(1)
    : '0';

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Views</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.views}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Starts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.starts}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.submissions}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completionRate}%</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Time to Complete</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatTime(String(analytics?.avg_completion_time))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}