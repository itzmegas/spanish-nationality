import { db, User } from "astro:db";

// https://astro.build/db/seed
export default async function seed() {
  await db.insert(User).values([
    {
      id: "d3116ddd-8428-48b6-90f6-631af567398a",
      name: "Emmanuel",
      email: "emmanuel@propios.com",
    },
    {
      id: "ec1da468-7b70-491a-9985-8b17bf3a7c37",
      name: "Paula",
      email: "paula@propios.com",
    },
  ]);
}
