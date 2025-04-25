import questions from "@/data/ccse_questions.json";
import type { Question } from "@/types";

export const generateRandomExam = (): Question[] => {
  // Create a copy of the questions array to avoid modifying the original
  const availableQuestions = [...questions];
  const examQuestions: Question[] = [];

  // Select 30 random questions
  for (let i = 0; i < 30 && availableQuestions.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    // Remove and get the question at the random index
    const [selectedQuestion] = availableQuestions.splice(randomIndex, 1);
    examQuestions.push(selectedQuestion as Question);
  }

  return examQuestions;
};
