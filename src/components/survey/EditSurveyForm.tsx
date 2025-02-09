import React from 'react';
import { Question } from "@/types/question";
import { Button } from "@/components/ui/button";
import { Plus, CreditCard } from "lucide-react";
import { QuestionEditor } from "./QuestionEditor";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useToast } from "@/components/ui/use-toast";
import { getEmailLink } from "@/utils/emailUtils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface EditSurveyFormProps {
  title: string;
  onTitleChange: (title: string) => void;
  questions: Question[];
  onQuestionsChange: (questions: Question[]) => void;
}

const FREE_PLAN_QUESTION_LIMIT = 10;

export const EditSurveyForm = ({
  questions,
  onQuestionsChange,
}: EditSurveyFormProps) => {
  const [showUpgradeModal, setShowUpgradeModal] = React.useState(false);
  const { toast } = useToast();

  const handleUpgradeRequest = () => {
    window.location.href = getEmailLink();
    setShowUpgradeModal(false);
    toast({
      title: "Email client opened",
      description: "Please compose your upgrade request email.",
    });
  };

  const addQuestion = () => {
    if (questions.length >= FREE_PLAN_QUESTION_LIMIT) {
      setShowUpgradeModal(true);
      return;
    }

    const newQuestion: Question = {
      questionText: "",
      questionType: "short_answer",
      options: [],
      orderIndex: questions.length,
      required: false,
    };
    onQuestionsChange([...questions, newQuestion]);
  };

  const updateQuestion = (index: number, updatedQuestion: Question) => {
    const newQuestions = [...questions];
    newQuestions[index] = {
      ...updatedQuestion,
      required: updatedQuestion.required,
    };
    onQuestionsChange(newQuestions);
  };

  const removeQuestion = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    const reorderedQuestions = newQuestions.map((q, i) => ({
      ...q,
      orderIndex: i,
    }));
    onQuestionsChange(reorderedQuestions);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const reorderedQuestions = items.map((item, index) => ({
      ...item,
      orderIndex: index,
    }));

    onQuestionsChange(reorderedQuestions);
  };

  return (
    <div className="space-y-8">
      <AlertDialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Upgrade Your Plan
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              You've reached the maximum of {FREE_PLAN_QUESTION_LIMIT} questions allowed in the free plan.
              Upgrade to our paid plan to create surveys with unlimited questions and unlock additional features.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Maybe Later</AlertDialogCancel>
            <AlertDialogAction
              className="bg-primary"
              onClick={handleUpgradeRequest}
            >
              Get in Touch
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="questions">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {questions.map((question, index) => (
                <Draggable
                  key={index}
                  draggableId={`question-${index}`}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="mb-4"
                    >
                      <QuestionEditor
                        question={question}
                        onUpdate={(q) => updateQuestion(index, q)}
                        onDelete={() => removeQuestion(index)}
                        questionNumber={index + 1}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={addQuestion}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Question
      </Button>
    </div>
  );
};