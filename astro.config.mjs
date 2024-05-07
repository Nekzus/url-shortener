import db from "@astrojs/db"
import react from "@astrojs/react"
import tailwind from "@astrojs/tailwind"
import { defineConfig } from "astro/config"
import auth from "auth-astro"

import vercel from "@astrojs/vercel/serverless"

// https://astro.build/config
export default defineConfig({
	output: "server",
	adapter: vercel(),
	integrations: [auth(), db(), tailwind(), react()],
})
