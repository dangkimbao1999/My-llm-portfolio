type SessionMessage = {
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

export type ChatSession = {
  id: string;
  messages: SessionMessage[];
  updatedAt: string;
};

export class SessionRepository {
  private sessions = new Map<string, ChatSession>();

  getById(sessionId: string) {
    return this.sessions.get(sessionId) ?? null;
  }

  append(sessionId: string, message: SessionMessage) {
    const existing = this.getById(sessionId);
    const messages = [...(existing?.messages ?? []), message].slice(-10);
    const session: ChatSession = {
      id: sessionId,
      messages,
      updatedAt: new Date().toISOString(),
    };

    this.sessions.set(sessionId, session);

    return session;
  }

  clear(sessionId: string) {
    this.sessions.delete(sessionId);
  }
}

