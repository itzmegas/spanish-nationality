import { useState } from "preact/hooks";
import { Button } from "./ui/Button";
import type { MouseEventHandler } from "preact/compat";
import type { Question as TypeQuestion } from "../types";

interface QuestionProps {
  question: TypeQuestion;
  selectedOption?: string | null;
  handleSelectOption?: MouseEventHandler<HTMLButtonElement>;
}

const correctAnswerClass = "bg-green-300 hover:bg-green-300 opacity-80";
const wrongAnswerClass = "bg-red-300 hover:bg-red-300 opacity-80";

export const Question = ({
  question,
  selectedOption,
  handleSelectOption,
}: QuestionProps) => {
  const { question: title, options, correct_answer } = question;

  return (
    <div className="flex flex-col content-center gap-15 rounded-xl py-10 h-full w-xl">
      <div className="py-20 px-10 shadow-xl bg-white rounded-xl">
        <h5 className="text-center text-md font-bold">{title}</h5>
      </div>
      <div className="flex flex-col gap-5">
        {Object.entries(options).map(([option, text]) => (
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
                  : option === correct_answer
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
    </div>
  );
};
