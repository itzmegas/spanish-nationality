import { column, defineTable } from "astro:db";

export const User = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    name: column.text(),
    email: column.text(),
  },
});
