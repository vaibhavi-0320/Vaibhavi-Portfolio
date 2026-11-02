# Portfolio: Vaibhavi Agale

Personal portfolio site, built from the "Portfoloio" Figma file: Home, Skills, and Portfolio frames.

Vite + React 19 + TypeScript + Tailwind CSS v4 + Motion. No router dependency: `src/lib/router.tsx` is a small History API router, so `/`, `/skills` and `/projects` are real URLs.

## Run it

```bash
npm run dev
```

```bash
npm run build
```

## How the sizing works

The Figma frames are 1920 wide. From 1280px up, `1rem` is 1/120 of the viewport (see `src/index.css`), so any `xl:` value in rem is the Figma px value divided by 16 and the whole page scales with the window. Below 1280px the layouts are fluid.

## Where the content lives

All copy and project data is in two files. You should not need to touch the components to change what the site says.

- `src/data/site.ts`: name, intro text, contact links, and the `projects` array.
- `src/data/inkbyte.ts`: everything Inkbyte knows and how it behaves, its greeting, suggested questions, and the offline answers. Edit facts here, not in the endpoint.
- `src/data/skills.ts`: the skill deck, as one ordered list. The first card is the wide lead card, so keep the total at 11 for a full last row.

Project screenshots are in `public/projects/` and already greyscale, your photo is `public/hero.webp`, and the link preview image is `public/og.jpg`. Fonts are self-hosted through Fontsource. Set a full URL on `og:image` in `index.html` once the site has its domain.

## Animation

- `Marquee`: seamless loop for the hero text. It renders two copies and shifts the track by exactly half, so the seam never shows.
- `Magnetic`: pulls a button toward the cursor while hovered.
- `Reveal`: scroll fade.
- `AppleBite`: the scroll sequence after the projects. Bites (`spots`) are SVG masks over `public/apple.webp`. The outer bites go right through and the inner ones only remove skin, leaving the yellow front from `public/apple-flesh.webp`. The camera zooms into it and the quote and the link to `/skills` appear on #F2D370. Timing constants are at the top of the file. Sounds are generated in `src/lib/appleSound.ts`, and browsers only allow them after a click or key press.
- `InkByte`: the pixel octopus that follows the cursor, drawn live on a small canvas. Its body sprite and movement settings are at the top of the file. It stays hidden on touch screens and for people who turn off motion.
- `EventPhotos`: event photos beside the quote. One row rises 2 seconds after it settles, then slides slowly in a loop. It shares the quote's visibility, so it never shows outside the cream page. To add one, put a file in `public/events/` and add it to `eventPhotos` in `src/data/site.ts`.
- `Loader`: the black "Portfolio" opening screen. It plays once per browser tab and is removed by timers, so it can never leave the site covered. It leaves like an auto-scroll, with the site moving up attached to it through `data-intro` in `index.css`.

The page fade has no `animation-fill-mode`, so if it never runs the page sits at full opacity. All motion respects `prefers-reduced-motion`.

## Inkbyte

The Portfolio page (`/projects`) introduces Inkbyte, the pixel octopus, with a chat about Bhavi. The same chat opens from the "Ask Inkbyte" button in the corner of every page.

- `api/inkbyte.ts`: a Vercel function that calls Claude with the system prompt from `src/data/inkbyte.ts`. It validates every request, limits each visitor to 20 messages per 10 minutes (best effort, per server instance), and never sends the key to the browser.
- `src/lib/inkbyteChat.tsx`: the one chat service and conversation state, shared by both entry points.
- `src/components/InkbyteChat.tsx`: the launcher and chat window. `InkbyteCharacter.tsx`: the big animated octopus.
- During `npm run dev`, `vite.config.ts` runs the same endpoint locally.
- With no `ANTHROPIC_API_KEY`, the chat answers from a short canned list and labels itself "Offline mode".

The resume download is `public/Bhavi_Agale_Resume.pdf`. Replace that file to update it. It is linked on Home, Skills, and the Why an octopus? page.

### Resume download alerts

Every resume click sends a beacon to `api/resume-download.ts`, which messages you on Telegram with the page, time and country. It cannot tell you who downloaded it. To switch it on:

1. In Telegram, message @BotFather, send `/newbot`, and copy the token it gives you.
2. Send any message to your new bot, then open `https://api.telegram.org/bot<token>/getUpdates` in a browser and copy `"chat":{"id": ...}`.
3. Add `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` in Vercel (Settings, Environment Variables) and redeploy.

Without them, downloads work exactly the same and no message is sent.

## Deploying

Set `ANTHROPIC_API_KEY` in the Vercel project (Settings, Environment Variables) to switch Inkbyte on. `INKBYTE_MODEL` is optional. See `.env.example`. Nothing else is needed.

`vercel.json` rewrites unknown paths to `index.html` so `/skills` and `/projects` survive a refresh, caches built assets for a year, and sets basic security headers. `public/robots.txt` allows crawling.

With the Vercel CLI, from this folder:

```bash
npx vercel
```

```bash
npx vercel --prod
```

Or push the folder to a GitHub repo and import it at vercel.com/new. Vercel detects Vite: build command `npm run build`, output folder `dist`.

After the first deploy, set `og:image` in `index.html` to the full URL of `og.jpg` on the live domain so link previews show the image.
