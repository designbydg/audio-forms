import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const RecentResponses = () => {
  const navigate = useNavigate();
  
  const { data: responses, isLoading } = useQuery({
    queryKey: ['recent-responses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('responses')
        .select(`
          *,
          survey:surveys(
            id,
            title
          )
        `)
        .order('created_at', { ascending: false })
        .limit(2);
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <Card className="p-8 text-center bg-white">
        <p className="text-muted-foreground">Loading responses...</p>
      </Card>
    );
  }

  if (!responses?.length) {
    return (
      <Card className="p-8 text-center bg-white">
        <p className="text-muted-foreground mb-2">
          You haven't received any responses yet.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {responses.map((response) => (
        <Card key={response.id} className="p-4 bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full sm:px-2">
            <div className="space-y-2">
              <h3 className="font-medium text-sm">
                {response.survey?.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                Received {new Date(response.created_at).toLocaleDateString()}
              </p>
            </div>
            <Button
              variant="ghost"
              className="pl-0 justify-start hover:pl-2 transition-all mt-2 sm:mt-0"
              onClick={() => navigate(`/view-responses/${response.survey?.id}`)}
            >
              View Details
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};