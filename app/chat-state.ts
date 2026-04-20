export type ChatMessage = {
  role: "assistant" | "user";
  content: string;
  sources?: Array<{
    chunkId: string;
    documentId: string;
    title: string;
    sourcePath: string;
    score: number;
  }>;
};

export type ChatActionState = {
  messages: ChatMessage[];
  error: string | null;
};

export const initialChatState: ChatActionState = {
  messages: [
    {
      role: "assistant",
      content:
        "Hello. I am Bao's AI representative. Ask me about his experience, projects, skills, or working style, and I will answer only from the verified knowledge base.",
    },
  ],
  error: null,
};
