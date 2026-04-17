import { env } from "@/config/env";
import { buildPromptSignature, buildRetrievalSignature, normalizeCacheQuestion } from "@/modules/cache/cache.utils";
import { logger } from "@/lib/logger";
import { ResponseCacheService } from "@/modules/cache/response-cache.service";
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
    private readonly responseCacheService: ResponseCacheService,
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
          cache: {
            hit: false,
            layer: "none",
          },
        },
      };
    }

    const retrievalSignature = buildRetrievalSignature(retrievalResults);
    const normalizedQuestion = normalizeCacheQuestion(input.question);
    const exactCacheHit = await this.responseCacheService.getExact(
      normalizedQuestion,
      retrievalSignature,
      env.LLM_MODEL,
    );

    if (exactCacheHit) {
      logger.info("Chat request served from exact Redis cache.", {
        question: input.question,
        retrievalSignature,
      });

      return {
        answer: exactCacheHit.value.answer,
        fallback: false,
        sources: exactCacheHit.value.sources,
        meta: {
          model: exactCacheHit.value.model,
          topScore: exactCacheHit.value.topScore,
          contextCount: exactCacheHit.value.contextCount,
          cache: {
            hit: true,
            layer: exactCacheHit.layer,
          },
        },
      };
    }

    const similarityCacheHit = await this.responseCacheService.getSimilar(
      normalizedQuestion,
      retrievalSignature,
    );

    if (similarityCacheHit) {
      logger.info("Chat request served from similarity cache.", {
        question: input.question,
        retrievalSignature,
        similarityScore: similarityCacheHit.similarityScore,
      });

      await this.responseCacheService.store(normalizedQuestion, retrievalSignature, "similarity-hit", similarityCacheHit.value);

      return {
        answer: similarityCacheHit.value.answer,
        fallback: false,
        sources: similarityCacheHit.value.sources,
        meta: {
          model: similarityCacheHit.value.model,
          topScore: similarityCacheHit.value.topScore,
          contextCount: similarityCacheHit.value.contextCount,
          cache: {
            hit: true,
            layer: similarityCacheHit.layer,
            similarityScore: similarityCacheHit.similarityScore,
          },
        },
      };
    }

    const prompt = this.promptBuilder.build(input.question, retrievalResults);
    const promptSignature = buildPromptSignature(prompt.systemPrompt, prompt.userPrompt);
    const generation = await this.llmClient.generateAnswer(prompt);
    const sources = retrievalResults.map((entry) => ({
      chunkId: entry.chunk.chunkId,
      documentId: entry.chunk.documentId,
      title: entry.chunk.title,
      sourcePath: entry.chunk.sourcePath,
      score: entry.score,
    }));

    logger.debug("Chat request completed.", {
      sources: retrievalResults.map((entry) => entry.chunk.documentId),
      model: generation.model,
    });

    await this.responseCacheService.store(normalizedQuestion, retrievalSignature, promptSignature, {
      answer: generation.answer,
      model: generation.model,
      sources,
      topScore,
      contextCount: retrievalResults.length,
    });

    return {
      answer: generation.answer,
      fallback: false,
      sources,
      meta: {
        model: generation.model,
        topScore,
        contextCount: retrievalResults.length,
        cache: {
          hit: false,
          layer: "none",
        },
      },
    };
  }
}
