import { useEffect, useRef } from "react";

/**
 * Ink Byte, the tiny pixel octopus that follows the cursor.
 *
 * It is drawn on a very small canvas and scaled up without smoothing, so every
 * part stays on the pixel grid. It swims by jet propulsion like a real octopus:
 * it squeezes, shoots forward with its arms streaming behind, then glides and
 * lets them spread again.
 */

/** One art pixel is this many screen pixels. */
const PIXEL = 1;
const CANVAS_SIZE = 64;
const CENTRE = CANVAS_SIZE / 2;

const ARM_COUNT = 8;
const ARM_NODES = 7;
const ARM_STEP = 1.6;

/** Where it likes to sit, relative to the cursor, in screen pixels. */
const REST_OFFSET = { x: 16, y: 20 };
const WATER_DRAG = 3;

const BLACK = "#000000";
const WHITE = "#ffffff";

/** # is body, W is the eye white. Pupils are drawn on top so they can look around. */
const SPRITE = [
  "...######...",
  ".##########.",
  "############",
  "############",
  "#WWW####WWW#",
  "#WWW####WWW#",
  "#WWW####WWW#",
  "############",
  ".##########.",
  "..########..",
];
const SPRITE_WIDTH = SPRITE[0].length;
const EYES = [1, 8];
const EYE_TOP = 4;
const EYE_SIZE = 3;

type Point = { x: number; y: number };

function clamp(value: number, low: number, high: number) {
  return Math.max(low, Math.min(high, value));
}

/** Shortest way round between two angles. */
function angleLerp(from: number, to: number, amount: number) {
  const delta = Math.atan2(Math.sin(to - from), Math.cos(to - from));
  return from + delta * amount;
}

export function InkByte() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || calm) return;

    const cursor = { x: 0, y: 0 };
    const body = { x: 0, y: 0, vx: 0, vy: 0 };
    let awake = false;
    let squeeze = 0;
    let sincePulse = 0;
    let time = 0;
    let nextBlink = 2;
    let blinkUntil = 0;
    let last = performance.now();
    let frame = 0;

    const arms: Point[][] = Array.from({ length: ARM_COUNT }, () =>
      Array.from({ length: ARM_NODES }, () => ({ x: 0, y: 0 })),
    );

    /** The current drawing, as whole pixels, so the outline can be traced around it. */
    const pixelSet = new Map<string, string>();
    const put = (x: number, y: number, colour: string) => pixelSet.set(`${x},${y}`, colour);

    const moveBody = (dt: number) => {
      const dx = cursor.x + REST_OFFSET.x - body.x;
      const dy = cursor.y + REST_OFFSET.y - body.y;
      const distance = Math.hypot(dx, dy);

      sincePulse += dt;
      if (distance > 10 && sincePulse > (distance > 200 ? 0.3 : 0.5)) {
        // Each jet covers most of the gap. Replacing the old speed keeps it from overshooting.
        const push = Math.min(distance * WATER_DRAG * 0.92, 1100);
        body.vx = (dx / distance) * push;
        body.vy = (dy / distance) * push;
        squeeze = 1;
        sincePulse = 0;
      }

      const drag = Math.exp(-dt * WATER_DRAG);
      body.vx *= drag;
      body.vy *= drag;
      body.x += body.vx * dt;
      body.y += body.vy * dt;
      squeeze = Math.max(0, squeeze - dt * 3);
    };

    const moveArms = (dt: number, originX: number, originY: number) => {
      const speed = Math.hypot(body.vx, body.vy);
      const trailing = Math.atan2(-body.vy, -body.vx);
      // How far the arms are pulled into a streamlined bundle behind the body.
      const stream = clamp(speed / 260, 0, 0.9);

      arms.forEach((arm, index) => {
        const spread = (index - (ARM_COUNT - 1) / 2) / ((ARM_COUNT - 1) / 2);
        const side = spread < 0 ? 1 : -1;
        const flare = 1 - stream;
        const fan = Math.PI / 2 - spread * 1.3;
        const base = angleLerp(fan, trailing + spread * 0.35, stream);

        arm[0].x = originX + spread * 5;
        arm[0].y = originY + 3 - Math.abs(spread) * 2;

        for (let node = 1; node < ARM_NODES; node++) {
          const along = node / (ARM_NODES - 1);
          // One slow wave runs down each arm, and the tips curl up.
          const wave = Math.sin(time * 3 - node * 0.8 + index * 1.4) * 0.45 * along;
          const curl = side * along * along * 1.5 * flare;
          const angle = base + curl + wave;
          const wantX = arm[node - 1].x + Math.cos(angle) * ARM_STEP;
          const wantY = arm[node - 1].y + Math.sin(angle) * ARM_STEP;
          // The further down the arm, the more the water drags on it.
          const follow = 1 - Math.exp(-dt * (24 - node * 2.4));
          arm[node].x += (wantX - arm[node].x) * follow;
          arm[node].y += (wantY - arm[node].y) * follow;
          // Arms flex but never stretch, however fast the body moves.
          const gapX = arm[node].x - arm[node - 1].x;
          const gapY = arm[node].y - arm[node - 1].y;
          const gap = Math.hypot(gapX, gapY);
          if (gap > ARM_STEP) {
            arm[node].x = arm[node - 1].x + (gapX / gap) * ARM_STEP;
            arm[node].y = arm[node - 1].y + (gapY / gap) * ARM_STEP;
          }
        }
      });
    };

    const draw = (originX: number, originY: number) => {
      const left = originX - CENTRE;
      const top = originY - CENTRE;
      canvas.style.transform = `translate(${left * PIXEL}px, ${top * PIXEL}px)`;
      pixelSet.clear();

      for (const arm of arms) {
        for (let node = 0; node < arm.length - 1; node++) {
          const a = arm[node];
          const b = arm[node + 1];
          const steps = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y)));
          for (let step = 0; step <= steps; step++) {
            const t = step / steps;
            const x = Math.round(a.x + (b.x - a.x) * t);
            const y = Math.round(a.y + (b.y - a.y) * t);
            put(x, y, BLACK);
            // The first part of each arm is thicker, so it tapers to the tip.
            if (node < 2) put(x + 1, y, BLACK);
          }
        }
      }

      // Squeezing makes the head one pixel taller, the way a mantle narrows to jet.
      const stretched = squeeze > 0.45;
      const rows = stretched ? [SPRITE[0], SPRITE[1], SPRITE[2], ...SPRITE.slice(2)] : SPRITE;
      const headTop = originY - rows.length + 4;
      const headLeft = originX - SPRITE_WIDTH / 2;
      rows.forEach((line, row) => {
        for (let column = 0; column < line.length; column++) {
          if (line[column] === ".") continue;
          put(headLeft + column, headTop + row, line[column] === "W" ? WHITE : BLACK);
        }
      });

      const dx = cursor.x - body.x;
      const dy = cursor.y - body.y;
      const blink = time < blinkUntil;
      const eyeRow = headTop + EYE_TOP + (stretched ? 1 : 0);
      for (const eye of EYES) {
        if (blink) {
          for (let x = 0; x < EYE_SIZE; x++) {
            put(headLeft + eye + x, eyeRow, BLACK);
            put(headLeft + eye + x, eyeRow + 2, BLACK);
          }
          continue;
        }
        // A two-pixel pupil that shifts toward the cursor.
        const pupilX = headLeft + eye + (dx > 0 ? 1 : 0);
        const pupilY = eyeRow + (dy > 0 ? 1 : 0);
        for (const [x, y] of [[0, 0], [1, 0], [0, 1], [1, 1]]) put(pupilX + x, pupilY + y, BLACK);
      }

      context.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      context.fillStyle = WHITE;
      pixelSet.forEach((_, key) => {
        const [x, y] = key.split(",").map(Number);
        context.fillRect(x - left - 1, y - top - 1, 3, 3);
      });
      pixelSet.forEach((colour, key) => {
        const [x, y] = key.split(",").map(Number);
        context.fillStyle = colour;
        context.fillRect(x - left, y - top, 1, 1);
      });
    };

    const tick = (now: number) => {
      const dt = Math.min(0.04, (now - last) / 1000);
      last = now;
      if (awake) {
        time += dt;
        moveBody(dt);
        const originX = Math.round(body.x / PIXEL);
        // A one-pixel bob, so it never hangs perfectly still in the water.
        const originY = Math.round(body.y / PIXEL) + (Math.sin(time * 2.2) > 0.3 ? 1 : 0);
        moveArms(dt, originX, originY);
        if (time > nextBlink) {
          blinkUntil = time + 0.14;
          nextBlink = time + 2 + Math.random() * 3;
        }
        draw(originX, originY);
      }
      frame = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      cursor.x = event.clientX;
      cursor.y = event.clientY;
      if (awake) return;
      // It first appears just beside the cursor, with its arms already hanging down.
      awake = true;
      body.x = cursor.x + REST_OFFSET.x;
      body.y = cursor.y + REST_OFFSET.y;
      arms.forEach((arm) =>
        arm.forEach((node, index) => {
          node.x = body.x / PIXEL;
          node.y = body.y / PIXEL + 3 + index * ARM_STEP;
        }),
      );
      canvas.style.display = "block";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    frame = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_SIZE}
      height={CANVAS_SIZE}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[90] hidden [image-rendering:pixelated] will-change-transform"
      style={{ width: CANVAS_SIZE * PIXEL, height: CANVAS_SIZE * PIXEL }}
    />
  );
}
