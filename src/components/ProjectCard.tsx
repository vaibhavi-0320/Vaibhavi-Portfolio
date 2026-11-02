import { motion } from "motion/react";
import type { Project } from "../data/site";

const small = "font-mono text-xs uppercase xl:text-[1rem]";

type CardProps = { project: Project; index: number };

export function ProjectCard({ project, index }: CardProps) {
  const visitLabel = project.live ? "Visit site" : "View code";
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.8, delay: (index % 2) * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <a
        href={project.live ?? project.repo}
        target="_blank"
        rel="noreferrer"
        aria-label={`${project.title}: ${visitLabel.toLowerCase()}`}
        className="group relative block aspect-[807/470] overflow-hidden rounded-3xl bg-black xl:rounded-[2.5rem]"
      >
        <img
          src={project.image}
          alt=""
          width={1800}
          height={1048}
          loading="lazy"
          decoding="async"
          className={`transition-transform duration-1000 ease-out group-hover:scale-105 ${
            project.logo
              ? "absolute top-1/2 left-1/2 w-[29.25%] -translate-x-1/2 -translate-y-1/2 rounded-3xl"
              : "size-full object-cover"
          }`}
        />
        <span className="absolute right-4 bottom-4 rounded-full bg-white px-4 py-2 text-sm text-black opacity-0 transition-[opacity,translate] duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 max-md:opacity-100 md:translate-y-2 md:group-hover:translate-y-0 xl:right-6 xl:bottom-6 xl:text-[1.125rem]">
          {visitLabel}
        </span>
      </a>

      <div className="mt-4 flex items-baseline justify-between gap-4 xl:mt-7">
        <h3 className="text-xl md:text-2xl xl:text-[2.25rem] xl:leading-tight">{project.title}</h3>
        <p className={`shrink-0 text-grey ${small}`}>
          {project.year} / {project.chain}
        </p>
      </div>
      <p className="font-dm mt-2 text-base font-light text-body xl:mt-3 xl:text-[1.375rem] xl:leading-snug">{project.summary}</p>

    </motion.article>
  );
}

export function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="grid gap-12 md:grid-cols-2 md:gap-6 xl:gap-x-10 xl:gap-y-[5rem]">
      {projects.map((project, index) => (
        <ProjectCard key={project.slug} project={project} index={index} />
      ))}
    </div>
  );
}
