export type ChatRequest = {
  question: string;
  topK?: number;
};

export type ChatResponse = {
  answer: string;
  fallback: boolean;
  sources: Array<{
    chunkId: string;
    documentId: string;
    title: string;
    sourcePath: string;
    score: number;
  }>;
  meta: {
    model: string | null;
    topScore: number;
    contextCount: number;
  };
};
