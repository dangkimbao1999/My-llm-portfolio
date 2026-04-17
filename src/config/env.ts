import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  APP_NAME: z.string().default("Portfolio AI Representative"),
  APP_BASE_URL: z.string().url().default("http://localhost:3000"),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_API_BASE: z.string().url().default("https://api.openai.com/v1"),
  LLM_MODEL: z.string().default("gpt-4.1-mini"),
  OPENAI_TEMPERATURE: z.coerce.number().min(0).max(2).default(0.2),
  DATABASE_URL: z.string().optional(),
  ENABLE_DB: z.coerce.boolean().default(true),
  ENABLE_LLM: z.coerce.boolean().default(false),
  ENABLE_VERBOSE_LOGS: z.coerce.boolean().default(true),
  CHAT_TOP_K: z.coerce.number().int().min(1).max(10).default(5),
  RETRIEVAL_MIN_SCORE: z.coerce.number().int().min(1).default(4),
});

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  APP_NAME: process.env.APP_NAME,
  APP_BASE_URL: process.env.APP_BASE_URL,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_API_BASE: process.env.OPENAI_API_BASE,
  LLM_MODEL: process.env.LLM_MODEL,
  OPENAI_TEMPERATURE: process.env.OPENAI_TEMPERATURE,
  DATABASE_URL: process.env.DATABASE_URL,
  ENABLE_DB: process.env.ENABLE_DB,
  ENABLE_LLM: process.env.ENABLE_LLM,
  ENABLE_VERBOSE_LOGS: process.env.ENABLE_VERBOSE_LOGS,
  CHAT_TOP_K: process.env.CHAT_TOP_K,
  RETRIEVAL_MIN_SCORE: process.env.RETRIEVAL_MIN_SCORE,
});
