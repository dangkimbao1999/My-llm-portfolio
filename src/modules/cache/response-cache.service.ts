import { env } from "@/config/env";
import { logger } from "@/lib/logger";

import { buildExactCacheKey } from "./cache.utils";
import { RedisCacheClient } from "./redis-cache.client";
import { ResponseCacheRepository } from "./response-cache.repository";
import type { CachedAnswer, CacheLookupResult } from "./cache.types";

export class ResponseCacheService {
  constructor(
    private readonly redisCacheClient: RedisCacheClient,
    private readonly responseCacheRepository: ResponseCacheRepository,
  ) {}

  async getExact(question: string, retrievalSignature: string, model: string): Promise<CacheLookupResult | null> {
    const key = buildExactCacheKey(question, retrievalSignature, model);
    const cached = await this.redisCacheClient.get(key);

    if (!cached) {
      return null;
    }

    try {
      const value = JSON.parse(cached) as CachedAnswer;
      return {
        layer: "redis-exact",
        value,
      };
    } catch (error) {
      logger.warn("Redis exact cache payload was malformed. Ignoring cached entry.", error);
      return null;
    }
  }

  async getSimilar(normalizedQuestion: string, retrievalSignature: string) {
    return this.responseCacheRepository.findSimilar(normalizedQuestion, retrievalSignature);
  }

  async store(question: string, retrievalSignature: string, promptSignature: string, value: CachedAnswer) {
    const exactKey = buildExactCacheKey(question, retrievalSignature, value.model);

    const results = await Promise.allSettled([
      this.redisCacheClient.set(exactKey, JSON.stringify(value), env.EXACT_CACHE_TTL_SECONDS),
      this.responseCacheRepository.upsert(question, retrievalSignature, promptSignature, value),
    ]);

    for (const result of results) {
      if (result.status === "rejected") {
        logger.warn("Cache store failed. Continuing without blocking chat response.", result.reason);
      }
    }
  }

  async ping() {
    return this.redisCacheClient.ping();
  }
}
