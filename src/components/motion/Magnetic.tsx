import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

type MagneticProps = {
  children: ReactNode;
  className?: string;
  /** How far the element is allowed to drift toward the pointer, in px. */
  strength?: number;
};

/** Pulls its child gently toward the cursor while hovered. */
export function Magnetic({ children, className, strength = 18 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 20, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 260, damping: 20, mass: 0.4 });

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: springX, y: springY }}
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse") return;
        const box = ref.current?.getBoundingClientRect();
        if (!box) return;
        const offsetX = event.clientX - (box.left + box.width / 2);
        const offsetY = event.clientY - (box.top + box.height / 2);
        x.set((offsetX / (box.width / 2)) * strength);
        y.set((offsetY / (box.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
