import Anthropic from "@anthropic-ai/sdk";
import { CHAT_LIMITS, INKBYTE_SYSTEM_PROMPT } from "../src/data/inkbyte.js";

/**
 * POST /api/inkbyte  { messages: [{ role: "user" | "assistant", content: string }] }
 * Returns { reply } or { error }. The Anthropic key only ever exists on the server.
 *
 * Environment:
 *   ANTHROPIC_API_KEY  required to answer with the real assistant
 *   INKBYTE_MODEL      optional model id, default claude-opus-5-5
 */

const MODEL = process.env.INKBYTE_MODEL || "claude-opus-5-5";

// Best-effort limit per visitor. Serverless instances do not share memory, so this
// slows down abuse rather than enforcing an exact global quota.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 20;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_REQUESTS;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

/** Checks the conversation shape: alternating turns, starting and ending with the visitor. */
function readMessages(body: unknown): Anthropic.Beta.BetaMessageParam[] | null {
  if (!body || typeof body !== "object" || !Array.isArray((body as { messages?: unknown }).messages)) return null;
  const raw = (body as { messages: unknown[] }).messages.slice(-CHAT_LIMITS.maxHistory - 1);
  // An odd count is the only shape that both opens and closes with the visitor.
  if (raw.length % 2 === 0) return null;
  const messages: Anthropic.Beta.BetaMessageParam[] = [];
  for (const [index, item] of raw.entries()) {
    if (!item || typeof item !== "object") return null;
    const { role, content } = item as { role?: unknown; content?: unknown };
    const expected = index % 2 === raw.length % 2 ? "assistant" : "user";
    if (role !== expected || typeof content !== "string") return null;
    const text = content.trim();
    const limit = role === "user" ? CHAT_LIMITS.maxMessageLength : 4000;
    if (!text || text.length > limit) return null;
    messages.push({ role: expected, content: text });
  }
  return messages.length && messages[messages.length - 1].role === "user" ? messages : null;
}

let client: Anthropic | null = null;

export async function POST(request: Request): Promise<Response> {
  if (!process.env.ANTHROPIC_API_KEY) return json({ error: "not_configured" }, 503);

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) return json({ error: "rate_limited" }, 429);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid_request" }, 400);
  }
  const messages = readMessages(body);
  if (!messages) return json({ error: "invalid_request" }, 400);

  client ??= new Anthropic({ timeout: 45_000, maxRetries: 1 });
  try {
    const response = await client.beta.messages.create({
      model: MODEL,
      // Replies are deliberately short; this is a ceiling, not a target.
      max_tokens: 1024,
      // Light chat, so the lowest effort is plenty.
      output_config: { effort: "low" },
      // If a reply is declined by a safety classifier, retry it on the recommended model.
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      cache_control: { type: "ephemeral" },
      system: INKBYTE_SYSTEM_PROMPT,
      messages,
    });

    if (response.stop_reason === "refusal") {
      return json({ reply: "*ink cloud* I'd better not answer that one. Ask me about Bhavi's projects instead?" });
    }
    const reply = response.content
      .flatMap((block) => (block.type === "text" ? [block.text] : []))
      .join("")
      .trim();
    return reply ? json({ reply }) : json({ error: "empty_reply" }, 502);
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) return json({ error: "busy" }, 429);
    if (error instanceof Anthropic.AuthenticationError) return json({ error: "not_configured" }, 503);
    if (error instanceof Anthropic.APIError) return json({ error: "upstream" }, 502);
    return json({ error: "upstream" }, 502);
  }
}

export function GET(): Response {
  return json({ error: "method_not_allowed" }, 405);
}
