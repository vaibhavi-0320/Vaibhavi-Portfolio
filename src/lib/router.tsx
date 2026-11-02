import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type AnchorHTMLAttributes,
  type ReactNode,
} from "react";
import { RouterContext, useRouter } from "./routerContext";
import { scrollToTop } from "./scroll";

export function Router({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(() => {
    // Inkbyte is a surprise visitors click through to, so every visit starts on Home.
    if (window.location.pathname === "/projects") {
      window.history.replaceState({}, "", "/");
      return "/";
    }
    return window.location.pathname;
  });

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = useCallback((to: string) => {
    if (to === window.location.pathname) {
      scrollToTop();
      return;
    }
    window.history.pushState({}, "", to);
    setPath(to);
    scrollToTop();
  }, []);

  const value = useMemo(() => ({ path, navigate }), [path, navigate]);

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string };

export function Link({ to, children, onClick, ...rest }: LinkProps) {
  const { navigate } = useRouter();

  return (
    <a
      href={to}
      onClick={(event) => {
        onClick?.(event);
        // Let the browser handle modified clicks so "open in new tab" still works.
        if (
          event.defaultPrevented ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          event.button !== 0
        ) {
          return;
        }
        event.preventDefault();
        navigate(to);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
