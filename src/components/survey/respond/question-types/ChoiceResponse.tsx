interface ChoiceResponseProps {
  questionId: string;
  response: string | string[];
  options: string[];
  type: "multiple_choice" | "checkboxes";
  onResponseChange: (questionId: string, response: any) => void;
}

export const ChoiceResponse = ({
  questionId,
  response,
  options,
  type,
  onResponseChange,
}: ChoiceResponseProps) => {
  if (type === "multiple_choice") {
    return (
      <div className="space-y-2">
        {options?.map((option, index) => (
          <div key={index} className="flex items-center">
            <input
              type="radio"
              id={`${questionId}-${index}`}
              name={questionId}
              value={option}
              checked={response === option}
              onChange={(e) => onResponseChange(questionId, e.target.value)}
              className="mr-2"
            />
            <label htmlFor={`${questionId}-${index}`}>{option}</label>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {options?.map((option, index) => (
        <div key={index} className="flex items-center">
          <input
            type="checkbox"
            id={`${questionId}-${index}`}
            value={option}
            checked={(response as string[])?.includes(option)}
            onChange={(e) => {
              const currentResponses = (response as string[]) || [];
              const newResponses = e.target.checked
                ? [...currentResponses, option]
                : currentResponses.filter((r: string) => r !== option);
              onResponseChange(questionId, newResponses);
            }}
            className="mr-2"
          />
          <label htmlFor={`${questionId}-${index}`}>{option}</label>
        </div>
      ))}
    </div>
  );
};