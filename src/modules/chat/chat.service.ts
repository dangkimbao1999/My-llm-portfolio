import { env } from "@/config/env";
import { logger } from "@/lib/logger";
import { KnowledgeRepository } from "@/modules/knowledge/knowledge.repository";
import type { LlmClient } from "@/modules/llm/llm.client";
import { PromptBuilder } from "@/modules/prompt/prompt.builder";
import type { RetrievalService } from "@/modules/retrieval/retrieval.service";

import type { ChatRequest, ChatResponse } from "./chat.types";

const INSUFFICIENT_CONTEXT_MESSAGE =
  "I don't have enough verified information in the current knowledge base to answer that accurately.";

export class ChatService {
  constructor(
    private readonly knowledgeRepository: KnowledgeRepository,
    private readonly retrievalService: RetrievalService,
    private readonly promptBuilder: PromptBuilder,
    private readonly llmClient: LlmClient,
  ) {}

  async ask(input: ChatRequest): Promise<ChatResponse> {
    await this.knowledgeRepository.ensureReady();
    const retrievalResults = await this.retrievalService.findRelevant(
      input.question,
      input.topK ?? env.CHAT_TOP_K,
    );
    const topScore = retrievalResults[0]?.score ?? 0;

    if (retrievalResults.length === 0 || topScore < env.RETRIEVAL_MIN_SCORE) {
      logger.info("Chat request returned fallback due to weak context.", {
        topScore,
        question: input.question,
      });

      return {
        answer: INSUFFICIENT_CONTEXT_MESSAGE,
        fallback: true,
        sources: [],
        meta: {
          model: null,
          topScore,
          contextCount: retrievalResults.length,
        },
      };
    }

    const prompt = this.promptBuilder.build(input.question, retrievalResults);
    const generation = await this.llmClient.generateAnswer(prompt);

    logger.debug("Chat request completed.", {
      sources: retrievalResults.map((entry) => entry.chunk.documentId),
      model: generation.model,
    });

    return {
      answer: generation.answer,
      fallback: false,
      sources: retrievalResults.map((entry) => ({
        chunkId: entry.chunk.chunkId,
        documentId: entry.chunk.documentId,
        title: entry.chunk.title,
        sourcePath: entry.chunk.sourcePath,
        score: entry.score,
      })),
      meta: {
        model: generation.model,
        topScore,
        contextCount: retrievalResults.length,
      },
    };
  }
}
