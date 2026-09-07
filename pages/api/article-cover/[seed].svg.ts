import type { NextApiRequest, NextApiResponse } from "next";

const PALETTES = [
  ["#112D4E", "#3F72AF", "#DBE2EF"],
  ["#243B2F", "#5C946E", "#D7E8D4"],
  ["#472D30", "#A26769", "#F0D3D3"],
  ["#3C315B", "#8064A2", "#E9E2F5"],
  ["#49392C", "#B47B4B", "#F3E0C7"],
  ["#1F3A4A", "#4E9DA6", "#D7F0F2"],
];

const hashSeed = (value: string) => {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

export default function articleCover(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const seed = String(request.query.seed || "post").slice(0, 160);
  const hash = hashSeed(seed);
  const [ink, accent, paper] = PALETTES[hash % PALETTES.length];
  const angle = hash % 360;
  const circleX = 100 + (hash % 720);
  const circleY = 80 + ((hash >>> 8) % 320);
  const stripeX = 220 + ((hash >>> 16) % 400);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 600" role="img" aria-label="Article cover">
  <rect width="960" height="600" fill="${paper}"/>
  <rect width="960" height="600" fill="${ink}" opacity=".08"/>
  <g transform="rotate(${angle} 480 300)">
    <rect x="${stripeX}" y="-180" width="120" height="960" fill="${accent}" opacity=".65"/>
    <rect x="${stripeX + 152}" y="-180" width="24" height="960" fill="${ink}" opacity=".26"/>
  </g>
  <circle cx="${circleX}" cy="${circleY}" r="175" fill="${ink}" opacity=".9"/>
  <circle cx="${circleX + 42}" cy="${circleY - 30}" r="92" fill="${accent}" opacity=".95"/>
  <path d="M80 500H880" stroke="${ink}" stroke-width="5" opacity=".55"/>
  <path d="M80 532H560" stroke="${ink}" stroke-width="2" opacity=".35"/>
</svg>`;

  response.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
  response.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  response.status(200).send(svg);
}
