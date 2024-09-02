import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "./lib/schemas/*",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL_V2 as string,
    }
});