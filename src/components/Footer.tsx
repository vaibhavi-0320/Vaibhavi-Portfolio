import { glideToTop } from "../lib/scroll";
import { profile } from "../data/site";

type FooterProps = {
  tagline: string;
  /** The Skills frame flips the footer to black on white. */
  inverted?: boolean;
};

export function Footer({ tagline, inverted = false }: FooterProps) {
  return (
    <footer
      className={`relative h-[38vw] min-h-[12rem] overflow-hidden xl:h-[35.3125rem] xl:min-h-0 ${
        inverted ? "bg-white text-black" : "bg-black text-white"
      }`}
    >
      <p className="font-dm absolute top-[4vw] left-[3.6vw] text-[5.2vw] leading-none font-light whitespace-nowrap xl:top-[3.5625rem] xl:left-[4.3125rem] xl:text-[6.25rem] xl:leading-[8.125rem]">
        {tagline}
      </p>

      <p className="sr-only">{profile.name}</p>
      <p
        aria-hidden="true"
        className="font-dm absolute top-[14vw] left-[1.9vw] text-[15.625vw] leading-[1.3] font-medium tracking-[0.02em] whitespace-nowrap xl:top-[9.75rem] xl:left-[2.25rem] xl:text-[18.75rem]"
      >
        {profile.bigName}
      </p>

      <button
        type="button"
        onClick={glideToTop}
        aria-label="Back to top"
        className={`group absolute top-[3vw] right-[1.9vw] flex size-[9vw] min-h-10 min-w-10 cursor-pointer items-center justify-center rounded-full transition-transform duration-500 ease-out hover:scale-110 xl:top-[3.5625rem] xl:right-[2.25rem] xl:size-[8.875rem] ${
          inverted ? "bg-black" : "bg-white"
        }`}
      >
        <img
          src="/icons/footer-arrow.svg"
          alt=""
          className={`w-1/2 transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:translate-x-1 ${inverted ? "invert" : ""}`}
        />
      </button>
    </footer>
  );
}
