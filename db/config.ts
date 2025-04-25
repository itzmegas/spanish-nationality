import { defineDb } from "astro:db";
import { Exam, User } from "./tables";

// https://astro.build/db/config
export default defineDb({
  tables: {
    User,
  },
});
