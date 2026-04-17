import type { DatabaseClient } from "@/modules/db/db.client";
import type { KnowledgeRepository } from "@/modules/knowledge/knowledge.repository";
import type { LlmClient } from "@/modules/llm/llm.client";

export class HealthService {
  constructor(
    private readonly databaseClient: DatabaseClient,
    private readonly knowledgeRepository: KnowledgeRepository,
    private readonly llmClient: LlmClient,
  ) {}

  async getStatus() {
    const database = await this.databaseClient.ping();

    if (!database.ok) {
      return {
        ok: false,
        service: "portfolio-ai-backend",
        timestamp: new Date().toISOString(),
        database,
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
      knowledge,
      llm: {
        enabled: this.llmClient.isEnabled(),
      },
    };
  }
}
