import type { ReactNode } from "react";

type MarqueeProps = {
  children: ReactNode;
  className?: string;
  /** Seconds for one full pass. Larger is slower. */
  duration?: number;
};

/**
 * Seamless horizontal loop. The track holds two identical copies and shifts by
 * exactly half its width, so the seam never shows.
 */
export function Marquee({ children, className, duration = 26 }: MarqueeProps) {
  return (
    <div className={`overflow-hidden ${className ?? ""}`}>
      <div className="marquee-track flex h-full w-max" style={{ animationDuration: `${duration}s` }}>
        <div className="flex h-full shrink-0 items-center">{children}</div>
        <div className="flex h-full shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
