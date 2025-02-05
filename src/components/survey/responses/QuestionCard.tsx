import { Question } from "@/types/question";
import { QuestionSummary } from "./QuestionSummary";
import { ResponseItem } from "./ResponseItem";

interface QuestionCardProps {
  question: Question;
  responses: any[];
}

export function QuestionCard({ question, responses }: QuestionCardProps) {
  const validResponses = responses.filter(r => 
    r.response_data && r.response_data[question.id] !== undefined && 
    r.response_data[question.id] !== null && 
    r.response_data[question.id] !== ''
  );

  const renderNPSSummary = () => {
    if (question.questionType !== 'nps') return null;

    const npsGroups = validResponses.reduce((acc: any, response) => {
      const score = parseInt(response.response_data[question.id]);
      if (score >= 9) acc.promoters++;
      else if (score >= 7) acc.passives++;
      else acc.detractors++;
      return acc;
    }, { promoters: 0, passives: 0, detractors: 0 });

    const total = validResponses.length;
    const npsScore = total > 0 
      ? Math.round(((npsGroups.promoters / total) - (npsGroups.detractors / total)) * 100)
      : 0;

    return (
      <div className="mt-6 space-y-6 bg-muted/50 p-6 rounded-lg">
        <div className="text-xl font-semibold">
          NPS Score: {npsScore}
        </div>
        
        <div className="grid gap-4">
          <div className="space-y-2">
            <div className="font-medium">0-6: Detractors 😕 ({npsGroups.detractors})</div>
            <div className="text-sm text-muted-foreground">
              <p><span className="font-medium">Meaning:</span> These users are unhappy or dissatisfied.</p>
              <p><span className="font-medium">Impact:</span> They may spread negative feedback, harming your brand reputation.</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-medium">7-8: Passives 😐 ({npsGroups.passives})</div>
            <div className="text-sm text-muted-foreground">
              <p><span className="font-medium">Meaning:</span> These users are somewhat satisfied but not enthusiastic.</p>
              <p><span className="font-medium">Impact:</span> They are unlikely to promote your product and could switch to competitors easily.</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-medium">9-10: Promoters 😍 ({npsGroups.promoters})</div>
            <div className="text-sm text-muted-foreground">
              <p><span className="font-medium">Meaning:</span> These are your loyal, happy customers who love your product.</p>
              <p><span className="font-medium">Impact:</span> They actively recommend your brand, driving referrals and growth.</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <QuestionSummary question={question} responses={responses} />
      {renderNPSSummary()}
      <div className="mt-6">
        {validResponses.map((response, index) => (
          <ResponseItem
            key={response.id}
            index={index}
            questionType={question.questionType}
            responseData={response.response_data}
            questionId={question.id}
            responseId={response.id}
            createdAt={response.created_at}
          />
        ))}
      </div>
    </div>
  );
}