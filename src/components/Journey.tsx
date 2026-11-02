import { Reveal } from "./Reveal";
import { journey } from "../data/site";

/** Where the work happened: study, freelancing, and the communities around it. */
export function Journey() {
  return (
    <section aria-labelledby="journey-title" className="bg-black px-5 pt-10 pb-20 text-white md:px-10 xl:px-[8.3125rem] xl:pt-[4.125rem] xl:pb-[8rem]">
      <Reveal>
        <h2 id="journey-title" className="text-[13vw] leading-tight md:text-7xl xl:text-[6.25rem]">
          The journey so far
        </h2>
      </Reveal>
      <ol className="mt-10 border-t border-white/20 xl:mt-[4.125rem]">
        {journey.map((item) => (
          <li key={item.title} className="border-b border-white/20">
            <Reveal y={14}>
              <div className="grid gap-1 py-5 md:grid-cols-[12rem_1fr] md:gap-8 xl:grid-cols-[17rem_1fr_1fr] xl:py-7">
                <p className="font-mono text-xs text-soft xl:text-base">{item.when}</p>
                <h3 className="text-lg xl:text-[1.75rem] xl:leading-tight">{item.title}</h3>
                <p className="font-dm text-sm font-light text-soft md:col-start-2 xl:col-start-auto xl:text-[1.25rem]">{item.detail}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
