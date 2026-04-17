import { env } from "@/config/env";
import { countOccurrences, normalizeWhitespace, tokenize } from "@/lib/string";

import type { KnowledgeChunkRecord } from "@/modules/knowledge/knowledge.types";
import type { KnowledgeRepository } from "@/modules/knowledge/knowledge.repository";

export type RetrievalResult = {
  chunk: KnowledgeChunkRecord;
  score: number;
};

export class RetrievalService {
  constructor(private readonly knowledgeRepository: KnowledgeRepository) {}

  async findRelevant(question: string, limit = env.CHAT_TOP_K): Promise<RetrievalResult[]> {
    const chunks = await this.knowledgeRepository.listChunkRecords();
    const tokens = Array.from(new Set(tokenize(question))).filter((token) => token.length > 1);
    const normalizedQuestion = normalizeWhitespace(question.toLowerCase());

    const scored = chunks
      .map((chunk) => {
        const title = chunk.title.toLowerCase();
        const content = chunk.content.toLowerCase();
        const tagSet = new Set(chunk.tags.map((tag) => tag.toLowerCase()));
        let score = 0;

        for (const token of tokens) {
          if (title.includes(token)) {
            score += 6;
          }

          if (tagSet.has(token)) {
            score += 5;
          }

          score += Math.min(countOccurrences(content, token), 3) * 2;
        }

        if (normalizedQuestion.length >= 8 && chunk.searchableText.toLowerCase().includes(normalizedQuestion)) {
          score += 8;
        }

        if (this.matchesIntent(normalizedQuestion, chunk.type)) {
          score += 5;
        }

        return { chunk, score };
      })
      .filter((entry) => entry.score > 0)
      .sort((left, right) => right.score - left.score)
      .slice(0, limit);

    return scored;
  }

  private matchesIntent(question: string, type: string) {
    const intentMatchers: Record<string, string[]> = {
      profile: ["who are you", "about you", "introduce yourself", "profile", "background"],
      experience: ["experience", "work history", "career", "employment"],
      project: ["project", "case study", "build", "portfolio"],
      skill: ["skill", "tech stack", "technology"],
      faq: ["availability", "how do you", "approach", "philosophy", "value"],
      other: ["value", "style", "goal", "direction"],
    };

    return (intentMatchers[type] ?? []).some((phrase) => question.includes(phrase));
  }
}
