export type KnowledgeDocumentType =
  | "profile"
  | "experience"
  | "project"
  | "skill"
  | "value"
  | "faq"
  | "other";

export type KnowledgeDocument = {
  id: string;
  type: KnowledgeDocumentType;
  title: string;
  rawText: string;
  normalizedText: string;
  tags: string[];
  sourcePath: string;
  checksum: string;
  lastUpdated: string;
  chunks: KnowledgeChunk[];
};

export type KnowledgeChunk = {
  id: string;
  documentId: string;
  chunkIndex: number;
  content: string;
  searchableText: string;
  checksum: string;
};

export type KnowledgeChunkRecord = {
  chunkId: string;
  documentId: string;
  chunkIndex: number;
  title: string;
  type: KnowledgeDocumentType;
  sourcePath: string;
  tags: string[];
  content: string;
  searchableText: string;
};
