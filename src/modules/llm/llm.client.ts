import { env } from "@/config/env";
import { AppError } from "@/lib/errors";
import { logger } from "@/lib/logger";

export type GenerateAnswerInput = {
  systemPrompt: string;
  userPrompt: string;
};

export type GenerateAnswerResult = {
  answer: string;
  model: string;
};

export class LlmClient {
  isEnabled() {
    return env.ENABLE_LLM && Boolean(env.OPENAI_API_KEY);
  }

  async generateAnswer(input: GenerateAnswerInput): Promise<GenerateAnswerResult> {
    if (!this.isEnabled()) {
      throw new AppError(
        "LLM provider is not configured. Set OPENAI_API_KEY and ENABLE_LLM=true.",
        503,
        "LLM_NOT_CONFIGURED",
      );
    }

    const response = await fetch(`${env.OPENAI_API_BASE}/responses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: env.LLM_MODEL,
        temperature: env.OPENAI_TEMPERATURE,
        input: [
          {
            role: "system",
            content: [{ type: "input_text", text: input.systemPrompt }],
          },
          {
            role: "user",
            content: [{ type: "input_text", text: input.userPrompt }],
          },
        ],
      }),
    }).catch((error) => {
      throw new AppError("Failed to reach OpenAI API.", 502, "LLM_NETWORK_ERROR", error);
    });

    const payload = (await response.json().catch(() => null)) as
      | {
          error?: { message?: string; code?: string };
          output_text?: string;
          output?: Array<{
            type?: string;
            content?: Array<{ type?: string; text?: string }>;
          }>;
          model?: string;
        }
      | null;

    if (!response.ok) {
      throw new AppError(
        payload?.error?.message || "OpenAI API returned an error.",
        502,
        payload?.error?.code || "LLM_REQUEST_FAILED",
        payload,
      );
    }

    const answer = this.extractOutputText(payload);

    if (!answer) {
      logger.error("OpenAI response did not contain output_text.", payload);
      throw new AppError("OpenAI API response was missing output text.", 502, "LLM_EMPTY_RESPONSE", payload);
    }

    return {
      model: payload?.model || env.LLM_MODEL,
      answer,
    };
  }

  private extractOutputText(
    payload:
      | {
          output_text?: string;
          output?: Array<{
            type?: string;
            content?: Array<{ type?: string; text?: string }>;
          }>;
        }
      | null,
  ) {
    if (payload?.output_text?.trim()) {
      return payload.output_text.trim();
    }

    return (
      payload?.output
        ?.flatMap((item) => item.content ?? [])
        .map((content) => content.text ?? "")
        .join("\n")
        .trim() || ""
    );
  }
}
