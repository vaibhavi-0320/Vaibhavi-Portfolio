export const profile = {
  name: "Vaibhavi Agale",
  role: "Blockchain Developer",
  location: "Pune, India",
  portrait: "/hero.webp",
  bigName: "Bhaviiiiiiiiiiiiii",
  statement:
    "Blockchain Technology student building, testing, and deploying full-stack and distributed systems on Ethereum and Stellar",
  intro:
    "Driven by curiosity and a love for building, I create smart contracts and the full-stack apps around them. As a student, I’m always learning and exploring new ideas.",
  aside:
    "Studying Blockchain Technology at Savitribai Phule Pune University, I work end to end across contracts, APIs, databases, and interfaces, and I enjoy experimenting along the way.",
  worksBlurb:
    "HERE’S A SELECTION OF PROJECTS THAT SHOW HOW I BUILD ON-CHAIN, FROM CONTRACTS TO INTERFACES.",
};

export const contact = {
  email: "vaibhaviagale7799@gmail.com",
  github: "https://github.com/vaibhavi-0320",
  linkedin: "https://www.linkedin.com/in/vaibhavi-agale-2546092b8",
  x: "https://x.com/Vaibhavi_Agale",
};

export type Project = {
  slug: string;
  title: string;
  /** Where it runs, shown small beside the title. */
  chain: string;
  year: string;
  summary: string;
  image: string;
  /** Set for a centred logo on black instead of a full-bleed screenshot. */
  logo?: boolean;
  live?: string;
  repo: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "fintrix",
    title: "Fintrix",
    chain: "Stellar",
    year: "2025",
    summary:
      "Invoice financing with automated invoice parsing and escrow logic. A pre-launch review found a critical fund-routing bug, so I withheld release.",
    image: "/projects/fintrix.webp",
    live: "https://fintrix-invoicee.vercel.app/",
    repo: "https://github.com/vaibhavi-0320/FINTRIX",
    featured: true,
  },
  {
    slug: "proofveil",
    title: "ProofVeil",
    chain: "Midnight",
    year: "2026",
    summary:
      "Confidential credentials on Midnight. Prove a document is valid, or that a private value passes a check like age over 18, without revealing it.",
    image: "/projects/proofveil.webp",
    live: "https://proofveil.vercel.app/",
    repo: "https://github.com/vaibhavi-0320/proofveil",
    featured: true,
  },
  {
    slug: "smartshelf",
    title: "SmartShelf",
    chain: "Ethereum",
    year: "2025",
    summary:
      "An NFT book marketplace with automated on-chain royalty payouts through ERC-721, and decentralized content storage on IPFS.",
    image: "/projects/smartshelf-logo.webp",
    logo: true,
    // The live deploy is down (missing Supabase env vars). Add `live` once it is back.
    repo: "https://github.com/vaibhavi-0320/SmartShelf",
    featured: true,
  },
  {
    slug: "stellarfund",
    title: "StellarFund",
    chain: "Stellar",
    year: "2025",
    summary:
      "A decentralized escrow platform on Soroban contracts, with unit tests for its core workflows, a CI/CD pipeline, and Freighter wallet signing.",
    image: "/projects/stellarfund.webp",
    live: "https://steller-fund.vercel.app/",
    repo: "https://github.com/vaibhavi-0320/StellerFund",
    featured: true,
  },
  {
    slug: "vaultis",
    title: "Vaultis",
    chain: "Ethereum",
    year: "2026",
    summary:
      "Digital inheritance with a dead-man switch. Data stays encrypted off-chain with AES-256-GCM and is verified on-chain with SHA-256.",
    image: "/projects/vaultis.webp",
    live: "https://vaultis-six.vercel.app/",
    repo: "https://github.com/vaibhavi-0320/Vaultis",
  },
  {
    slug: "minebreak",
    title: "Minebreak",
    chain: "Ethereum",
    year: "2026",
    summary:
      "A browser voxel game with on-chain PvP duels. A commit-reveal Solidity contract keeps each move hidden until both players commit. Still in progress.",
    image: "/projects/minebreak.webp",
    live: "https://minebreak.vercel.app/",
    repo: "https://github.com/vaibhavi-0320/Minebreak",
  },
];

/** The four shown on the home page. The rest open under "Explore more". */
export const featuredProjects = projects.filter((project) => project.featured);
export const moreProjects = projects.filter((project) => !project.featured);

export type EventPhoto = { src: string; width: number; height: number; event: string; alt: string };

export const eventPhotos: EventPhoto[] = [
  { src: "/events/ibw-stage.webp", width: 800, height: 1067, event: "India Blockchain Week 2026", alt: "Vaibhavi at the India Blockchain Week 2026 stage in Mumbai" },
  { src: "/events/build-station.webp", width: 800, height: 1059, event: "Stellar Build Station, Pune", alt: "Vaibhavi beside the Stellar Build Station Pune banner" },
  { src: "/events/samsung.webp", width: 403, height: 703, event: "Samsung Innovation Campus", alt: "Vaibhavi beside the Samsung Innovation Campus banner at Savitribai Phule Pune University" },
  { src: "/events/ibw-team.webp", width: 800, height: 600, event: "India Blockchain Week 2026", alt: "Vaibhavi with friends holding their India Blockchain Week passes" },
  { src: "/events/hackathon.webp", width: 546, height: 409, event: "Hackathon", alt: "Vaibhavi and teammates with their laptops at a hackathon" },
  { src: "/events/midknight.webp", width: 795, height: 544, event: "Midknight Hackathon", alt: "Vaibhavi and a teammate giving a thumbs up at the Midknight Hackathon" },
  { src: "/events/ibw-crowd.webp", width: 800, height: 600, event: "India Blockchain Week 2026", alt: "A group selfie in the busy India Blockchain Week hall" },
  { src: "/events/ibw-friends.webp", width: 800, height: 600, event: "India Blockchain Week 2026", alt: "Vaibhavi with two friends at India Blockchain Week" },
  { src: "/events/ibw-booth.webp", width: 800, height: 600, event: "India Blockchain Week 2026", alt: "Vaibhavi and a friend at an event booth" },
  { src: "/events/ibw-selfie.webp", width: 800, height: 600, event: "India Blockchain Week 2026", alt: "Vaibhavi and two friends at India Blockchain Week" },
];

export type JourneyItem = { when: string; title: string; detail: string };

export const journey: JourneyItem[] = [
  {
    when: "Present",
    title: "Operations & Data Analytics Intern, Cubicl",
    detail: "Managing client relationships, analyzing sales data to spot trends, and supporting daily operations.",
  },
  {
    when: "2026",
    title: "Midnight Network, New Moon to Full Moon",
    detail: "Built ProofVeil with Compact smart contracts and zero-knowledge circuits on Midnight Preprod.",
  },
  {
    when: "2026",
    title: "Rise In, Stellar Journey to Mastery",
    detail: "Built and deployed production-grade dApps on Stellar and Soroban, including StellarFund.",
  },
  {
    when: "2026",
    title: "Stellar Build Station, Pune",
    detail: "Designed and built EtchX, an original product, as an in-person Stellar builder community member.",
  },
  {
    when: "2026",
    title: "India Blockchain Week, Mumbai",
    detail: "Meeting builders and exploring the ecosystem.",
  },
  {
    when: "Sep 2025",
    title: "Aptos Hackathon",
    detail: "Built and submitted a blockchain project on Aptos within the hackathon timeframe.",
  },
  {
    when: "2025",
    title: "Samsung Innovation Campus, AI/ML",
    detail: "Structured coursework in AI/ML fundamentals, applied to real-world problem solving.",
  },
  {
    when: "Expected Apr 2028",
    title: "Bachelor’s in Blockchain Technology",
    detail: "Savitribai Phule Pune University.",
  },
];
