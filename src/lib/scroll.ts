import Lenis from "lenis";

let instance: Lenis | null = null;

export function setLenis(next: Lenis | null) {
  instance = next;
}

export function scrollToTop() {
  if (instance) {
    instance.scrollTo(0, { immediate: true });
  } else {
    window.scrollTo(0, 0);
  }
}

/** Smooth scroll back to the top, for the footer arrow. */
export function glideToTop() {
  if (instance) {
    instance.scrollTo(0);
  } else {
    window.scrollTo({ top: 0 });
  }
}

export function glideTo(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  if (instance) {
    instance.scrollTo(target);
  } else {
    target.scrollIntoView();
  }
}
