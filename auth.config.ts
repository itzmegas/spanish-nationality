import Google from "@auth/core/providers/google";
import { defineConfig } from "auth-astro";
import { db } from "astro:db";

export default defineConfig({
  providers: [
    Google({
      clientId: import.meta.env.AUTH_GOOGLE_ID,
      clientSecret: import.meta.env.AUTH_GOOGLE_SECRET,
    }),
  ],
});
