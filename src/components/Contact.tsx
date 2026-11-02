import { Magnetic } from "./motion/Magnetic";
import { Reveal } from "./Reveal";
import { contact, profile } from "../data/site";
import { noteResumeDownload, RESUME_FILENAME, RESUME_URL } from "../lib/resumeDownload";

export type ContactTheme = "white" | "black";

const themes: Record<ContactTheme, string> = {
  white: "bg-white text-black",
  black: "bg-black text-white",
};

/** `resume` adds a download link beside the email and social links. */
export function Contact({ theme, resume = false }: { theme: ContactTheme; resume?: boolean }) {
  return (
    <section id="contact" className={`relative px-5 py-14 md:px-10 xl:h-[39.625rem] xl:px-[8.3125rem] xl:py-[4.125rem] ${themes[theme]}`}>
      <Reveal>
        <p className="font-mono text-sm xl:text-[1.25rem]">That's all for now.</p>
        <h2 className="mt-1 text-[10.5vw] leading-tight md:text-[3.5rem] xl:mt-0.5 xl:text-[4.8125rem] xl:leading-[5.8125rem]">
          Got a project in mind?
          <br />
          Let’s talk
        </h2>
      </Reveal>

      <div className="mt-24 border-t border-current opacity-50 xl:absolute xl:inset-x-[8.3125rem] xl:top-[24.5625rem] xl:mt-0" />

      <Magnetic
        strength={14}
        className="relative -mt-[5.5rem] ml-auto mr-4 size-44 md:mr-24 xl:absolute xl:top-[15.75rem] xl:left-[83rem] xl:m-0 xl:size-[17.375rem]"
      >
        <a
          href={`mailto:${contact.email}`}
          className={`flex size-full items-center justify-center rounded-full text-base transition-transform duration-500 ease-out hover:scale-105 xl:text-[1.5rem] ${
            theme === "black" ? "bg-white text-black" : "bg-black text-white"
          }`}
        >
          Get in touch
        </a>
      </Magnetic>

      <div className="mt-10 flex flex-col gap-8 md:flex-row md:gap-14 xl:absolute xl:top-[31.625rem] xl:left-[8.3125rem] xl:mt-0 xl:gap-[3.5625rem]">
        <div className="xl:w-[25.875rem]">
          <p className="text-xs text-label xl:text-base">Email:</p>
          <a
            href={`mailto:${contact.email}`}
            className="mt-1 block text-base break-all underline-offset-4 hover:underline xl:text-[1.5rem] xl:break-normal"
          >
            {contact.email}
          </a>
        </div>
        <div>
          <p className="text-xs text-label xl:text-base">Social</p>
          <p className="mt-1 flex gap-6 text-base xl:text-[1.5rem]">
            <a href={contact.github} target="_blank" rel="noreferrer" className="-mx-1.5 inline-block min-w-[32px] px-1.5 py-1 text-center underline-offset-4 hover:underline">
              GitHub
            </a>
            <a href={contact.linkedin} target="_blank" rel="noreferrer" className="-mx-1.5 inline-block min-w-[32px] px-1.5 py-1 text-center underline-offset-4 hover:underline">
              LinkedIn
            </a>
            <a href={contact.x} target="_blank" rel="noreferrer" className="-mx-1.5 inline-block min-w-[32px] px-1.5 py-1 text-center underline-offset-4 hover:underline">
              X
            </a>
          </p>
        </div>
        {resume && (
          <div>
            <p className="text-xs text-label xl:text-base">Resume</p>
            <a
              href={RESUME_URL}
              download={RESUME_FILENAME}
              onClick={noteResumeDownload}
              className="-mx-1.5 mt-1 inline-block px-1.5 py-1 text-base underline underline-offset-4 hover:no-underline xl:text-[1.5rem]"
            >
              Download my resume
            </a>
          </div>
        )}
      </div>

      <p className="mt-8 font-mono text-xs text-label xl:absolute xl:top-[36.25rem] xl:left-[8.3125rem] xl:mt-0 xl:text-base">
        © {new Date().getFullYear()} {profile.name}, {profile.location}
      </p>
    </section>
  );
}
