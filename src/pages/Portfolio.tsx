import { LuArrowDown, LuArrowUpRight } from "react-icons/lu";
import { Contact } from "../components/Contact";
import { Footer } from "../components/Footer";
import { InkbyteCharacter } from "../components/InkbyteCharacter";
import { Reveal } from "../components/Reveal";
import { INKBYTE_SUGGESTIONS } from "../data/inkbyte";
import { useInkbyteChat } from "../lib/inkbyteChatContext";
import { noteResumeDownload, RESUME_FILENAME, RESUME_URL } from "../lib/resumeDownload";


/** A pixel heart, beating in the accent blue. */
function Heart({ delay }: { delay: number }) {
  return (
    <svg viewBox="0 0 7 6" aria-hidden="true" className="heart-beat size-9 fill-accent [shape-rendering:crispEdges] xl:size-12" style={{ animationDelay: `${delay}s` }}>
      <path d="M1 0h2v1h1V0h2v1h1v2H6v1H5v1H4v1H3V5H2V4H1V3H0V1h1z" />
    </svg>
  );
}

/** Small line drawings that hint at each heart. */
const motifs = {
  chain: (
    <svg viewBox="0 0 64 20" aria-hidden="true" className="h-5 w-16 stroke-current" fill="none" strokeWidth="1.5">
      <rect x="1" y="3" width="14" height="14" />
      <rect x="25" y="3" width="14" height="14" />
      <rect x="49" y="3" width="14" height="14" />
      <path d="M15 10h10M39 10h10" className="line-flow" strokeDasharray="2 2" />
    </svg>
  ),
  network: (
    <svg viewBox="0 0 64 20" aria-hidden="true" className="h-5 w-16 stroke-current" fill="none" strokeWidth="1.5">
      <path d="M6 14L22 4L38 15L56 5M22 4L56 5M6 14L38 15" className="line-flow" strokeDasharray="2 2" />
      {[[6, 14], [22, 4], [38, 15], [56, 5]].map(([cx, cy]) => (
        <circle key={cx} cx={cx} cy={cy} r="3" className="fill-black" />
      ))}
    </svg>
  ),
  spark: (
    <svg viewBox="0 0 64 20" aria-hidden="true" className="h-5 w-16 stroke-current" fill="none" strokeWidth="1.5">
      <path d="M10 2v16M2 10h16M5 5l10 10M15 5L5 15" />
      <path d="M26 16c6-14 12 4 18-8s8 2 16-4" className="line-flow" strokeDasharray="2 2" />
    </svg>
  ),
};

const hearts = [
  {
    title: "Blockchain",
    body: "Exploring decentralized tech, experimenting with Web3, and building things that question how infrastructure usually works.",
    motif: motifs.chain,
  },
  {
    title: "Communities & connections",
    body: "Hackathons, ecosystems and builder meetups. Learning from the people who are making interesting things.",
    motif: motifs.network,
  },
  {
    title: "Creation",
    body: "Building, designing and experimenting until an idea turns into something you can actually hold.",
    motif: motifs.spark,
  },
];

function MeetInkbyte() {
  const { openChat, mood, beat } = useInkbyteChat();
  return (
    <section aria-labelledby="inkbyte-title" className="grid items-center gap-10 px-5 pt-24 pb-16 md:px-10 lg:grid-cols-[1.05fr_1fr] xl:gap-[5rem] xl:px-[8.3125rem] xl:pt-[9rem] xl:pb-[6.25rem]">
      <div className="mx-auto w-full max-w-[26rem] md:max-w-[30rem] lg:max-w-none">
        <InkbyteCharacter mood={mood} beat={beat} />
      </div>
      <div>
        <p className="font-mono text-sm text-grey xl:text-[1.125rem]">You found the octopus.</p>
        <h1 id="inkbyte-title" className="mt-3 text-[13vw] leading-[1.05] font-medium md:text-7xl xl:text-[6.25rem]">
          Hi, I’m Inkbyte.
        </h1>
        <p className="font-dm mt-6 text-2xl font-medium md:text-3xl xl:mt-8 xl:text-[2.5rem] xl:leading-tight">
          I’m Bhavi’s little digital sidekick.
        </p>
        <p className="font-dm mt-3 text-lg font-light text-body xl:text-[1.5rem]">Curious about Bhavi? Ask me anything.</p>
        <button
          type="button"
          onClick={() => openChat()}
          className="group mt-8 inline-flex min-h-12 cursor-pointer items-center gap-3 rounded-full bg-black py-2 pr-2 pl-6 text-lg text-white transition-colors hover:bg-accent xl:mt-10 xl:py-3 xl:pr-3 xl:pl-8 xl:text-[1.5rem]"
        >
          Ask Inkbyte
          <span className="flex size-9 items-center justify-center rounded-full bg-white text-black transition-transform duration-500 group-hover:rotate-45 xl:size-12">
            <LuArrowUpRight aria-hidden="true" />
          </span>
        </button>
        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Questions to start with">
          {INKBYTE_SUGGESTIONS.slice(0, 3).map((question) => (
            <li key={question}>
              <button
                type="button"
                onClick={() => openChat(question)}
                className="min-h-10 cursor-pointer rounded-full border border-neutral-300 px-4 py-2 text-left text-sm transition-colors hover:border-black hover:bg-black hover:text-white xl:text-[1.125rem]"
              >
                {question}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function WhyOctopus() {
  return (
    <section aria-labelledby="why-title" className="bg-black px-5 py-20 text-white md:px-10 xl:px-[8.3125rem] xl:py-[8rem]">
      <Reveal className="mx-auto max-w-[60rem] text-center">
        <h2 id="why-title" className="text-[12vw] leading-tight font-medium md:text-7xl xl:text-[6.25rem]">
          Why an octopus?
        </h2>
        <p className="font-dm mt-5 text-lg font-light text-soft md:text-xl xl:text-[1.75rem] xl:leading-snug">
          Because apparently, having eight arms and three hearts is a pretty good way to survive in a world that never stops creating.
        </p>
      </Reveal>

      <div className="relative mx-auto mt-12 max-w-[78rem] xl:mt-[5rem]">
        <div className="mx-auto w-40 md:w-48 xl:w-[15rem]">
          <InkbyteCharacter />
        </div>

        {/* Three lines run from the octopus to its three hearts, with a pulse flowing down each. */}
        <svg viewBox="0 0 300 60" preserveAspectRatio="none" aria-hidden="true" className="hidden h-16 w-full md:block xl:h-24">
          {[50, 150, 250].map((x) => (
            <path key={x} d={`M150 0 C150 30 ${x} 30 ${x} 60`} fill="none" stroke="white" strokeOpacity="0.35" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          ))}
          {[50, 150, 250].map((x, index) => (
            <path
              key={`pulse-${x}`}
              d={`M150 0 C150 30 ${x} 30 ${x} 60`}
              fill="none"
              className="heart-pulse stroke-accent"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
              pathLength={100}
              style={{ animationDelay: `${index * 0.6}s` }}
            />
          ))}
        </svg>

        <ol className="mt-8 grid gap-4 border-l border-white/25 pl-5 md:mt-0 md:grid-cols-3 md:gap-5 md:border-l-0 md:pl-0">
          {hearts.map((heart, index) => (
            <li key={heart.title} className="relative flex flex-col items-start md:items-center md:text-center">
              <Heart delay={index * 0.6} />
              <p className="mt-4 font-mono text-xs text-soft xl:text-base">Heart {String(index + 1).padStart(2, "0")}</p>
              <h3 className="font-dm mt-1 text-2xl font-medium xl:text-[2.25rem]">{heart.title}</h3>
              <p className="font-dm mt-2 max-w-[24rem] text-base font-light text-soft xl:text-[1.25rem] xl:leading-snug">{heart.body}</p>
              <div className="mt-4 text-white/70">{heart.motif}</div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Resume() {
  return (
    <section aria-labelledby="resume-title" className="px-5 py-20 md:px-10 xl:px-[8.3125rem] xl:py-[7rem]">
      <Reveal className="flex flex-col gap-8 border-y border-black py-10 md:flex-row md:items-center md:justify-between xl:py-[4rem]">
        <div>
          <h2 id="resume-title" className="text-4xl leading-tight font-medium md:text-6xl xl:text-[5rem]">
            Wanna know more about me?
          </h2>
          <p className="font-dm mt-3 text-lg font-light text-body xl:text-[1.5rem]">Here’s the professional version of my chaos.</p>
        </div>
        <a
          href={RESUME_URL}
          download={RESUME_FILENAME}
          onClick={noteResumeDownload}
          className="group inline-flex min-h-12 w-fit shrink-0 items-center gap-3 rounded-full bg-black py-2 pr-2 pl-6 text-lg text-white transition-colors hover:bg-accent xl:py-3 xl:pr-3 xl:pl-8 xl:text-[1.5rem]"
        >
          Download my resume
          <span className="flex size-9 items-center justify-center rounded-full bg-white text-black transition-transform duration-500 group-hover:translate-y-0.5 xl:size-12">
            <LuArrowDown aria-hidden="true" />
          </span>
        </a>
      </Reveal>
    </section>
  );
}

/** The Portfolio page: Inkbyte, the three hearts, and the resume. */
export function Portfolio() {
  return (
    <>
      <MeetInkbyte />
      <WhyOctopus />
      <Resume />
      <Contact theme="white" />
      <Footer tagline="your friendly" />
    </>
  );
}
