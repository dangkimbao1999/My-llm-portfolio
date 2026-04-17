import { sha256 } from "@/lib/hash";
import { normalizeWhitespace } from "@/lib/string";
import type { RetrievalResult } from "@/modules/retrieval/retrieval.service";

export function normalizeCacheQuestion(question: string) {
  return normalizeWhitespace(question.toLowerCase());
}

export function buildRetrievalSignature(results: RetrievalResult[]) {
  const signatureBase = results
    .map((entry) => `${entry.chunk.chunkId}:${entry.chunk.checksum}:${entry.score}`)
    .join("|");

  return sha256(signatureBase);
}

export function buildPromptSignature(systemPrompt: string, userPrompt: string) {
  return sha256(`${systemPrompt}\n---\n${userPrompt}`);
}

export function buildExactCacheKey(question: string, retrievalSignature: string, model: string) {
  const normalizedQuestion = normalizeCacheQuestion(question);
  return `chat:exact:${model}:${retrievalSignature}:${sha256(normalizedQuestion)}`;
}

