import { useState } from "preact/hooks";
import { Button } from "./ui/Button";
import type { MouseEventHandler } from "preact/compat";
import type { Question as TypeQuestion } from "../types";

interface QuestionProps {
  questionnaire: TypeQuestion[];
}

const defaultButtonClass =
  "bg-violet-300 hover:bg-violet-400 active:bg-violet-500";

const correctAnswerClass = "bg-green-300 hover:bg-green-300 opacity-80";
const wrongAnswerClass = "bg-red-300 hover:bg-red-300 opacity-80";

export const Question = ({ questionnaire }: QuestionProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  const handleSelectOption: MouseEventHandler<HTMLButtonElement> = (event) => {
    if (selectedOption) return;

    setSelectedOption(event.currentTarget.value);
  };

  const handleNextQuestion = () => {
    if (selectedOption) {
      setPage(page + 1);
      setSelectedOption(null);
    }
  };

  const handlePreviousQuestion = () => {
    setPage(page - 1);
    setSelectedOption(null);
  };

  return (
    <div className="flex flex-col justify-around content-center gap-10 rounded-xl py-10 h-full w-xl">
      <div className="py-20 px-10 shadow-xl bg-white rounded-xl">
        <h5 className="text-center text-md font-bold">
          {questionnaire[page].question}
        </h5>
      </div>
      <div className="flex flex-col gap-5">
        {Object.entries(questionnaire[page].options).map(([option, text]) => (
          <div className="relative">
            <div className="flex items-center justify-center absolute top-0 left-0 bg-violet-200 w-8 h-7 rounded-br-xl rounded-tl-xl z-1">
              <span className="font-bold">{option.toUpperCase()}</span>
            </div>
            <Button
              value={option}
              onClick={handleSelectOption}
              disabled={!!selectedOption}
              className={
                !selectedOption
                  ? ""
                  : option === questionnaire[page].correct_answer
                    ? correctAnswerClass
                    : selectedOption === option
                      ? wrongAnswerClass
                      : ""
              }
            >
              {`${text[0].toLocaleUpperCase()}${text.slice(1)}`}
            </Button>
          </div>
        ))}
      </div>

      <div className="flex justify-between gap-10">
        {page > 0 && (
          <Button
            className={defaultButtonClass}
            onClick={handlePreviousQuestion}
          >
            Anterior
          </Button>
        )}
        <Button
          className={defaultButtonClass}
          onClick={handleNextQuestion}
          disabled={!selectedOption}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
};
