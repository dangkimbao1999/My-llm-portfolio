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

export const container = {
  databaseClient,
  knowledgeRepository,
  retrievalService,
  llmClient,
  promptBuilder,
  chatService: new ChatService(knowledgeRepository, retrievalService, promptBuilder, llmClient),
  healthService: new HealthService(databaseClient, knowledgeRepository, llmClient),
  adminService: new AdminService(knowledgeRepository),
};
