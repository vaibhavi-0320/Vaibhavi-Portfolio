import { Link } from "../lib/router";

export function NotFound() {
  return (
    <>
      <section className="flex min-h-[70vh] flex-col justify-center px-5 md:px-10 xl:px-[8.3125rem]">
        <p className="font-mono text-sm xl:text-[1.25rem]">404</p>
        <h1 className="mt-4 text-[14vw] leading-none font-medium md:text-[7vw]">Nothing here</h1>
        <Link
          to="/"
          className="mt-8 w-fit rounded-full border border-neutral-300 px-6 py-3 text-sm transition-colors hover:bg-black hover:text-white xl:text-[1.25rem]"
        >
          Back home
        </Link>
      </section>
    </>
  );
}
