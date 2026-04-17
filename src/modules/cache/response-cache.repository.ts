import { env } from "@/config/env";
import { sha256 } from "@/lib/hash";
import { logger } from "@/lib/logger";
import { DatabaseClient } from "@/modules/db/db.client";

import type { CachedAnswer, CacheLookupResult, CachedSource } from "./cache.types";

type DbCacheRow = {
  id: string;
  answer: string;
  model: string;
  sources: CachedSource[];
  topScore: number;
  contextCount: number;
  similarityScore?: number;
};

export class ResponseCacheRepository {
  constructor(private readonly databaseClient: DatabaseClient) {}

  async findSimilar(normalizedQuestion: string, retrievalSignature: string): Promise<CacheLookupResult | null> {
    const result = await this.databaseClient.query<DbCacheRow>(
      `
        select
          id::text,
          answer,
          model,
          sources,
          top_score as "topScore",
          context_count as "contextCount",
          similarity(normalized_question, $1) as "similarityScore"
        from chat_response_cache
        where
          retrieval_signature = $2
          and normalized_question % $1
          and similarity(normalized_question, $1) >= $3
          and updated_at >= now() - ($4::int * interval '1 day')
        order by "similarityScore" desc, last_hit_at desc
        limit 1
      `,
      [
        normalizedQuestion,
        retrievalSignature,
        env.SIMILAR_CACHE_THRESHOLD,
        env.SIMILAR_CACHE_MAX_AGE_DAYS,
      ],
    );

    const row = result.rows[0];

    if (!row) {
      return null;
    }

    await this.databaseClient
      .query(
        `
          update chat_response_cache
          set
            hit_count = hit_count + 1,
            last_hit_at = now(),
            updated_at = now()
          where id = $1::bigint
        `,
        [row.id],
      )
      .catch((error) => {
        logger.warn("Failed to update similarity cache hit counters.", error);
      });

    return {
      layer: "postgres-similarity",
      similarityScore: Number(row.similarityScore ?? 0),
      value: {
        answer: row.answer,
        model: row.model,
        sources: row.sources,
        topScore: row.topScore,
        contextCount: row.contextCount,
      },
    };
  }

  async upsert(
    normalizedQuestion: string,
    retrievalSignature: string,
    promptSignature: string,
    value: CachedAnswer,
  ) {
    const questionHash = sha256(normalizedQuestion);

    await this.databaseClient.query(
      `
        insert into chat_response_cache (
          question_hash,
          normalized_question,
          retrieval_signature,
          prompt_signature,
          answer,
          model,
          sources,
          top_score,
          context_count,
          updated_at,
          last_hit_at,
          hit_count
        )
        values ($1, $2, $3, $4, $5, $6, $7::jsonb, $8, $9, now(), now(), 1)
        on conflict (question_hash, retrieval_signature)
        do update set
          prompt_signature = excluded.prompt_signature,
          answer = excluded.answer,
          model = excluded.model,
          sources = excluded.sources,
          top_score = excluded.top_score,
          context_count = excluded.context_count,
          updated_at = now(),
          last_hit_at = now(),
          hit_count = chat_response_cache.hit_count + 1
      `,
      [
        questionHash,
        normalizedQuestion,
        retrievalSignature,
        promptSignature,
        value.answer,
        value.model,
        JSON.stringify(value.sources),
        value.topScore,
        value.contextCount,
      ],
    );
  }
}
