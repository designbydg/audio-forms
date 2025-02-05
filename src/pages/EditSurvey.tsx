import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Question, QuestionType } from "@/types/question";
import { useState } from "react";
import { SurveyFormContainer } from "@/components/survey/SurveyFormContainer";

const EditSurvey = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["survey", id],
    queryFn: async () => {
      if (!id) throw new Error('Survey ID is required');
      
      const { data: surveyData, error: surveyError } = await supabase
        .from("surveys")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (surveyError) throw surveyError;
      if (!surveyData) throw new Error('Survey not found');

      const { data: questionsData, error: questionsError } = await supabase
        .from("questions")
        .select("*")
        .eq("survey_id", id)
        .order("order_index");

      if (questionsError) throw questionsError;

      return {
        survey: surveyData,
        questions: questionsData.map(q => ({
          id: q.id,
          questionText: q.question_text,
          questionType: q.question_type as QuestionType,
          options: q.options as any[] || [],
          orderIndex: q.order_index,
          required: q.required === true
        })),
      };
    },
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ title, questions, status }: { title: string; questions: Question[]; status: 'draft' | 'published' }) => {
      if (!id) throw new Error('Survey ID is required');

      const { error: surveyError } = await supabase
        .from("surveys")
        .update({ title, status })
        .eq("id", id);

      if (surveyError) throw surveyError;

      const questionsData = questions.map(q => ({
        id: q.id,
        survey_id: id,
        question_text: q.questionText,
        question_type: q.questionType,
        options: q.options || [],
        order_index: q.orderIndex,
        required: q.required || false
      }));

      const existingQuestionIds = questionsData.filter(q => q.id).map(q => q.id);
      if (existingQuestionIds.length > 0) {
        const { error: deleteError } = await supabase
          .from("questions")
          .delete()
          .eq("survey_id", id)
          .not("id", "in", `(${existingQuestionIds.join(",")})`);

        if (deleteError) throw deleteError;
      }

      const questionsToUpdate = questionsData.filter(q => q.id);
      if (questionsToUpdate.length > 0) {
        const { error: updateError } = await supabase
          .from("questions")
          .upsert(questionsToUpdate);

        if (updateError) throw updateError;
      }

      const questionsToInsert = questionsData
        .filter(q => !q.id)
        .map(({ id, ...rest }) => rest);

      if (questionsToInsert.length > 0) {
        const { error: insertError } = await supabase
          .from("questions")
          .insert(questionsToInsert);

        if (insertError) throw insertError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["surveys"] });
      queryClient.invalidateQueries({ queryKey: ["survey", id] });
    },
  });

  const handleSave = async (title: string, questions: Question[], status: 'draft' | 'published') => {
    try {
      setIsSaving(true);
      await updateMutation.mutateAsync({ title, questions, status });
      if (status === 'published') {
        navigate('/');
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (error || !data || !data.survey) {
    return <div className="p-8">Error: Survey not found</div>;
  }

  return (
    <SurveyFormContainer
      initialTitle={data.survey.title}
      initialQuestions={data.questions}
      onSave={handleSave}
      isSaving={isSaving}
      surveyId={id}
    />
  );
};

export default EditSurvey;