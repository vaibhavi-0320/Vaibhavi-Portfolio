import type { SkillGroup } from "../data/skills";

/**
 * One card in the skill deck. It is plain HTML and CSS: nothing waits on a
 * scroll animation or script, and the hover change is decoration only.
 */
export function SkillCard({ group, index }: { group: SkillGroup; index: number }) {
  return (
    <li
      className={`group flex flex-col rounded-3xl border border-white/15 bg-charcoal p-6 text-white transition-colors duration-300 hover:bg-white hover:text-black xl:rounded-[2rem] xl:p-10 ${
        group.lead ? "md:col-span-2" : ""
      }`}
    >
      <p className="font-mono text-xs text-soft transition-colors duration-300 group-hover:text-body xl:text-base">
        {String(index + 1).padStart(2, "0")}
      </p>
      <h3 className={`font-dm mt-4 text-2xl font-medium leading-tight xl:mt-6 ${group.lead ? "xl:text-[3.5rem]" : "xl:text-[2.25rem]"}`}>{group.title}</h3>
      <p className="font-dm mt-3 max-w-[38rem] text-base font-light text-soft transition-colors duration-300 group-hover:text-body xl:text-[1.25rem] xl:leading-[1.4]">
        {group.body}
      </p>
      <ul className="mt-auto flex flex-wrap gap-2 pt-6 xl:gap-2.5 xl:pt-10" aria-label={`${group.title} skills`}>
        {group.items.map(({ label, Icon }) => (
          <li
            key={label}
            className="font-dm flex items-center gap-2 rounded-full border border-current/25 px-3 py-1.5 text-sm font-light xl:px-4 xl:py-2 xl:text-[1.125rem]"
          >
            {Icon && <Icon aria-hidden="true" className="size-4 shrink-0 xl:size-5" />}
            {label}
          </li>
        ))}
      </ul>
    </li>
  );
}
