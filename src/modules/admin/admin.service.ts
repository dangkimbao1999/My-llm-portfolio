import type { KnowledgeRepository } from "@/modules/knowledge/knowledge.repository";

export class AdminService {
  constructor(private readonly knowledgeRepository: KnowledgeRepository) {}

  async syncKnowledgeBase() {
    return this.knowledgeRepository.refresh();
  }
}

