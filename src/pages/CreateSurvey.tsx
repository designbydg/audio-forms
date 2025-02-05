import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Question } from "@/types/question";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SurveyFormContainer } from "@/components/survey/SurveyFormContainer";

const CreateSurvey = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (title: string, questions: Question[], status: 'draft' | 'published') => {
    try {
      setIsSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to create a survey",
          variant: "destructive",
        });
        return;
      }

      const { data: survey, error: surveyError } = await supabase
        .from("surveys")
        .insert({
          title,
          status,
          user_id: user.id,
        })
        .select()
        .single();

      if (surveyError) throw surveyError;

      const questionsData = questions.map(q => ({
        survey_id: survey.id,
        question_text: q.questionText,
        question_type: q.questionType,
        options: q.options || [],
        order_index: q.orderIndex,
        required: q.required || false // Explicitly set required field
      }));

      const { error: questionsError } = await supabase
        .from("questions")
        .insert(questionsData);

      if (questionsError) throw questionsError;

      toast({
        title: "Success",
        description: `Survey ${status === "published" ? "published" : "saved as draft"}`,
      });
      
      navigate("/");
    } catch (error: any) {
      console.error("Error saving survey:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save survey",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SurveyFormContainer
      onSave={handleSave}
      isSaving={isSaving}
    />
  );
};

export default CreateSurvey;