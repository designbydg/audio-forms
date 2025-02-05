import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Survey } from "@/types/survey";
import { SurveyAccordionList } from "@/components/dashboard/SurveyAccordionList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Surveys = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedSurveys, setSelectedSurveys] = useState<string[]>([]);

  const { data: surveys = [], isLoading } = useQuery({
    queryKey: ['surveys'],
    queryFn: async () => {
      const { data: surveys, error: surveysError } = await supabase
        .from('surveys')
        .select(`
          id,
          title,
          status,
          created_at,
          responses:responses(count)
        `)
        .order('created_at', { ascending: false });

      if (surveysError) {
        console.error('Error fetching surveys:', surveysError);
        throw surveysError;
      }

      return surveys.map(survey => ({
        id: survey.id,
        title: survey.title,
        status: survey.status,
        responseCount: survey.responses?.[0]?.count || 0,
        createdAt: survey.created_at
      })) as Survey[];
    },
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('surveys')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Survey deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting survey:', error);
      toast({
        title: "Error",
        description: "Failed to delete survey",
        variant: "destructive",
      });
    }
  };

  const handleBulkDelete = async (ids: string[]) => {
    try {
      const { error } = await supabase
        .from('surveys')
        .delete()
        .in('id', ids);

      if (error) throw error;

      setSelectedSurveys([]);
      toast({
        title: "Success",
        description: "Selected surveys deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting surveys:', error);
      toast({
        title: "Error",
        description: "Failed to delete selected surveys",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/edit-survey/${id}`);
  };

  if (isLoading) {
    return <Layout><div>Loading...</div></Layout>;
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl">All Surveys</h1>
          <Button onClick={() => navigate("/create-survey")}>
            <Plus className="h-4 w-4" />
            Create Survey
          </Button>
        </div>

        <SurveyAccordionList
          surveys={surveys}
          onDelete={handleDelete}
          onBulkDelete={handleBulkDelete}
          onEdit={handleEdit}
          selectedSurveys={selectedSurveys}
          onSelectionChange={setSelectedSurveys}
        />
      </div>
    </Layout>
  );
};

export default Surveys;