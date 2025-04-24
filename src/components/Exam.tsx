import { useState } from "preact/hooks";
import type { Question as TypeQuestion } from "../types";
import { Question } from "./Question";
import { Button } from "./ui/Button";
import type { MouseEventHandler } from "preact/compat";

interface ExamProps {
  questionnaire: TypeQuestion[];
}

const defaultButtonClass =
  "bg-violet-300 hover:bg-violet-400 active:bg-violet-500";

export const Exam = ({ questionnaire }: ExamProps) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSelectOption: MouseEventHandler<HTMLButtonElement> = (event) => {
    if (selectedOption) return;

    setSelectedOption(event.currentTarget.value);
  };

  const handleNextQuestion = () => {
    if (questionIndex === questionnaire.length - 1) return;
    setQuestionIndex(questionIndex + 1);
    setSelectedOption(null);
  };

  const handlePreviousQuestion = () => {
    if (questionIndex === 0) return;
    setQuestionIndex(questionIndex - 1);
    setSelectedOption(null);
  };

  return (
    <div className="flex flex-col gap-10 h-full">
      <Question
        question={questionnaire[questionIndex]}
        selectedOption={selectedOption}
        handleSelectOption={handleSelectOption}
      />

      <div className="flex justify-between gap-10">
        {questionIndex > 0 && (
          <Button
            className={defaultButtonClass}
            onClick={handlePreviousQuestion}
          >
            Anterior
          </Button>
        )}
        <Button className={defaultButtonClass} onClick={handleNextQuestion}>
          Siguiente
        </Button>
      </div>
    </div>
  );
};
