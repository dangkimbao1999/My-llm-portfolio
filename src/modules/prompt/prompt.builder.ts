import type { RetrievalResult } from "@/modules/retrieval/retrieval.service";

export type BuiltPrompt = {
  systemPrompt: string;
  userPrompt: string;
};

export class PromptBuilder {
  build(question: string, retrievalResults: RetrievalResult[]): BuiltPrompt {
    const contextText = retrievalResults
      .map(
        (entry, index) =>
          `Context ${index + 1}\nTitle: ${entry.chunk.title}\nType: ${entry.chunk.type}\nSource: ${entry.chunk.sourcePath}\nContent:\n${entry.chunk.content}`,
      )
      .join("\n\n---\n\n");

    return {
      systemPrompt: [
        "You are an AI representative for a personal portfolio website.",
        "Answer only from the verified context provided.",
        "Do not fabricate employers, dates, project scope, metrics, skills, availability, salary, contact information, or personal facts.",
        "If the context is missing or insufficient, say: \"I don't have enough verified information in the current knowledge base to answer that accurately.\"",
        "If the context only partially supports the answer, state the supported part and clearly note what is unknown.",
        "Keep the answer concise, factual, and professional.",
      ].join(" "),
      userPrompt: `Verified context:\n${contextText}\n\nUser question:\n${question}`,
    };
  }
}

