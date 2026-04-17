"use client";

import { useActionState, useEffect, useOptimistic, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

import { submitChatMessage } from "./chat-actions";
import { initialChatState, type ChatMessage } from "./chat-state";
import styles from "./page.module.css";

type ChatWidgetProps = {
  promptSuggestions: string[];
};

type UiMessage = ChatMessage & {
  pending?: boolean;
  localId?: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      aria-label="Send message"
      className={styles.sendButton}
      disabled={pending}
    >
      <svg
        className={styles.sendIcon}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          d="M4 11.5L20 4L14 20L11 13L4 11.5Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

export function ChatWidget({ promptSuggestions }: ChatWidgetProps) {
  const [state, formAction] = useActionState(submitChatMessage, initialChatState);
  const [question, setQuestion] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const messages = state?.messages ?? initialChatState.messages;
  const error = state?.error ?? null;
  const suggestions = promptSuggestions ?? [];
  const [optimisticMessages, addOptimisticMessages] = useOptimistic<UiMessage[], UiMessage[]>(
    messages,
    (currentState, optimisticValue) => [...currentState, ...optimisticValue],
  );

  useEffect(() => {
    messagesRef.current?.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [optimisticMessages.length, error]);

  return (
    <>
      <div className={styles.chatSidebar}>
        <div className={styles.liveBadge}>
          <span />
          <p>Live Interaction</p>
        </div>
        <h2>
          Meet My <br />
          Digital Twin
        </h2>
        <p>
          A custom-trained AI interface designed to answer your questions about work process,
          availability, and design philosophy in real time.
        </p>
        <div className={styles.chatPrompts}>
          {suggestions.map((suggestion) => (
            <button
              type="button"
              key={suggestion}
              className={styles.promptButton}
              onClick={() => {
                setQuestion(suggestion);
                const questionInput = formRef.current?.elements.namedItem("question") as
                  | HTMLInputElement
                  | null;
                questionInput?.focus();
              }}
            >
              <span>{suggestion}</span>
              <svg
                className={styles.promptArrow}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path d="M5 12H19" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                <path
                  d="M13 6L19 12L13 18"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.chatWindow}>
        <div className={styles.chatWindowHeader}>
          <div className={styles.chatIdentity}>
            <div className={styles.chatAvatar}>DC</div>
            <div>
              <p>Digital Curator AI</p>
              <span>Online / Interactive</span>
            </div>
          </div>
          <svg
            className={styles.moreIcon}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <circle cx="12" cy="5" r="1.5" fill="currentColor" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            <circle cx="12" cy="19" r="1.5" fill="currentColor" />
          </svg>
        </div>

        <div ref={messagesRef} className={styles.chatMessages}>
          {optimisticMessages.map((message, index) => (
            <div
              key={message.localId ?? `${message.role}-${index}-${message.content.slice(0, 24)}`}
              className={
                message.role === "assistant"
                  ? styles.chatMessageRow
                  : `${styles.chatMessageRow} ${styles.chatMessageUserRow}`
              }
            >
              {message.role === "assistant" ? (
                <div className={styles.robotBubble}>
                  <svg
                    className={styles.robotIcon}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden
                  >
                    <rect x="5" y="7" width="14" height="11" rx="3" stroke="currentColor" strokeWidth="1.7" />
                    <path d="M12 4V7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                    <circle cx="9.5" cy="12.5" r="1" fill="currentColor" />
                    <circle cx="14.5" cy="12.5" r="1" fill="currentColor" />
                    <path d="M9 15.5H15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                  </svg>
                </div>
              ) : null}

              <div
                className={
                  message.role === "assistant"
                    ? `${styles.chatBubble} ${message.pending ? styles.chatBubblePending : ""}`
                    : `${styles.chatBubble} ${styles.chatBubbleUser}`
                }
              >
                {message.pending ? (
                  <div className={styles.chatTyping}>
                    <span />
                    <span />
                    <span />
                  </div>
                ) : (
                  <p className={styles.chatText}>{message.content}</p>
                )}
                {message.role === "assistant" && !message.pending && message.sources?.length ? (
                  <div className={styles.chatSources}>
                    {message.sources.slice(0, 3).map((source) => (
                      <span key={source.chunkId} className={styles.chatSourceChip}>
                        {source.title}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          ))}

          {error ? <p className={styles.chatError}>{error}</p> : null}
        </div>

        <form
          ref={formRef}
          action={formAction}
          onSubmit={() => {
            const submittedQuestion = question.trim();

            if (!submittedQuestion) {
              return;
            }

            addOptimisticMessages([
              {
                role: "user",
                content: submittedQuestion,
                localId: `user-${Date.now()}`,
              },
              {
                role: "assistant",
                content: "",
                pending: true,
                localId: `assistant-${Date.now()}`,
              },
            ]);
            setQuestion("");
          }}
          className={styles.chatComposer}
        >
          <input
            name="question"
            type="text"
            placeholder="Type your query..."
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            autoComplete="off"
          />
          <SubmitButton />
        </form>
      </div>
    </>
  );
}
