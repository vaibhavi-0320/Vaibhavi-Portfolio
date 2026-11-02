import { motion, type TargetAndTransition } from "motion/react";
import type { Mood } from "../lib/inkbyteChatContext";

/** Where the eye whites sit in /inkbyte.png, as percentages, found from the artwork itself. */
const EYES = [
  { left: 36.2, top: 35.4, width: 11.1, height: 14.6 },
  { left: 54.3, top: 35.2, width: 11, height: 14.8 },
];

const reactions: Record<Mood, TargetAndTransition> = {
  idle: {},
  // A little hop with a squash on landing.
  happy: { y: [0, -26, 0, 0], scaleX: [1, 0.96, 1.06, 1], scaleY: [1, 1.05, 0.93, 1], transition: { duration: 0.7, ease: "easeOut" } },
  // Pulls back and shuffles awkwardly.
  shy: { scale: [1, 0.86, 0.88], x: [0, -10, 8, -6, 0], rotate: [0, -4, 3, 0], transition: { duration: 0.9 } },
  // Sways from side to side while a reply is on its way.
  thinking: { rotate: [0, -3, 3, 0], transition: { duration: 1.1, repeat: Infinity, ease: "easeInOut" } },
};

/**
 * The big Inkbyte, drawn from the original pixel art. It floats, blinks every few
 * seconds, and reacts to the chat: a hop for an answer, a shy shuffle for
 * questions about Bhavi's love life, a sway while it thinks.
 */
export function InkbyteCharacter({ mood = "idle", beat = 0, className = "" }: { mood?: Mood; beat?: number; className?: string }) {
  return (
    <div className={`inkbyte-float ${className}`}>
      <motion.div key={beat} animate={reactions[mood]} className="relative origin-bottom">
        <img
          src="/inkbyte.png"
          alt="Inkbyte, a black pixel-art octopus with big round eyes and eight curling arms"
          width={1050}
          height={940}
          className="block h-auto w-full [image-rendering:pixelated]"
        />
        {EYES.map((eye) => (
          <span
            key={eye.left}
            aria-hidden="true"
            className={`absolute bg-black ${mood === "shy" ? "opacity-100" : "inkbyte-blink"}`}
            style={{ left: `${eye.left}%`, top: `${eye.top}%`, width: `${eye.width}%`, height: `${eye.height}%` }}
          >
            {/* A closed eye: one row of white pixels across the middle. */}
            <span className="absolute inset-x-[12%] top-1/2 h-[16%] -translate-y-1/2 bg-white" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}
