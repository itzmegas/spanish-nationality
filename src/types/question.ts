type Options = {
  a: string;
  b: string;
  c?: string;
};

export type Question = {
  id: string;
  question: string;
  options: Options;
  option_count: number;
  type: "multiple_choice" | "true_false";
  correct_answer: "a" | "b" | "c";
};
