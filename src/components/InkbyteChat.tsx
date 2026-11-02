import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LuArrowUp, LuRotateCcw, LuX } from "react-icons/lu";
import { CHAT_LIMITS, INKBYTE_SUGGESTIONS } from "../data/inkbyte";
import { useInkbyteChat } from "../lib/inkbyteChatContext";

/* The chat is sized in px rather than rem: from 1280px up the site's rem scales
   with the window, and a chat box should stay the same comfortable size. */

function Icon({ size = 28 }: { size?: number }) {
  return <img src="/inkbyte-icon.png" alt="" width={size} height={Math.round(size * 0.9)} className="[image-rendering:pixelated]" />;
}

function Thinking() {
  return (
    <span role="status" aria-label="Inkbyte is thinking" className="flex items-center gap-1 py-1">
      {[0, 1, 2].map((dot) => (
        <span key={dot} className="inkbyte-dot size-1.5 bg-black" style={{ animationDelay: `${dot * 0.15}s` }} />
      ))}
    </span>
  );
}

function ChatPanel() {
  const { messages, pending, mode, send, retry, closeChat } = useInkbyteChat();
  const [draft, setDraft] = useState("");
  const input = useRef<HTMLTextAreaElement>(null);
  const list = useRef<HTMLDivElement>(null);

  useEffect(() => {
    input.current?.focus();
  }, []);

  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight, behavior: "smooth" });
  }, [messages, pending]);

  const submit = () => {
    if (!draft.trim() || pending) return;
    send(draft);
    setDraft("");
  };

  const onKey = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      submit();
    }
  };

  const onlyGreeting = messages.length === 1;

  return (
    <motion.div
      role="dialog"
      aria-label="Chat with Inkbyte"
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.98 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      onKeyDown={(event) => event.key === "Escape" && closeChat()}
      className="fixed right-3 bottom-3 left-3 z-[95] flex h-[min(600px,calc(100svh-24px))] flex-col overflow-hidden rounded-[20px] border border-black bg-white text-[15px] text-black shadow-[0_24px_60px_rgb(0_0_0/0.25)] sm:left-auto sm:w-[380px] md:right-6 md:bottom-6 md:h-[min(600px,calc(100svh-48px))]"
    >
      <header className="flex items-center gap-3 border-b border-black/10 px-4 py-3">
        <Icon size={34} />
        <div className="min-w-0 flex-1">
          <p className="font-medium">Inkbyte</p>
          <p className="font-mono text-[11px] text-grey">
            {mode === "offline" ? "Offline mode · canned answers" : "Bhavi's little digital sidekick"}
          </p>
        </div>
        <button
          type="button"
          onClick={closeChat}
          aria-label="Close chat"
          className="flex size-10 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-black hover:text-white"
        >
          <LuX aria-hidden="true" className="size-5" />
        </button>
      </header>

      <div ref={list} aria-live="polite" className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4" data-lenis-prevent>
        {messages.map((message) => (
          <div key={message.id} className={message.role === "user" ? "flex justify-end" : "flex"}>
            <div
              className={`max-w-[85%] rounded-[16px] px-3.5 py-2.5 leading-snug whitespace-pre-wrap ${
                message.role === "user" ? "rounded-br-[4px] bg-black text-white" : "rounded-bl-[4px] bg-hairline"
              }`}
            >
              {message.text}
              {message.offline && <span className="mt-1.5 block font-mono text-[10px] text-grey">offline answer</span>}
              {message.failed && (
                <button
                  type="button"
                  onClick={retry}
                  disabled={pending}
                  className="mt-2 flex cursor-pointer items-center gap-1.5 font-mono text-[12px] underline underline-offset-4 disabled:opacity-40"
                >
                  <LuRotateCcw aria-hidden="true" /> Try again
                </button>
              )}
            </div>
          </div>
        ))}
        {pending && (
          <div className="flex">
            <div className="rounded-[16px] rounded-bl-[4px] bg-hairline px-3.5 py-2.5">
              <Thinking />
            </div>
          </div>
        )}
        {onlyGreeting && (
          <div className="flex flex-wrap gap-2 pt-1">
            {INKBYTE_SUGGESTIONS.map((question) => (
              <button
                key={question}
                type="button"
                onClick={() => send(question)}
                className="cursor-pointer rounded-full border border-black/20 px-3 py-1.5 text-left text-[13px] transition-colors hover:border-black hover:bg-black hover:text-white"
              >
                {question}
              </button>
            ))}
          </div>
        )}
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
        className="flex items-end gap-2 border-t border-black/10 p-3"
      >
        <label htmlFor="inkbyte-input" className="sr-only">
          Ask Inkbyte about Bhavi
        </label>
        <textarea
          id="inkbyte-input"
          ref={input}
          rows={1}
          value={draft}
          maxLength={CHAT_LIMITS.maxMessageLength}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={onKey}
          placeholder="Ask me about Bhavi…"
          className="max-h-28 min-h-11 flex-1 resize-none rounded-[14px] border border-black/20 px-3 py-2.5 leading-snug outline-none focus:border-black"
          style={{ fieldSizing: "content" } as React.CSSProperties}
        />
        <button
          type="submit"
          disabled={!draft.trim() || pending}
          aria-label="Send"
          className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-black text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
        >
          <LuArrowUp aria-hidden="true" className="size-5" />
        </button>
      </form>
    </motion.div>
  );
}

/** The small "Ask Inkbyte" button in the corner, and the chat it opens. Shown on every page. */
export function InkbyteChat() {
  const { open, openChat } = useInkbyteChat();
  const launcher = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  // Hand focus back to the launcher when the chat closes.
  useEffect(() => {
    if (wasOpen.current && !open) launcher.current?.focus();
    wasOpen.current = open;
  }, [open]);

  return (
    <>
      <AnimatePresence>{open && <ChatPanel />}</AnimatePresence>
      {!open && (
        <motion.button
          ref={launcher}
          type="button"
          onClick={() => openChat()}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
          aria-label="Ask Inkbyte"
          className="fixed right-3 bottom-3 z-[60] flex size-12 cursor-pointer items-center justify-center gap-2 rounded-full border border-black bg-white text-[14px] sm:size-auto sm:py-1.5 sm:pr-4 sm:pl-2 font-medium text-black shadow-[0_8px_24px_rgb(0_0_0/0.18)] transition-transform hover:-translate-y-0.5 md:right-6 md:bottom-6"
        >
          <Icon />
          <span className="hidden sm:inline">Ask Inkbyte</span>
        </motion.button>
      )}
    </>
  );
}
