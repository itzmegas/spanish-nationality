import { column, defineTable } from "astro:db";
import { User } from "./user";

export const Exam = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    name: column.text(),
    description: column.text(),
    answers: column.json(),
    number: column.number(),
    total_questions: column.number(),
    correct_answers: column.number(),
    wrong_answers: column.number(),
    user_id: column.text({ references: () => User.columns.id }),
  },
});
