import { useEffect, useState } from "react";
import { contact, profile } from "../data/site";

const STORAGE_KEY = "portfolio-loader-seen";
const HOLD_MS = 4400;
const LEAVE_MS = 1700;
const FONT_WAIT_MS = 1200;

function shouldPlay() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  try {
    return sessionStorage.getItem(STORAGE_KEY) !== "1";
  } catch {
    return true;
  }
}

function markSeen() {
  try {
    sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {
    // Private windows can block storage. The loader just plays again next time.
  }
}

/**
 * Black opening screen with "Portfolio" written out in script, once per visit.
 * It leaves like an auto-scroll: `data-intro` holds the site one screen below it,
 * then both travel up together, as if the loader were the top of the page.
 * Removed by timers rather than animation callbacks, so a browser that never
 * runs the animation still drops the overlay on schedule.
 */
export function Loader() {
  const [visible, setVisible] = useState(shouldPlay);
  const [writing, setWriting] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    root.dataset.intro = "wait";
    let cancelled = false;
    const timers: number[] = [];

    const play = () => {
      if (cancelled) return;
      setWriting(true);
      timers.push(
        window.setTimeout(() => {
          root.dataset.intro = "go";
          setLeaving(true);
        }, HOLD_MS),
      );
      timers.push(
        window.setTimeout(() => {
          markSeen();
          setVisible(false);
        }, HOLD_MS + LEAVE_MS),
      );
    };

    // Wait for the script font so the outline traces the real letters.
    const waitForFont = new Promise((resolve) => window.setTimeout(resolve, FONT_WAIT_MS));
    Promise.race([document.fonts.load('400 120px "Playball"'), waitForFont]).then(play, play);

    return () => {
      cancelled = true;
      timers.forEach(window.clearTimeout);
      root.style.overflow = "";
      delete root.dataset.intro;
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-label="Loading portfolio"
      className={`fixed inset-0 z-[100] flex flex-col justify-between bg-black px-5 py-6 text-white transition-transform duration-[1700ms] ease-[cubic-bezier(0.65,0,0.35,1)] md:px-10 md:py-8 xl:px-[3.8125rem] xl:py-[2.875rem] ${
        leaving ? "-translate-y-full" : ""
      }`}
    >
      <div className={`loader-meta grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-[0.625rem] whitespace-nowrap sm:text-xs xl:text-[1rem] ${writing ? "is-on" : ""}`}>
        <span>© {new Date().getFullYear()}</span>
        <span className="rounded-full border border-white px-3 py-1.5 font-medium tracking-wide uppercase italic xl:px-6 xl:py-2">
          {profile.role}
        </span>
        <span className="text-right uppercase">{profile.location}</span>
      </div>

      <svg viewBox="0 0 1000 340" aria-hidden="true" className="mx-auto w-full max-w-[110rem] overflow-visible">
        {writing && (
          <text x="500" y="235" textAnchor="middle" fontSize="272" className="loader-word font-script">
            Portfolio
          </text>
        )}
      </svg>

      <div className={`loader-meta grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-xs xl:text-[1rem] ${writing ? "is-on" : ""}`}>
        <span className="invisible truncate sm:visible">{contact.email}</span>
        <span className="font-medium tracking-wide whitespace-nowrap uppercase italic">{profile.name}</span>
        <span className="invisible truncate text-right sm:visible">{contact.github.replace("https://", "")}</span>
      </div>
    </div>
  );
}
