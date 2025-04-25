// @ts-check
import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import tailwindcss from "@tailwindcss/vite";
import db from "@astrojs/db";
import auth from "auth-astro";

import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  integrations: [preact(), db(), auth()],

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": "/src",
        "@components": "/src/components",
        "@layouts": "/src/layouts",
        "@styles": "/src/styles",
      },
    },
  },

  adapter: vercel(),
});