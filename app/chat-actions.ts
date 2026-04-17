"use server";

import { headers } from "next/headers";

import { initialChatState, type ChatActionState } from "./chat-state";

function sanitizeMessages(messages: ChatActionState["messages"]) {
  return messages.slice(-12).map((message) => ({
    role: (message.role === "user" ? "user" : "assistant") as "user" | "assistant",
    content: String(message.content ?? ""),
    sources: Array.isArray(message.sources) ? message.sources : undefined,
  }));
}

async function buildApiUrl() {
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const protocol = headerStore.get("x-forwarded-proto") ?? "http";

  if (!host) {
    throw new Error("Unable to resolve host for internal API call.");
  }

  return `${protocol}://${host}/api/chat`;
}

export async function submitChatMessage(
  previousState: ChatActionState,
  formData: FormData,
): Promise<ChatActionState> {
  const question = String(formData.get("question") ?? "").trim();

  if (!question) {
    return {
      ...previousState,
      error: "Please enter a question before sending.",
    };
  }

  const messages = sanitizeMessages(previousState.messages);
  const nextMessages: ChatActionState["messages"] = [
    ...messages,
    {
      role: "user" as const,
      content: question,
    },
  ];

  try {
    const apiUrl = await buildApiUrl();
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({ question }),
    });

    const payload = (await response.json().catch(() => null)) as
      | {
          ok?: boolean;
          data?: {
            answer?: string;
            sources?: Array<{
              chunkId: string;
              documentId: string;
              title: string;
              sourcePath: string;
              score: number;
            }>;
          };
          error?: { message?: string };
        }
      | null;

    if (!response.ok || !payload?.ok || !payload.data?.answer) {
      return {
        messages: nextMessages,
        error: payload?.error?.message || "The chat request failed.",
      };
    }

    return {
      messages: [
        ...nextMessages,
        {
          role: "assistant",
          content: payload.data.answer,
          sources: payload.data.sources ?? [],
        },
      ],
      error: null,
    };
  } catch {
    return {
      messages: nextMessages,
      error: "Unable to reach the chat service right now.",
    };
  }
}
