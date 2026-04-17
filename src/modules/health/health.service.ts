import type { DatabaseClient } from "@/modules/db/db.client";
import type { ResponseCacheService } from "@/modules/cache/response-cache.service";
import type { KnowledgeRepository } from "@/modules/knowledge/knowledge.repository";
import type { LlmClient } from "@/modules/llm/llm.client";

export class HealthService {
  constructor(
    private readonly databaseClient: DatabaseClient,
    private readonly knowledgeRepository: KnowledgeRepository,
    private readonly llmClient: LlmClient,
    private readonly responseCacheService: ResponseCacheService,
  ) {}

  async getStatus() {
    const database = await this.databaseClient.ping();
    const cache = await this.responseCacheService.ping();

    if (!database.ok) {
      return {
        ok: false,
        service: "portfolio-ai-backend",
        timestamp: new Date().toISOString(),
        database,
        cache,
        knowledge: {
          documentCount: 0,
          chunkCount: 0,
        },
        llm: {
          enabled: this.llmClient.isEnabled(),
          model: this.llmClient.isEnabled() ? "configured" : "not-configured",
        },
      };
    }

    const knowledge = await this.knowledgeRepository.getStats();

    return {
      ok: true,
      service: "portfolio-ai-backend",
      timestamp: new Date().toISOString(),
      database,
      cache,
      knowledge,
      llm: {
        enabled: this.llmClient.isEnabled(),
      },
    };
  }
}
