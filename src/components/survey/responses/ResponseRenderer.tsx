import { AudioResponsePlayer } from "@/components/survey/AudioResponsePlayer";

interface ResponseRendererProps {
  questionType: string;
  response: any;
  responseId: string;
}

const getSentiment = (value: number) => {
  if (value >= 9) return "Promoters 😍";
  if (value >= 7) return "Passives 😐";
  return "Detractors 😕";
};

export function ResponseRenderer({ questionType, response, responseId }: ResponseRendererProps) {
  if (!response) return <span className="text-muted-foreground">No answer provided</span>;

  const renderResponse = (): React.ReactNode => {
    switch (questionType) {
      case 'nps':
        const score = Number(response);
        return (
          <span>
            {score} - {getSentiment(score)}
          </span>
        );
      case 'audio_response':
        return <AudioResponsePlayer response={response} responseId={responseId} />;
      case 'rating':
        return <span>{response} stars</span>;
      case 'short_answer':
      case 'paragraph':
        return <span>{String(response)}</span>;
      case 'multiple_choice':
      case 'dropdown':
        return <span>{String(response)}</span>;
      case 'checkboxes':
        return <span>{Array.isArray(response) ? response.join(', ') : String(response)}</span>;
      case 'linear_scale':
        return <span>Scale value: {String(response)}</span>;
      case 'multiple_choice_grid':
      case 'checkbox_grid':
        if (typeof response === 'object' && response !== null) {
          return (
            <div className="space-y-1">
              {Object.entries(response).map(([row, value]) => (
                <div key={row} className="text-sm">
                  <span className="font-medium">{row}:</span>{' '}
                  {Array.isArray(value) ? value.join(', ') : String(value)}
                </div>
              ))}
            </div>
          );
        }
        return <span>{JSON.stringify(response)}</span>;
      case 'date':
      case 'time':
        return <span>{String(response)}</span>;
      default:
        return <span>{JSON.stringify(response)}</span>;
    }
  };

  return <>{renderResponse()}</>;
}