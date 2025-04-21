import { useState } from "preact/hooks";
import type { Question as TypeQuestion } from "../types";
import { Button } from "./ui/Button";

interface QuestionProps {
  question: TypeQuestion;
}

export const Question = ({ question }: QuestionProps) => {
  const [selectedOption, setSelectedOption] = useState<string>();

  return (
    <div className="flex-col border-2 border-black rounded-xl p-4 space-y-5 bg-blue-200">
      <h5 className="text-md font-bold">{question.question}</h5>
      <div className="flex-col space-y-2">
        {Object.entries(question.options).map(([option, text]) => (
          <Button
            value={selectedOption}
            onClick={() => setSelectedOption(option)}
            className={
              !selectedOption  ?
               '' : 
              selectedOption === question.correct_answer &&  selectedOption === option ? 
              'bg-green-600' : 'bg-red-600'
            }
          >
            {`${text[0].toLocaleUpperCase()}${text.slice(1)}`}
          </Button>
        ))}
      </div>
    </div>
  );
};
