import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

import { AppError } from "@/lib/errors";
import { sha256 } from "@/lib/hash";
import { logger } from "@/lib/logger";
import { normalizeWhitespace } from "@/lib/string";
import { DatabaseClient } from "@/modules/db/db.client";

import type { KnowledgeChunk, KnowledgeChunkRecord, KnowledgeDocument, KnowledgeDocumentType } from "./knowledge.types";

const KNOWLEDGE_ROOT = path.join(process.cwd(), "content", "knowledge");
const CHUNK_MAX_LENGTH = 700;

type DbKnowledgeDocumentRow = {
  id: string;
  type: KnowledgeDocumentType;
  title: string;
  sourcePath: string;
  tags: string[];
  checksum: string;
  lastUpdated: string;
};

type DbKnowledgeChunkRow = {
  chunkId: string;
  documentId: string;
  chunkIndex: number;
  title: string;
  type: KnowledgeDocumentType;
  sourcePath: string;
  tags: string[];
  content: string;
  searchableText: string;
  checksum: string;
};

export class KnowledgeRepository {
  private readyPromise: Promise<{ documents: number; chunks: number; refreshedAt: string }> | null = null;

  constructor(private readonly databaseClient: DatabaseClient) {}

  async listDocuments() {
    await this.ensureReady();

    const result = await this.databaseClient.query<DbKnowledgeDocumentRow>(
      `
        select
          id,
          type,
          title,
          source_path as "sourcePath",
          tags,
          checksum,
          last_updated as "lastUpdated"
        from knowledge_documents
        order by source_path asc
      `,
    );

    return result.rows;
  }

  async refresh() {
    this.readyPromise = null;

    return this.ensureReady();
  }

  async ensureReady() {
    if (!this.readyPromise) {
      this.readyPromise = this.syncFromFiles().catch((error) => {
        this.readyPromise = null;
        throw error;
      });
    }

    return this.readyPromise;
  }

  async listChunkRecords(): Promise<KnowledgeChunkRecord[]> {
    await this.ensureReady();

    const result = await this.databaseClient.query<DbKnowledgeChunkRow>(
      `
        select
          c.id as "chunkId",
          c.document_id as "documentId",
          c.chunk_index as "chunkIndex",
          d.title,
          d.type,
          d.source_path as "sourcePath",
          d.tags,
          c.content,
          c.searchable_text as "searchableText",
          c.checksum
        from knowledge_chunks c
        inner join knowledge_documents d on d.id = c.document_id
        order by d.source_path asc, c.chunk_index asc
      `,
    );

    return result.rows;
  }

  async getStats() {
    await this.ensureReady();

    const result = await this.databaseClient.query<{
      documentCount: string;
      chunkCount: string;
    }>(
      `
        select
          (select count(*) from knowledge_documents)::text as "documentCount",
          (select count(*) from knowledge_chunks)::text as "chunkCount"
      `,
    );

    const row = result.rows[0];

    return {
      documentCount: Number(row?.documentCount ?? 0),
      chunkCount: Number(row?.chunkCount ?? 0),
      root: KNOWLEDGE_ROOT,
    };
  }

  private async syncFromFiles() {
    await this.databaseClient.ensureSchema();
    const documents = await this.loadDocuments();

    await this.databaseClient.transaction(async (client) => {
      await this.databaseClient.query("truncate table knowledge_documents cascade", undefined, client);

      for (const document of documents) {
        await this.databaseClient.query(
          `
            insert into knowledge_documents (
              id,
              type,
              title,
              source_path,
              raw_text,
              normalized_text,
              tags,
              checksum,
              last_updated
            )
            values ($1, $2, $3, $4, $5, $6, $7::text[], $8, $9::timestamptz)
          `,
          [
            document.id,
            document.type,
            document.title,
            document.sourcePath,
            document.rawText,
            document.normalizedText,
            document.tags,
            document.checksum,
            document.lastUpdated,
          ],
          client,
        );

        for (const chunk of document.chunks) {
          await this.databaseClient.query(
            `
              insert into knowledge_chunks (
                id,
                document_id,
                chunk_index,
                content,
                searchable_text,
                checksum
              )
              values ($1, $2, $3, $4, $5, $6)
            `,
            [
              chunk.id,
              chunk.documentId,
              chunk.chunkIndex,
              chunk.content,
              chunk.searchableText,
              chunk.checksum,
            ],
            client,
          );
        }
      }
    });

    logger.info("Knowledge base synced into PostgreSQL.", {
      documents: documents.length,
      chunks: documents.reduce((total, document) => total + document.chunks.length, 0),
    });

    return {
      documents: documents.length,
      chunks: documents.reduce((total, document) => total + document.chunks.length, 0),
      refreshedAt: new Date().toISOString(),
    };
  }

  private async loadDocuments(): Promise<KnowledgeDocument[]> {
    try {
      return await this.walkDirectory(KNOWLEDGE_ROOT);
    } catch (error) {
      throw new AppError(
        "Knowledge repository load failed. Check your content files.",
        500,
        "KNOWLEDGE_LOAD_FAILED",
        error,
      );
    }
  }

  private async walkDirectory(directory: string): Promise<KnowledgeDocument[]> {
    const entries = await readdir(directory, { withFileTypes: true });
    const documents: KnowledgeDocument[] = [];

    for (const entry of entries) {
      const absolutePath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        documents.push(...(await this.walkDirectory(absolutePath)));
        continue;
      }

      if (!entry.isFile()) {
        continue;
      }

      if (!absolutePath.endsWith(".md") && !absolutePath.endsWith(".json")) {
        continue;
      }

      documents.push(await this.toDocument(absolutePath));
    }

    return documents;
  }

  private async toDocument(absolutePath: string): Promise<KnowledgeDocument> {
    const fileStat = await stat(absolutePath);
    const relativePath = path.relative(KNOWLEDGE_ROOT, absolutePath);
    const parsedPath = path.parse(relativePath);
    const folderName = parsedPath.dir.split(path.sep)[0] ?? "";
    const type = this.resolveType(folderName, parsedPath.name);
    const raw = await readFile(absolutePath, "utf8");
    const normalizedText = absolutePath.endsWith(".json")
      ? this.normalizeJsonDocument(raw, relativePath)
      : this.normalizeMarkdownDocument(raw);
    const title = absolutePath.endsWith(".md")
      ? this.extractMarkdownTitle(raw) ?? parsedPath.name.replace(/[-_]/g, " ")
      : parsedPath.name.replace(/[-_]/g, " ");
    const tags = [type, folderName, parsedPath.name.replace(/[-_]/g, " ").toLowerCase()].filter(Boolean);
    const chunks = this.chunkDocument(relativePath.replaceAll(path.sep, "/"), title, normalizedText, tags);

    if (chunks.length === 0) {
      throw new AppError(
        `Knowledge file ${relativePath} does not contain usable content.`,
        500,
        "KNOWLEDGE_DOCUMENT_EMPTY",
      );
    }

    return {
      id: relativePath.replaceAll(path.sep, "/"),
      type,
      title,
      rawText: raw,
      normalizedText,
      tags,
      sourcePath: relativePath.replaceAll(path.sep, "/"),
      checksum: sha256(normalizedText),
      lastUpdated: fileStat.mtime.toISOString(),
      chunks,
    };
  }

  private resolveType(folderName: string, fileName: string): KnowledgeDocumentType {
    if (folderName === "experience") {
      return "experience";
    }

    if (folderName === "projects") {
      return "project";
    }

    if (fileName === "profile") {
      return "profile";
    }

    if (fileName === "faq") {
      return "faq";
    }

    return "other";
  }

  private normalizeJsonDocument(raw: string, relativePath: string) {
    let parsed: unknown;

    try {
      parsed = JSON.parse(raw) as unknown;
    } catch (error) {
      throw new AppError(
        `Knowledge JSON file ${relativePath} is malformed.`,
        500,
        "MALFORMED_KNOWLEDGE_DATA",
        error,
      );
    }

    if (!parsed || typeof parsed !== "object") {
      throw new AppError(
        `Knowledge JSON file ${relativePath} must contain an object.`,
        500,
        "MALFORMED_KNOWLEDGE_DATA",
      );
    }

    const lines = this.flattenJson(parsed);
    return normalizeWhitespace(lines.join("\n"));
  }

  private flattenJson(value: unknown, pathParts: string[] = []): string[] {
    if (value === null || value === undefined) {
      return [];
    }

    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      return [`${pathParts.join(" > ")}: ${String(value)}`];
    }

    if (Array.isArray(value)) {
      const primitiveOnly = value.every(
        (entry) => typeof entry === "string" || typeof entry === "number" || typeof entry === "boolean",
      );

      if (primitiveOnly) {
        return [`${pathParts.join(" > ")}: ${value.map((entry) => String(entry)).join(", ")}`];
      }

      return value.flatMap((entry, index) => this.flattenJson(entry, [...pathParts, String(index + 1)]));
    }

    if (typeof value === "object") {
      return Object.entries(value).flatMap(([key, entry]) =>
        this.flattenJson(entry, [...pathParts, key.replace(/[_-]/g, " ")]),
      );
    }

    return [];
  }

  private normalizeMarkdownDocument(raw: string) {
    return normalizeWhitespace(
      raw
        .replace(/\r\n/g, "\n")
        .replace(/^#{1,6}\s*/gm, "")
        .replace(/^\s*[-*]\s+/gm, "- "),
    );
  }

  private extractMarkdownTitle(raw: string) {
    const titleMatch = raw.match(/^#\s+(.+)$/m);
    return titleMatch?.[1]?.trim() || null;
  }

  private chunkDocument(documentId: string, title: string, text: string, tags: string[]): KnowledgeChunk[] {
    const blocks = text
      .split(/\n{2,}/)
      .map((block) => normalizeWhitespace(block))
      .filter(Boolean);
    const chunks: KnowledgeChunk[] = [];
    let buffer = "";
    let chunkIndex = 0;

    const flush = () => {
      const content = normalizeWhitespace(buffer);

      if (!content) {
        buffer = "";
        return;
      }

      const searchableText = normalizeWhitespace([title, tags.join(" "), content].join("\n"));
      chunks.push({
        id: `${documentId}::${chunkIndex}`,
        documentId,
        chunkIndex,
        content,
        searchableText,
        checksum: sha256(searchableText),
      });

      chunkIndex += 1;
      buffer = "";
    };

    for (const block of blocks) {
      if (!buffer) {
        buffer = block;
        continue;
      }

      if (`${buffer}\n\n${block}`.length <= CHUNK_MAX_LENGTH) {
        buffer = `${buffer}\n\n${block}`;
        continue;
      }

      flush();

      if (block.length <= CHUNK_MAX_LENGTH) {
        buffer = block;
        continue;
      }

      for (let start = 0; start < block.length; start += CHUNK_MAX_LENGTH) {
        buffer = block.slice(start, start + CHUNK_MAX_LENGTH);
        flush();
      }
    }

    flush();

    return chunks;
  }
}
