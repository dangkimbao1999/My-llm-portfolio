import { ResponseCacheRepository } from "@/modules/cache/response-cache.repository";
import { ResponseCacheService } from "@/modules/cache/response-cache.service";
import { RedisCacheClient } from "@/modules/cache/redis-cache.client";
import { PromptBuilder } from "@/modules/prompt/prompt.builder";
import { ChatService } from "@/modules/chat/chat.service";
import { DatabaseClient } from "@/modules/db/db.client";
import { HealthService } from "@/modules/health/health.service";
import { KnowledgeRepository } from "@/modules/knowledge/knowledge.repository";
import { LlmClient } from "@/modules/llm/llm.client";
import { AdminService } from "@/modules/admin/admin.service";
import { RetrievalService } from "@/modules/retrieval/retrieval.service";

const databaseClient = new DatabaseClient();
const knowledgeRepository = new KnowledgeRepository(databaseClient);
const retrievalService = new RetrievalService(knowledgeRepository);
const llmClient = new LlmClient();
const promptBuilder = new PromptBuilder();
const redisCacheClient = new RedisCacheClient();
const responseCacheRepository = new ResponseCacheRepository(databaseClient);
const responseCacheService = new ResponseCacheService(redisCacheClient, responseCacheRepository);

export const container = {
  databaseClient,
  knowledgeRepository,
  retrievalService,
  llmClient,
  promptBuilder,
  redisCacheClient,
  responseCacheRepository,
  responseCacheService,
  chatService: new ChatService(
    knowledgeRepository,
    retrievalService,
    promptBuilder,
    llmClient,
    responseCacheService,
  ),
  healthService: new HealthService(databaseClient, knowledgeRepository, llmClient, responseCacheService),
  adminService: new AdminService(knowledgeRepository),
};
