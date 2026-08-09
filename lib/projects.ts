export type Project = {
  id: string;
  title: string;
  summary: string;
  role: string;
  stack: string[];
  status: "ongoing" | "experience" | "exploring";
  href?: string;
  repository?: string;
};

export const PROJECTS: Project[] = [
  {
    id: "jessie-blog",
    title: "Jessie on the road",
    summary: "A bilingual personal publication for writing about AI, technology, WHV, travel, and life.",
    role: "Product, design, and frontend development",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Notion API"],
    status: "ongoing",
    href: "/",
    repository: "https://github.com/Jessie-jzn",
  },
  {
    id: "frontend-experience",
    title: "Frontend practice",
    summary: "Eight years of frontend experience focused on turning real product needs into clear, maintainable web interfaces.",
    role: "Frontend engineer",
    stack: ["React", "Next.js", "TypeScript", "Web performance"],
    status: "experience",
  },
  {
    id: "ai-exploration",
    title: "AI product exploration",
    summary: "An ongoing exploration of how AI can make tools, content workflows, and everyday products more useful.",
    role: "Independent exploration",
    stack: ["LLM", "Prompt design", "Product prototyping"],
    status: "exploring",
  },
];
