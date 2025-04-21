import { useState } from "preact/hooks";
import type { Question as TypeQuestion } from "../types";
import { Button } from "./ui/Button";

interface QuestionProps {
  question: TypeQuestion;
}

export const Question = ({ question }: QuestionProps) => {
  const [selectedOption, setSelectedOption] = useState<string>();
  console.log("🚀 ~ Question ~ selectedOption:", selectedOption);

  return (
    <div className="flex-col border-2 border-black rounded-xl p-4 space-y-5">
      <h5 className="text-md font-bold">{question.question}</h5>
      <div className="flex-col space-y-2">
        {Object.entries(question.options).map(([option, text]) => (
          <Button
            value={selectedOption}
            onClick={() => setSelectedOption(option)}
          >
            {text.toLocaleUpperCase()}
          </Button>
        ))}
      </div>
    </div>
  );
};
