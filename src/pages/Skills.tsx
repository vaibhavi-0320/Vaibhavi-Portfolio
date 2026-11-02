import { Contact } from "../components/Contact";
import { Footer } from "../components/Footer";
import { Journey } from "../components/Journey";
import { Reveal } from "../components/Reveal";
import { SkillCard } from "../components/SkillCard";
import { skillGroups } from "../data/skills";

export function Skills() {
  return (
    <>
      <div className="relative bg-black">
        <section className="flex min-h-[26rem] items-center justify-center px-5 pt-20 md:min-h-[32rem] xl:h-[61.75rem] xl:pt-0">
          <Reveal>
            <h1 className="font-dm mx-auto max-w-[75.75rem] text-center text-[13vw] leading-tight text-white md:text-7xl xl:text-[8.75rem] xl:leading-[11.375rem]">
              Skills that fuel my passion
            </h1>
          </Reveal>
        </section>

        <section aria-label="Skills" className="px-5 pb-16 md:px-10 xl:px-[8.3125rem] xl:pb-[4.125rem]">
          <h2 className="sr-only">Skill areas</h2>
          <ol className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 xl:gap-5">
            {skillGroups.map((group, index) => (
              <SkillCard key={group.title} group={group} index={index} />
            ))}
          </ol>
        </section>
      </div>

      <Journey />
      <Contact theme="black" resume />
      <Footer tagline="your friendly chaos creator" inverted />
    </>
  );
}

