import { lazy, Suspense, useEffect, type ComponentType } from "react";
import { InkByte } from "./components/InkByte";
import { InkbyteChat } from "./components/InkbyteChat";
import { InkbyteChatProvider } from "./lib/inkbyteChat";
import { Loader } from "./components/Loader";
import { Nav } from "./components/Nav";
import { Home } from "./pages/Home";
import { useRouter } from "./lib/routerContext";
import { useSmoothScroll } from "./lib/useLenis";

// Only the page someone lands on is downloaded up front.
const loadSkills = () => import("./pages/Skills").then((module) => ({ default: module.Skills }));
const loadPortfolio = () => import("./pages/Portfolio").then((module) => ({ default: module.Portfolio }));
const Skills = lazy(loadSkills);
const Portfolio = lazy(loadPortfolio);
const NotFound = lazy(() => import("./pages/NotFound").then((module) => ({ default: module.NotFound })));

const routes: Record<string, { Page: ComponentType; title: string }> = {
  "/": { Page: Home, title: "Vaibhavi Agale | Blockchain Developer" },
  "/skills": { Page: Skills, title: "Skills | Vaibhavi Agale" },
  "/projects": { Page: Portfolio, title: "Why an octopus? | Vaibhavi Agale" },
};
const missing = { Page: NotFound, title: "Page not found | Vaibhavi Agale" };

export default function App() {
  useSmoothScroll();
  const { path } = useRouter();
  const { Page, title } = routes[path] ?? missing;

  useEffect(() => {
    document.title = title;
  }, [title]);

  // Fetch the other pages once this one has settled, so moving between them is instant.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadSkills();
      void loadPortfolio();
    }, 2500);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <InkbyteChatProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[110] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-black"
      >
        Skip to content
      </a>
      <Loader />
      <Nav />
      <main id="main">
        {/* Keyed so each route remounts and replays the CSS fade. The page must
            render immediately on navigation, so nothing gates it on animation.
            Each Figma frame carries its own contact block and footer, so they
            live inside the pages. */}
        <div key={path} className="page-enter">
          <Suspense fallback={<div className="min-h-[100svh] bg-black" />}>
            <Page />
          </Suspense>
        </div>
      </main>
      {/* The Portfolio page has the big Inkbyte, so the cursor one stays away there.
          Unmounting it also removes its listeners. */}
      {path !== "/projects" && <InkByte />}
      <InkbyteChat />
    </InkbyteChatProvider>
  );
}
