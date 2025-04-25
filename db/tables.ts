import { column, defineTable } from "astro:db";

export const User = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    name: column.text(),
    email: column.text(),
    emailVerified: column.date({ optional: true }),
    image: column.text({ optional: true }),
  },
});

export const Account = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    userId: column.text({ references: () => User.columns.id }),
    type: column.text(),
    provider: column.text(),
    providerAccountId: column.text(),
    refresh_token: column.text({ optional: true }),
    access_token: column.text({ optional: true }),
    expires_at: column.number({ optional: true }),
    token_type: column.text({ optional: true }),
    scope: column.text({ optional: true }),
    id_token: column.text({ optional: true }),
    session_state: column.text({ optional: true }),
  },
});

export const Session = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    userId: column.text({ references: () => User.columns.id }),
    sessionToken: column.text({ unique: true }),
    expires: column.date(),
  },
});

export const VerificationToken = defineTable({
  columns: {
    identifier: column.text(),
    token: column.text({ unique: true }),
    expires: column.date(),
  },
});

export const Exam = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    userId: column.text({ references: () => User.columns.id }),
    score: column.number(),
    createdAt: column.date(),
  },
});
