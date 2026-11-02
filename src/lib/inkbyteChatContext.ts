import { createContext, useContext } from "react";

export type ChatMessage = {
  id: number;
  role: "user" | "assistant";
  text: string;
  /** Answered from the canned offline list, not the real assistant. */
  offline?: boolean;
  /** The request failed and can be retried. */
  failed?: boolean;
};

/** What the big Inkbyte on the Portfolio page is doing right now. */
export type Mood = "idle" | "thinking" | "happy" | "shy";

export type ChatState = {
  open: boolean;
  messages: ChatMessage[];
  pending: boolean;
  mode: "unknown" | "live" | "offline";
  mood: Mood;
  /** Changes on every reaction, so the character replays its animation. */
  beat: number;
  openChat: (question?: string) => void;
  closeChat: () => void;
  send: (text: string) => void;
  retry: () => void;
};

export const ChatContext = createContext<ChatState | null>(null);

export function useInkbyteChat() {
  const value = useContext(ChatContext);
  if (!value) throw new Error("useInkbyteChat must be used inside InkbyteChatProvider");
  return value;
}
