import type { IconType } from "react-icons";
import { FaAws } from "react-icons/fa";
import {
  SiEthereum,
  SiExpress,
  SiGit,
  SiGithub,
  SiGithubactions,
  SiIpfs,
  SiJavascript,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiOpenzeppelin,
  SiPython,
  SiReact,
  SiRust,
  SiSolidity,
  SiStellar,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
  SiVite,
} from "react-icons/si";

/** Every skill always shows its name. The icon is optional. */
export type SkillItem = { label: string; Icon?: IconType };

export type SkillGroup = {
  title: string;
  body: string;
  items: SkillItem[];
  /** The lead card, twice the width of the others. */
  lead?: boolean;
};

const javascript = { label: "JavaScript", Icon: SiJavascript };
const typescript = { label: "TypeScript", Icon: SiTypescript };
const solidity = { label: "Solidity", Icon: SiSolidity };
const rust = { label: "Rust", Icon: SiRust };

/** In order of importance. Keep the count at 11 so the grid ends on a full row. */
export const skillGroups: SkillGroup[] = [
  {
    title: "Blockchain Development",
    body: "Writing and deploying contracts on EVM chains and on Stellar with Soroban, for escrow, royalties, and inheritance.",
    lead: true,
    items: [
      { label: "Ethereum", Icon: SiEthereum },
      solidity,
      { label: "Stellar", Icon: SiStellar },
      rust,
      { label: "Soroban" },
      { label: "EVM" },
      { label: "Hardhat" },
      { label: "OpenZeppelin", Icon: SiOpenzeppelin },
    ],
  },
  {
    title: "Web3 Infrastructure",
    body: "Wallet connections and decentralized storage that keep the blockchain out of the user’s way.",
    items: [
      { label: "IPFS", Icon: SiIpfs },
      { label: "Pinata" },
      { label: "Freighter" },
      { label: "RainbowKit" },
      { label: "Wagmi" },
      { label: "Viem" },
    ],
  },
  {
    title: "Front-End Development",
    body: "Responsive, component-driven interfaces, including the wallet flows on top of smart contracts.",
    items: [
      { label: "React", Icon: SiReact },
      { label: "Next.js", Icon: SiNextdotjs },
      { label: "Vite", Icon: SiVite },
      { label: "Tailwind CSS", Icon: SiTailwindcss },
    ],
  },
  {
    title: "Back-End Development",
    body: "Server-side logic and APIs that connect applications, databases, and contracts.",
    items: [{ label: "Node.js", Icon: SiNodedotjs }, { label: "Express", Icon: SiExpress }, { label: "REST APIs" }],
  },
  {
    title: "Programming Languages",
    body: "Solving problems across the stack, from contract code to scripts and application logic.",
    items: [{ label: "Python", Icon: SiPython }, javascript, typescript, solidity, rust],
  },
  {
    title: "Database Management",
    body: "Designing and managing storage for the data that belongs off-chain.",
    items: [{ label: "MongoDB", Icon: SiMongodb }, { label: "Supabase", Icon: SiSupabase }, { label: "SQL" }],
  },
  {
    title: "Cloud & DevOps",
    body: "Version control, CI/CD pipelines, and deployment on modern cloud platforms.",
    items: [
      { label: "Git", Icon: SiGit },
      { label: "GitHub", Icon: SiGithub },
      { label: "CI/CD", Icon: SiGithubactions },
      { label: "Vercel", Icon: SiVercel },
      { label: "AWS Fundamentals", Icon: FaAws },
    ],
  },
  {
    title: "Security",
    body: "Encrypting data off-chain, verifying it on-chain, and reviewing contracts before release.",
    items: [{ label: "AES-256-GCM" }, { label: "SHA-256" }, { label: "Security Review" }],
  },
  {
    title: "Testing & Debugging",
    body: "Testing core workflows and tracking down issues before they reach users.",
    items: [{ label: "Unit Tests" }, { label: "Debugging" }, { label: "Code Review" }],
  },
  {
    title: "AI & Machine Learning",
    body: "Connecting AI components to real application workflows, such as automated invoice parsing.",
    items: [{ label: "AI/ML Fundamentals" }, { label: "AI Integration" }, { label: "Agentic AI" }],
  },
  {
    title: "Core Computer Science",
    body: "The coursework underneath it all, from how ledgers agree to how data is structured.",
    items: [
      { label: "Cryptography" },
      { label: "Distributed Ledgers" },
      { label: "Data Structures & Algorithms" },
      { label: "OOP" },
    ],
  },
];
