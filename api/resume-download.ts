/**
 * POST /api/resume-download  (sent with navigator.sendBeacon when the resume link is clicked)
 * Sends Bhavi a Telegram message. It never learns who downloaded: only the page,
 * the time, and the visitor's country as reported by Vercel.
 *
 * Environment (both needed, otherwise this quietly does nothing):
 *   TELEGRAM_BOT_TOKEN  from @BotFather
 *   TELEGRAM_CHAT_ID    your chat id with the bot
 */

const PAGES: Record<string, string> = { "/": "Home", "/skills": "Skills", "/projects": "Why an octopus?" };

// Best effort per server instance: stops one visitor from flooding the chat.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_VISITOR = 3;
const hits = new Map<string, number[]>();

function allowed(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length <= MAX_PER_VISITOR;
}

export async function POST(request: Request): Promise<Response> {
  const done = new Response(null, { status: 204 });
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) return done;

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!allowed(ip)) return done;

  let page = "the site";
  try {
    const body = JSON.parse(await request.text()) as { path?: unknown };
    if (typeof body.path === "string" && body.path in PAGES) page = `the ${PAGES[body.path]} page`;
  } catch {
    // A malformed beacon still counts as a download; it just loses the page name.
  }
  const country = request.headers.get("x-vercel-ip-country");
  const time = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" });
  const text = `📄 Someone downloaded your resume from ${page}.\n${time} IST${country ? ` · ${country}` : ""}`;

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: chat, text }),
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    // The download itself never depends on this message getting through.
  }
  return done;
}

export function GET(): Response {
  return new Response(null, { status: 405 });
}
