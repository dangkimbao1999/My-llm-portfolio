import net from "node:net";

import { env } from "@/config/env";
import { logger } from "@/lib/logger";

type RedisResponse = string | null;

export class RedisCacheClient {
  isEnabled() {
    return env.ENABLE_REDIS_CACHE && Boolean(env.REDIS_URL);
  }

  async get(key: string) {
    if (!this.isEnabled()) {
      return null;
    }

    try {
      const [response] = await this.sendCommands([["GET", key]]);
      return response;
    } catch (error) {
      logger.warn("Redis GET failed. Falling back without exact cache.", error);
      return null;
    }
  }

  async set(key: string, value: string, ttlSeconds: number) {
    if (!this.isEnabled()) {
      return;
    }

    try {
      await this.sendCommands([["SET", key, value, "EX", String(ttlSeconds)]]);
    } catch (error) {
      logger.warn("Redis SET failed. Continuing without exact cache persistence.", error);
    }
  }

  async ping() {
    if (!this.isEnabled()) {
      return {
        enabled: false,
        ok: true,
        message: "Redis exact cache is disabled.",
      };
    }

    try {
      const [response] = await this.sendCommands([["PING"]]);
      return {
        enabled: true,
        ok: response === "PONG",
        message: response === "PONG" ? "Redis exact cache is healthy." : "Redis exact cache ping failed.",
      };
    } catch (error) {
      logger.warn("Redis ping failed.", error);
      return {
        enabled: true,
        ok: false,
        message: "Redis exact cache is unreachable.",
      };
    }
  }

  private async sendCommands(commands: string[][]): Promise<RedisResponse[]> {
    if (!env.REDIS_URL) {
      throw new Error("REDIS_URL is not configured.");
    }

    const redisUrl = new URL(env.REDIS_URL);
    const port = Number(redisUrl.port || 6379);
    const host = redisUrl.hostname;
    const authPassword = redisUrl.password ? decodeURIComponent(redisUrl.password) : null;
    const commandQueue = authPassword ? [["AUTH", authPassword], ...commands] : commands;

    return new Promise<RedisResponse[]>((resolve, reject) => {
      const socket = net.createConnection({ host, port });
      const responses: RedisResponse[] = [];
      let buffer = Buffer.alloc(0);
      let settled = false;

      const finish = (error?: Error) => {
        if (settled) {
          return;
        }

        settled = true;
        socket.destroy();

        if (error) {
          reject(error);
          return;
        }

        resolve(authPassword ? responses.slice(1) : responses);
      };

      socket.on("connect", () => {
        for (const command of commandQueue) {
          socket.write(this.encodeCommand(command));
        }
      });

      socket.on("data", (chunk) => {
        buffer = Buffer.concat([buffer, chunk]);

        while (responses.length < commandQueue.length) {
          const parsed = this.parseResponse(buffer);

          if (!parsed) {
            break;
          }

          buffer = buffer.subarray(parsed.consumed);

          if (parsed.error) {
            finish(new Error(parsed.error));
            return;
          }

          responses.push(parsed.value);
        }

        if (responses.length === commandQueue.length) {
          finish();
        }
      });

      socket.on("error", (error) => finish(error));
      socket.on("end", () => {
        if (!settled && responses.length < commandQueue.length) {
          finish(new Error("Redis connection closed before full response was received."));
        }
      });
    });
  }

  private encodeCommand(parts: string[]) {
    const chunks = [`*${parts.length}\r\n`];

    for (const part of parts) {
      chunks.push(`$${Buffer.byteLength(part, "utf8")}\r\n${part}\r\n`);
    }

    return chunks.join("");
  }

  private parseResponse(buffer: Buffer):
    | {
        consumed: number;
        value: RedisResponse;
        error?: string;
      }
    | null {
    if (buffer.length < 3) {
      return null;
    }

    const prefix = String.fromCharCode(buffer[0]);
    const lineEnd = buffer.indexOf("\r\n");

    if (lineEnd === -1) {
      return null;
    }

    if (prefix === "+" || prefix === "-" || prefix === ":") {
      const value = buffer.subarray(1, lineEnd).toString("utf8");
      return {
        consumed: lineEnd + 2,
        value,
        error: prefix === "-" ? value : undefined,
      };
    }

    if (prefix === "$") {
      const length = Number(buffer.subarray(1, lineEnd).toString("utf8"));

      if (Number.isNaN(length)) {
        return {
          consumed: lineEnd + 2,
          value: null,
          error: "Redis returned an invalid bulk string length.",
        };
      }

      if (length === -1) {
        return {
          consumed: lineEnd + 2,
          value: null,
        };
      }

      const totalLength = lineEnd + 2 + length + 2;

      if (buffer.length < totalLength) {
        return null;
      }

      return {
        consumed: totalLength,
        value: buffer.subarray(lineEnd + 2, lineEnd + 2 + length).toString("utf8"),
      };
    }

    return {
      consumed: buffer.length,
      value: null,
      error: `Unsupported Redis response prefix: ${prefix}`,
    };
  }
}
