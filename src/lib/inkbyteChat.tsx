import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import { ChatContext, type ChatMessage, type ChatState, type Mood } from "./inkbyteChatContext";
import { CHAT_LIMITS, INKBYTE_GREETING, SHY_TOPICS, offlineAnswer } from "../data/inkbyte";



type Outcome = { kind: "reply"; text: string } | { kind: "offline" } | { kind: "error"; message: string };

/** The one place that talks to the chat endpoint, used by every Inkbyte entry point. */
async function askInkbyte(history: ChatMessage[]): Promise<Outcome> {
  const messages = history
    .filter((message) => !message.failed && message.id !== 0)
    .slice(-(CHAT_LIMITS.maxHistory + 1))
    .map(({ role, text }) => ({ role, content: text }));
  // The endpoint wants the conversation to open with the visitor.
  while (messages.length && messages[0].role !== "user") messages.shift();
  try {
    const response = await fetch("/api/inkbyte", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ messages }),
    });
    const data = (await response.json().catch(() => ({}))) as { reply?: string; error?: string };
    if (response.ok && data.reply) return { kind: "reply", text: data.reply };
    if (response.status === 503 || response.status === 404) return { kind: "offline" };
    if (response.status === 429)
      return { kind: "error", message: "Whoa, too many questions at once. My arms are tangled. Give me a minute and try again." };
    return { kind: "error", message: "My ink got smudged and that reply didn't come through." };
  } catch {
    return { kind: "offline" };
  }
}

export function InkbyteChatProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([{ id: 0, role: "assistant", text: INKBYTE_GREETING }]);
  const [pending, setPending] = useState(false);
  const [mode, setMode] = useState<ChatState["mode"]>("unknown");
  const [mood, setMood] = useState<Mood>("idle");
  const [beat, setBeat] = useState(0);
  const nextId = useRef(1);
  const pendingRef = useRef(false);
  const latest = useRef(messages);
  latest.current = messages;

  const react = useCallback((next: Mood) => {
    setMood(next);
    setBeat((value) => value + 1);
  }, []);

  const run = useCallback(
    async (history: ChatMessage[], question: string) => {
      pendingRef.current = true;
      setPending(true);
      react(SHY_TOPICS.test(question) ? "shy" : "thinking");
      const outcome = await askInkbyte(history);
      const id = nextId.current++;
      if (outcome.kind === "reply") {
        setMode("live");
        setMessages((current) => [...current, { id, role: "assistant", text: outcome.text }]);
      } else if (outcome.kind === "offline") {
        setMode("offline");
        setMessages((current) => [...current, { id, role: "assistant", text: offlineAnswer(question), offline: true }]);
      } else {
        setMessages((current) => [...current, { id, role: "assistant", text: outcome.message, failed: true }]);
      }
      if (!SHY_TOPICS.test(question)) react(outcome.kind === "error" ? "idle" : "happy");
      pendingRef.current = false;
      setPending(false);
    },
    [react],
  );

  const send = useCallback(
    (text: string) => {
      const question = text.trim().slice(0, CHAT_LIMITS.maxMessageLength);
      // A second send while a reply is on its way is ignored.
      if (!question || pendingRef.current) return;
      const history = [...latest.current.filter((message) => !message.failed), { id: nextId.current++, role: "user" as const, text: question }];
      setMessages(history);
      void run(history, question);
    },
    [run],
  );

  const retry = useCallback(() => {
    if (pendingRef.current) return;
    const history = latest.current.filter((message) => !message.failed);
    const last = history[history.length - 1];
    if (!last || last.role !== "user") return;
    setMessages(history);
    void run(history, last.text);
  }, [run]);

  const openChat = useCallback(
    (question?: string) => {
      setOpen(true);
      if (question) send(question);
    },
    [send],
  );
  const closeChat = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ open, messages, pending, mode, mood, beat, openChat, closeChat, send, retry }),
    [open, messages, pending, mode, mood, beat, openChat, closeChat, send, retry],
  );
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
