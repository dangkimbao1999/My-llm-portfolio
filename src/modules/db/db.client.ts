import { readFile } from "node:fs/promises";
import path from "node:path";

import { Pool, type PoolClient, type QueryResult, type QueryResultRow } from "pg";

import { env } from "@/config/env";
import { AppError } from "@/lib/errors";
import { logger } from "@/lib/logger";

export class DatabaseClient {
  private pool: Pool | null = null;
  private schemaPromise: Promise<void> | null = null;

  isEnabled() {
    return env.ENABLE_DB && Boolean(env.DATABASE_URL);
  }

  private getPool() {
    if (!this.isEnabled() || !env.DATABASE_URL) {
      throw new AppError(
        "Database is not configured. Set DATABASE_URL and ENABLE_DB=true.",
        503,
        "DATABASE_NOT_CONFIGURED",
      );
    }

    if (!this.pool) {
      this.pool = new Pool({
        connectionString: env.DATABASE_URL,
        max: 5,
      });
    }

    return this.pool;
  }

  async connect(): Promise<PoolClient> {
    return this.getPool().connect();
  }

  async query<T extends QueryResultRow = QueryResultRow>(
    text: string,
    values?: unknown[],
    client?: PoolClient,
  ): Promise<QueryResult<T>> {
    if (client) {
      return client.query<T>(text, values);
    }

    return this.getPool().query<T>(text, values);
  }

  async transaction<T>(handler: (client: PoolClient) => Promise<T>) {
    const client = await this.connect();

    try {
      await client.query("begin");
      const result = await handler(client);
      await client.query("commit");

      return result;
    } catch (error) {
      await client.query("rollback");
      throw error;
    } finally {
      client.release();
    }
  }

  async ensureSchema() {
    if (!this.schemaPromise) {
      this.schemaPromise = this.applySchema().catch((error) => {
        this.schemaPromise = null;
        throw error;
      });
    }

    return this.schemaPromise;
  }

  private async applySchema() {
    const schemaPath = path.join(process.cwd(), "db", "schema.sql");
    const sql = await readFile(schemaPath, "utf8").catch((error) => {
      throw new AppError(
        `Unable to read database schema file at ${schemaPath}.`,
        500,
        "DATABASE_SCHEMA_MISSING",
        error,
      );
    });

    await this.query(sql);
  }

  async ping() {
    if (!this.isEnabled()) {
      return {
        enabled: false,
        ok: false,
        message: "Database is not configured.",
      };
    }

    try {
      await this.query("select 1");
      await this.ensureSchema();

      return {
        enabled: true,
        ok: true,
        message: "Database connection is healthy.",
      };
    } catch (error) {
      logger.error("Database ping failed.", error);

      return {
        enabled: true,
        ok: false,
        message: "Database connection failed.",
      };
    }
  }
}
