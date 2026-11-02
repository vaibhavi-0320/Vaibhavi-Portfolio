import { Marquee } from "./motion/Marquee";
import { eventPhotos, type EventPhoto } from "../data/site";

function Photo({ photo, hidden = false, className = "" }: { photo: EventPhoto; hidden?: boolean; className?: string }) {
  return (
    <figure className={`relative shrink-0 overflow-hidden rounded-2xl bg-black xl:rounded-[1.5rem] ${className}`}>
      <img
        src={photo.src}
        alt={hidden ? "" : photo.alt}
        width={photo.width}
        height={photo.height}
        decoding="async"
        className="block h-full w-full object-cover"
      />
      <figcaption
        aria-hidden={hidden || undefined}
        className="absolute bottom-2 left-2 rounded-full bg-black px-3 py-1 text-[0.625rem] whitespace-nowrap text-white xl:bottom-3 xl:left-3 xl:text-xs"
      >
        {photo.event}
      </figcaption>
    </figure>
  );
}

/** One big row that rises up into its slot under the quote, then slides along slowly. */
export function EventPhotos({ shown }: { shown: boolean }) {
  return (
    <div
      role="group"
      aria-label="Events and hackathons"
      className="h-full"
      style={{
        transform: shown ? "translateY(0)" : "translateY(100svh)",
        // No transition on the way out: it only ever leaves while hidden.
        transition: shown ? "transform 2600ms cubic-bezier(0.22, 1, 0.36, 1)" : "none",
      }}
    >
      <Marquee duration={95} className="h-full">
        {eventPhotos.map((photo) => (
          <Photo key={photo.src} photo={photo} className="mr-3 h-full w-auto xl:mr-4" />
        ))}
      </Marquee>
    </div>
  );
}

/** The same photos as a plain grid, for people who turn off motion. */
export function EventPhotoGrid() {
  return (
    <div className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-5">
      {eventPhotos.map((photo) => (
        <Photo key={photo.src} photo={photo} className="aspect-square" />
      ))}
    </div>
  );
}
