import { useEffect, useRef, useState } from "react";
import { Link } from "../lib/router";
import { useRouter } from "../lib/routerContext";
import { glideTo } from "../lib/scroll";
import { contact } from "../data/site";

const links = [
  { to: "/", label: "Home" },
  { to: "/skills", label: "Skills" },
  { to: "/projects", label: "Why an octopus?" },
];

/** Pages that open on a dark screen, so the links start white. */
const darkPages = ["/", "/skills"];

const link = "inline-flex min-h-11 items-center underline-offset-[0.4em] decoration-1 transition-opacity duration-300 hover:underline hover:opacity-100";

/**
 * Plain text navigation. It sits on the page at the top, gets out of the way
 * while reading down, and comes back as a slim black bar on any scroll up.
 */
export function Nav() {
  const { path } = useRouter();
  const [mode, setMode] = useState<"top" | "bar" | "hidden">("top");
  const lastY = useRef(0);

  useEffect(() => {
    setMode("top");
    lastY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 80) setMode("top");
      else if (y > lastY.current + 4) setMode("hidden");
      else if (y < lastY.current - 4) setMode("bar");
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [path]);

  const look =
    mode === "hidden"
      ? "-translate-y-full bg-black text-white"
      : mode === "bar"
        ? "bg-black text-white"
        : darkPages.includes(path)
          ? "text-white"
          : "text-black";

  return (
    <header
      onFocus={() => setMode((current) => (current === "hidden" ? "bar" : current))}
      className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color] duration-500 ease-out ${look}`}
    >
      <nav
        aria-label="Main"
        className={`flex justify-end gap-4 px-5 text-sm whitespace-nowrap sm:gap-6 transition-[padding] duration-500 md:gap-10 md:px-10 xl:gap-12 xl:px-[3.8125rem] xl:text-[1.125rem] ${
          mode === "top" ? "py-3 xl:py-[1.5rem]" : "py-1 xl:py-2"
        }`}
      >
        {links.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            aria-current={path === to ? "page" : undefined}
            className={`${link} ${path === to ? "underline" : "opacity-70"}`}
          >
            {label}
          </Link>
        ))}
        <button
          type="button"
          onClick={() => {
            // Every page but the 404 has a contact block. Fall back to email there.
            if (document.getElementById("contact")) glideTo("contact");
            else window.location.href = `mailto:${contact.email}`;
          }}
          className={`${link} cursor-pointer opacity-70`}
        >
          Contact
        </button>
      </nav>
    </header>
  );
}
