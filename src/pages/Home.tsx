import { AppleBite } from "../components/AppleBite";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Contact } from "../components/Contact";
import { Footer } from "../components/Footer";
import { ProjectGrid } from "../components/ProjectCard";
import { Reveal } from "../components/Reveal";
import { Marquee } from "../components/motion/Marquee";
import { Link } from "../lib/router";
import { featuredProjects, moreProjects, profile } from "../data/site";

function Hero() {
  return (
    <section className="relative h-[100svh] min-h-[34rem] overflow-hidden bg-black text-white">
      <motion.img
        src={profile.portrait}
        alt={`Portrait of ${profile.name}`}
        fetchPriority="high"
        width={1448}
        height={870}
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 size-full object-cover object-[50%_30%]"
      />
      {/* Darkens only the foot of the photo, so the type stays readable. */}
      <div className="absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-t from-black via-black/60 to-transparent" />

      <h1 className="sr-only">
        {profile.name}, {profile.role}
      </h1>

      <div className="absolute inset-x-0 bottom-0">
        <div className="flex items-end justify-between gap-8 px-5 pb-4 md:px-10 xl:px-[3.8125rem] xl:pb-6">
          <p className="text-sm xl:text-[1.25rem]">{profile.name}</p>
          <p className="hidden max-w-[34rem] text-right text-sm font-light text-white/75 md:block xl:text-[1.125rem]">
            {profile.statement}
          </p>
        </div>
        <Marquee duration={44} className="pointer-events-none border-t border-white/20">
          <span aria-hidden="true" className="pr-[0.5em] pb-[0.04em] text-[7.5rem] leading-[1.2] font-medium whitespace-nowrap md:text-[13vw] xl:text-[15rem]">
            {profile.role}
          </span>
        </Marquee>
      </div>
    </section>
  );
}

function Intro() {
  return (
    <section className="flex flex-col gap-8 px-5 pt-14 md:px-10 xl:flex-row xl:items-center xl:justify-between xl:px-[8.3125rem] xl:pt-[6.25rem]">
      <Reveal className="xl:w-[63.4375rem]">
        <p className="font-dm text-2xl font-medium md:text-3xl xl:text-[2.5rem]">{profile.intro}</p>
      </Reveal>
      <Reveal delay={0.1} className="flex flex-col items-end text-right xl:w-[30.4375rem]">
        <p className="font-dm text-base font-light text-body xl:text-[1.375rem]">{profile.aside}</p>
        <Link
          to="/skills"
          className="group font-dm mt-3 flex items-center text-lg xl:mt-4 xl:text-[1.875rem]"
        >
          More about me
          <img
            src="/icons/more-arrow.svg"
            alt=""
            className="ml-1 size-8 transition-transform duration-500 ease-out group-hover:rotate-45 xl:size-12"
          />
        </Link>
      </Reveal>
    </section>
  );
}

function Works() {
  const [more, setMore] = useState(false);
  return (
    <section className="px-5 pt-16 pb-14 md:px-10 xl:px-[8.3125rem] xl:pt-[6.25rem] xl:pb-[6.25rem]">
      <Reveal className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <h2 className="text-[13vw] leading-tight font-medium md:text-6xl xl:text-[6.25rem]">Impressive Works</h2>
        <p className="font-dm text-sm font-light md:w-72 xl:w-[26.75rem] xl:text-[1.375rem]">{profile.worksBlurb}</p>
      </Reveal>
      <div className="mt-8 xl:mt-[4.125rem]">
        <ProjectGrid projects={featuredProjects} />
      </div>
      <AnimatePresence initial={false}>
        {more && (
          <motion.div
            id="more-projects"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-12 xl:pt-[5rem]">
              <ProjectGrid projects={moreProjects} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Reveal className="mt-10 flex justify-center xl:mt-[4.125rem]">
        <button
          type="button"
          onClick={() => setMore((open) => !open)}
          aria-expanded={more}
          aria-controls="more-projects"
          className="group flex h-10 cursor-pointer items-center gap-3 rounded-full border border-neutral-300 px-6 text-sm transition-colors duration-300 hover:border-black hover:bg-black hover:text-white xl:h-[3.125rem] xl:gap-[0.75rem] xl:px-[2.125rem] xl:text-[1.25rem]"
        >
          <span className={`size-2 bg-current transition-transform duration-300 group-hover:rotate-45 xl:size-2.5 ${more ? "rotate-45" : ""}`} />
          {more ? "Show less" : "Explore more"}
        </button>
      </Reveal>
    </section>
  );
}

export function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <Works />
      <AppleBite />
      <Contact theme="white" resume />
      <Footer tagline="your friendly developer" />
    </>
  );
}
