import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { LuArrowUpRight, LuVolume2, LuVolumeX } from "react-icons/lu";
import { EventPhotoGrid, EventPhotos } from "./EventPhotos";
import { Link } from "../lib/router";
import { playBite, unlockSound } from "../lib/appleSound";

/** Size of /apple.webp, used as the SVG coordinate space. */
const WIDTH = 1154;
const HEIGHT = 1171;
const CRUMB_COUNT = 2;

/** The colour the camera zooms into, sampled from the apple flesh. */
const FLESH = "#F2D370";
const BROWN = "#5a2406";

const HEADING = "The quote that I";
const HEADING_SCRIPT = "live by";
const QUOTE = "You can always figure out how to chew it later.";

/** The whole scene, as fractions of the pinned scroll distance. */
const FIRST_BITE = 0.16;
const BITE_GAP = 0.021;
const BITE_LENGTH = 0.017;
const ZOOM: [number, number] = [0.5, 0.7];
const QUOTE_IN: [number, number] = [0.68, 0.76];
/** How long the quote sits alone before the photos start to rise. */
const PHOTO_DELAY_MS = 2000;

type Spot = { x: number; y: number };
/** `side` is the way the mouth comes in from: 1 for the right, -1 for the left. */
type Bite = Spot & { r: number; from: number; to: number; side: number; seed: number };

/** The sides first, then inward. The top with the stem is left whole. */
const spots: Spot[] = [
  { x: 1090, y: 360 },
  { x: 60, y: 360 },
  { x: 1090, y: 600 },
  { x: 60, y: 600 },
  { x: 1090, y: 840 },
  { x: 60, y: 840 },
  { x: 850, y: 1080 },
  { x: 300, y: 1080 },
  { x: 850, y: 840 },
  { x: 300, y: 840 },
  { x: 850, y: 600 },
  { x: 300, y: 600 },
  { x: 850, y: 400 },
  { x: 300, y: 400 },
  { x: 575, y: 840 },
  { x: 575, y: 600 },
];

const skinBites: Bite[] = spots.map((spot, index) => {
  const from = FIRST_BITE + index * BITE_GAP;
  const side = spot.x === 575 ? (index % 2 ? 1 : -1) : Math.sign(spot.x - 575);
  return { ...spot, r: 225, from, to: from + BITE_LENGTH, side, seed: index * 2.3 };
});

/** Only the outer bites go right through. Further in, the skin goes and the yellow front stays. */
const throughBites: Bite[] = skinBites
  .filter((bite) => bite.x >= 1090 || bite.x <= 60 || bite.y >= 1080)
  .map((bite) => ({ ...bite, r: bite.r * 0.94 }));
const shadeBites: Bite[] = skinBites.map((bite) => ({ ...bite, r: bite.r * 0.95 }));

/**
 * One bite as a closed outline. It slides in from outside the apple like a mouth
 * closing, so a hole never opens in the middle of the skin. The edge facing the
 * apple carries tooth marks, and a little wobble keeps each bite different.
 */
function bitePath(bite: Bite, amount: number) {
  const eased = 1 - (1 - amount) ** 3;
  const centreX = bite.x + bite.side * (1 - eased) * bite.r * 1.3;
  const radius = bite.r * (0.78 + 0.22 * eased);
  const facing = bite.side > 0 ? Math.PI : 0;
  const points: string[] = [];
  for (let i = 0; i < 96; i++) {
    const angle = (i / 96) * Math.PI * 2;
    const offset = Math.atan2(Math.sin(angle - facing), Math.cos(angle - facing));
    const front = Math.max(0, Math.cos(offset * 0.75));
    const tooth = Math.abs(Math.sin(offset * 5.5 + bite.seed)) * front;
    const wobble = Math.sin(angle * 3 + bite.seed * 2) * 0.03 + Math.sin(angle * 7 + bite.seed) * 0.015;
    const reach = radius * (0.93 + tooth * 0.1 + wobble);
    points.push(`${(centreX + Math.cos(angle) * reach).toFixed(1)} ${(bite.y + Math.sin(angle) * reach).toFixed(1)}`);
  }
  return `M${points.join("L")}Z`;
}

function BitePath({ bite, progress }: { bite: Bite; progress: MotionValue<number> }) {
  const finished = bitePath(bite, 1);
  const d = useTransform(progress, (value) => {
    if (value <= bite.from) return "M0 0";
    if (value >= bite.to) return finished;
    return bitePath(bite, (value - bite.from) / (bite.to - bite.from));
  });
  return <motion.path d={d} />;
}

function BiteShape({ progress, fill, list }: { progress: MotionValue<number>; fill: string; list: Bite[] }) {
  return (
    <g fill={fill}>
      {list.map((bite) => (
        <BitePath key={`${bite.x}-${bite.y}`} bite={bite} progress={progress} />
      ))}
    </g>
  );
}

const maskArea = { maskUnits: "userSpaceOnUse", x: -300, y: -300, width: WIDTH + 600, height: HEIGHT + 600 } as const;

function HoleMask({ id, list, progress }: { id: string; list: Bite[]; progress: MotionValue<number> }) {
  return (
    <mask id={id} {...maskArea}>
      <rect x={-300} y={-300} width={WIDTH + 600} height={HEIGHT + 600} fill="#fff" />
      <BiteShape progress={progress} fill="#000" list={list} />
    </mask>
  );
}

function Crumb({ bite, index, progress }: { bite: Bite; index: number; progress: MotionValue<number> }) {
  const spread = ((index - (CRUMB_COUNT - 1) / 2) / CRUMB_COUNT) * 2.2;
  const angle = (bite.side > 0 ? 0 : Math.PI) + spread;
  const distance = 170 + ((index * 67) % 150);
  const end = bite.to + 0.04;
  const x = useTransform(progress, [bite.to - 0.008, end], [bite.x, bite.x + Math.cos(angle) * distance]);
  // Gravity: the crumb lifts, then keeps falling until it leaves the scene.
  const y = useTransform(
    progress,
    [bite.to - 0.008, bite.to + 0.008, end],
    [bite.y, bite.y + Math.sin(angle) * distance * 0.6 - 50, bite.y + Math.sin(angle) * distance + 1000],
    { ease: [(t) => t, (t) => t * t] },
  );
  const size = 3 + (index % 2) * 3;
  const r = useTransform(progress, [bite.to - 0.009, bite.to - 0.008, end, end + 0.001], [0, size, size, 0]);
  return <motion.circle cx={x} cy={y} r={r} fill={FLESH} />;
}

function Apple({ progress }: { progress: MotionValue<number> }) {
  const rotateY = useTransform(progress, [0, 0.14], [-24, 0]);
  const rotateX = useTransform(progress, [0, 0.14], [9, 0]);

  return (
    <motion.svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      aria-hidden="true"
      className="relative block w-full overflow-visible"
      style={{ rotateX, rotateY }}
    >
      <defs>
        <HoleMask id="apple-skin-hole" list={skinBites} progress={progress} />
        <HoleMask id="apple-through-hole" list={throughBites} progress={progress} />
        <mask id="apple-shade" {...maskArea}>
          <BiteShape progress={progress} fill="#fff" list={skinBites} />
          <BiteShape progress={progress} fill="#000" list={shadeBites} />
        </mask>
      </defs>

      <g mask="url(#apple-through-hole)">
        <image href="/apple-flesh.webp" width={WIDTH} height={HEIGHT} />
        <g mask="url(#apple-shade)">
          <image href="/apple-flesh.webp" width={WIDTH} height={HEIGHT} style={{ filter: "brightness(0.5)" }} opacity="0.6" />
        </g>
      </g>
      <image href="/apple.webp" width={WIDTH} height={HEIGHT} mask="url(#apple-skin-hole)" />

      {skinBites.map((bite) =>
        Array.from({ length: CRUMB_COUNT }, (_, index) => (
          <Crumb key={`${bite.x}-${bite.y}-${index}`} bite={bite} index={index} progress={progress} />
        )),
      )}
    </motion.svg>
  );
}

/** Sound starts on the first click or key press, the earliest a browser allows. */
function SoundButton({ on, onToggle, color }: { on: boolean | null; onToggle: () => void; color: MotionValue<string> }) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      style={{ color }}
      className="absolute bottom-5 left-5 z-20 flex min-h-10 cursor-pointer items-center gap-2 rounded-full border border-current px-4 py-2 font-mono text-xs md:left-10 xl:bottom-[2.875rem] xl:left-[3.8125rem] xl:text-base"
    >
      {on ? <LuVolume2 aria-hidden="true" /> : <LuVolumeX aria-hidden="true" />}
      {on === null ? "Tap for sound" : on ? "Sound on" : "Sound off"}
    </motion.button>
  );
}

/** The quote and the way on to the skills page. */
function QuoteBlock() {
  return (
    <>
      <p className="script-word block max-w-[80rem] text-[15vw] leading-[1.15] md:text-8xl xl:max-w-none xl:text-[min(7.5rem,11svh)]" style={{ color: BROWN }}>
        {QUOTE}
      </p>
      <Link
        to="/skills"
        className="group mt-10 inline-flex w-fit items-center gap-4 rounded-full py-3 pr-3 pl-7 text-lg font-medium transition-colors duration-300 hover:!bg-black xl:mt-6 xl:gap-5 xl:py-3 xl:pr-3 xl:pl-9 xl:text-[1.5rem]"
        style={{ backgroundColor: BROWN, color: FLESH }}
      >
        Explore my skills
        <span
          className="flex size-10 items-center justify-center rounded-full transition-transform duration-500 ease-out group-hover:rotate-45 xl:size-12"
          style={{ backgroundColor: FLESH, color: BROWN }}
        >
          <LuArrowUpRight aria-hidden="true" />
        </span>
      </Link>
    </>
  );
}

function Scene({ progress }: { progress: MotionValue<number> }) {
  const [sound, setSound] = useState<boolean | null>(null);
  const soundRef = useRef(sound);
  soundRef.current = sound;
  const last = useRef(0);
  // Mounted during the zoom, so the photos are downloaded before they are needed.
  const [photosReady, setPhotosReady] = useState(false);
  const [quoteUp, setQuoteUp] = useState(false);
  const [photosShown, setPhotosShown] = useState(false);

  useEffect(() => {
    if (!quoteUp) {
      setPhotosShown(false);
      return;
    }
    const timer = window.setTimeout(() => setPhotosShown(true), PHOTO_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [quoteUp]);

  useEffect(() => {
    const unlock = () => {
      unlockSound();
      setSound((current) => current ?? true);
    };
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  // Sounds only play scrolling forward, once for each bite crossed.
  useMotionValueEvent(progress, "change", (now) => {
    if (now > ZOOM[0]) setPhotosReady(true);
    if (now >= QUOTE_IN[1]) setQuoteUp(true);
    else if (now < QUOTE_IN[0]) setQuoteUp(false);
    const before = last.current;
    last.current = now;
    if (!soundRef.current || now <= before) return;
    if (skinBites.some((bite) => before < bite.from && now >= bite.from)) playBite();
  });

  const smooth = (t: number) => t * t * (3 - 2 * t);
  const toCentre = useTransform(progress, [0.05, 0.14], [1, 0], { ease: smooth });
  const headingX = useTransform(progress, [0.04, 0.12], ["0vw", "-120vw"], { ease: (t) => t * t });
  const appleScale = useTransform(progress, [0, 0.14], [0.82, 1]);
  const stageX = useMotionTemplate`calc(var(--apple-x) * ${toCentre})`;
  const stageY = useMotionTemplate`calc(var(--apple-y) * ${toCentre})`;

  // A small kick to alternate sides on every bite.
  const kickInput = [0, ...skinBites.flatMap((bite) => [bite.from, bite.from + 0.005, bite.from + 0.016])];
  const kickOutput = [0, ...skinBites.flatMap((_, index) => [0, index % 2 ? -2 : 2, 0])];
  const kick = useTransform(progress, kickInput, kickOutput);

  // The camera dives into the yellow front until its colour is all that is left.
  const zoom = useTransform(progress, ZOOM, [1, 40], { ease: (t) => t * t * t });
  const zoomLength = ZOOM[1] - ZOOM[0];
  const patch = useTransform(progress, [ZOOM[0] + zoomLength * 0.5, ZOOM[0] + zoomLength * 0.75], [0, 1]);
  const finish = useTransform(progress, (value) => (value >= ZOOM[1] ? FLESH : "#000000"));
  const soundColor = useTransform<number, string>(progress, (value) => (value >= ZOOM[1] ? BROWN : "#ffffff"));

  const quoteOpacity = useTransform(progress, QUOTE_IN, [0, 1]);
  const quoteScale = useTransform(progress, QUOTE_IN, [0.9, 1]);
  const quoteVisibility = useTransform(progress, (value) => (value > QUOTE_IN[0] ? "visible" : "hidden"));

  return (
    <motion.div
      className="relative h-full overflow-hidden text-white [--apple-x:0vw] [--apple-y:10vh] xl:[--apple-x:23vw] xl:[--apple-y:0vh]"
      style={{ backgroundColor: finish }}
    >
      <motion.div
        className="absolute inset-x-5 top-[10%] z-10 md:inset-x-10 xl:top-1/2 xl:right-auto xl:left-[8.3125rem] xl:max-w-[44rem] xl:-translate-y-1/2"
        style={{ x: headingX }}
      >
        <h2 className="text-[13vw] leading-[1.1] font-medium md:text-7xl xl:text-[7rem] xl:leading-[1.15]">
          {HEADING} {HEADING_SCRIPT}
        </h2>
      </motion.div>

      <motion.div className="absolute inset-0 flex items-center justify-center" style={{ x: stageX, y: stageY }}>
        <motion.div
          className="w-[min(68vw,44svh)] [perspective:1400px] xl:w-[min(46rem,68svh)]"
          style={{ scale: appleScale, rotate: kick }}
        >
          <motion.div className="relative origin-[50%_55%]" style={{ scale: zoom, willChange: "transform" }}>
            <Apple progress={progress} />
            <motion.div
              className="absolute top-[55%] left-1/2 size-[20%] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ opacity: patch, background: `radial-gradient(circle, ${FLESH} 45%, transparent 71%)` }}
            />
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute inset-0 z-10 flex flex-col justify-start px-5 pt-[12svh] md:px-10 xl:px-[8.3125rem] xl:pt-[7svh]"
        style={{ opacity: quoteOpacity, scale: quoteScale, visibility: quoteVisibility }}
      >
        <QuoteBlock />
        {/* The photos take whatever height is left under the button, so the two never overlap.
            They share the quote's fade and visibility, so they only exist on the cream page. */}
        <div className="pointer-events-none mt-6 mb-16 -mx-5 flex min-h-0 flex-1 items-end overflow-hidden md:-mx-10 xl:mt-10 xl:mb-[6.5rem] xl:-mx-[8.3125rem]">
          <div className="h-full max-h-[36svh] w-full">{photosReady && <EventPhotos shown={photosShown} />}</div>
        </div>
      </motion.div>

      <SoundButton
        color={soundColor}
        on={sound}
        onToggle={() => {
          unlockSound();
          // The first click also unlocks through the window listener, which leaves it on.
          setSound((current) => (current === null ? true : !current));
        }}
      />
    </motion.div>
  );
}

function PinnedApple() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // A plain copy of the scroll value: left on the browser's own scroll timeline,
  // values here finish early and snap back, so old layers reappear.
  const progress = useMotionValue(0);
  useMotionValueEvent(scrollYProgress, "change", (value) => progress.set(value));
  return (
    <section ref={ref} aria-label={`${HEADING} ${HEADING_SCRIPT}`} className="relative h-[600vh] bg-black">
      <div className="sticky top-0 h-[100svh]">
        <Scene progress={progress} />
      </div>
    </section>
  );
}

function StillApple() {
  return (
    <>
      <section className="flex flex-col items-center gap-12 bg-black px-5 py-20 text-center text-white">
        <h2 className="text-5xl font-medium md:text-7xl xl:text-[7rem]">
          {HEADING} {HEADING_SCRIPT}
        </h2>
        <img src="/apple.webp" alt="A red apple engraved with the words Bite Off More Than You Can Chew" className="w-full max-w-[32rem]" />
      </section>
      <section className="px-5 py-24 md:px-10 xl:px-[8.3125rem]" style={{ backgroundColor: FLESH }}>
        <QuoteBlock />
        <EventPhotoGrid />
      </section>
    </>
  );
}

/** Whole apple eaten down to its yellow front, then a zoom into it and the quote, driven by scroll. */
export function AppleBite() {
  const reduced = useReducedMotion();
  return reduced ? <StillApple /> : <PinnedApple />;
}
