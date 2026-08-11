export type Project = {
  id: string;
  stack: string[];
  status: "ongoing" | "experience" | "exploring";
  href?: string;
  repository?: string;
};

export const PROJECTS: Project[] = [
  {
    id: "jessie-blog",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Notion API"],
    status: "ongoing",
    href: "/",
    repository: "https://github.com/Jessie-jzn",
  },
  {
    id: "frontend-experience",
    stack: ["React", "Next.js", "TypeScript", "Web performance"],
    status: "experience",
  },
  {
    id: "ai-exploration",
    stack: ["LLM", "Prompt design", "Product prototyping"],
    status: "exploring",
  },
];
