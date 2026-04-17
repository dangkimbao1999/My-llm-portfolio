export type CachedSource = {
  chunkId: string;
  documentId: string;
  title: string;
  sourcePath: string;
  score: number;
};

export type CachedAnswer = {
  answer: string;
  model: string;
  sources: CachedSource[];
  topScore: number;
  contextCount: number;
};

export type CacheLookupResult = {
  layer: "redis-exact" | "postgres-similarity";
  similarityScore?: number;
  value: CachedAnswer;
};

