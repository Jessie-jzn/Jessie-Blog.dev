export const ARTICLE_IMAGE_FALLBACK = "/images/default.jpg";
const IMAGE_PROXY_PATH = "/api/image-proxy/";
const LEGACY_IMAGE_PROXY_PATH = "/api/image-proxy";
const COVER_PALETTES = [
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

export function generatedArticleCoverSource(seed?: string | null): string | null {
  const normalizedSeed = seed?.trim();
  if (!normalizedSeed) return null;

  const hash = hashSeed(normalizedSeed);
  const [ink, accent, paper] = COVER_PALETTES[hash % COVER_PALETTES.length];
  const angle = hash % 360;
  const circleX = 100 + (hash % 720);
  const circleY = 80 + ((hash >>> 8) % 320);
  const stripeX = 220 + ((hash >>> 16) % 400);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 600" role="img" aria-label="Article cover"><rect width="960" height="600" fill="${paper}"/><rect width="960" height="600" fill="${ink}" opacity=".08"/><g transform="rotate(${angle} 480 300)"><rect x="${stripeX}" y="-180" width="120" height="960" fill="${accent}" opacity=".65"/><rect x="${stripeX + 152}" y="-180" width="24" height="960" fill="${ink}" opacity=".26"/></g><circle cx="${circleX}" cy="${circleY}" r="175" fill="${ink}" opacity=".9"/><circle cx="${circleX + 42}" cy="${circleY - 30}" r="92" fill="${accent}" opacity=".95"/><path d="M80 500H880" stroke="${ink}" stroke-width="5" opacity=".55"/><path d="M80 532H560" stroke="${ink}" stroke-width="2" opacity=".35"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const isPrivateIpv4 = (hostname: string): boolean => {
  const octets = hostname.split(".").map(Number);
  if (
    octets.length !== 4 ||
    octets.some((octet) => !Number.isInteger(octet) || octet < 0 || octet > 255)
  ) {
    return false;
  }

  const [first, second] = octets;
  return (
    first === 0 ||
    first === 10 ||
    first === 127 ||
    (first === 169 && second === 254) ||
    (first === 172 && second >= 16 && second <= 31) ||
    (first === 192 && second === 168)
  );
};

export const isPrivateNetworkAddress = (address: string): boolean => {
  const ipv4Mapped = address.toLowerCase().match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (ipv4Mapped) {
    return isPrivateIpv4(ipv4Mapped[1]);
  }
  const normalized = address.toLowerCase().replace(/^\[|\]$/g, "");
  return (
    normalized === "::1" ||
    normalized.startsWith("fc") ||
    normalized.startsWith("fd") ||
    normalized.startsWith("fe80:") ||
    isPrivateIpv4(normalized)
  );
};

const isLocalHostname = (hostname: string): boolean => {
  const normalized = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  return (
    normalized === "localhost" ||
    normalized.endsWith(".localhost") ||
    normalized.endsWith(".local") ||
    isPrivateNetworkAddress(normalized)
  );
};

export function validateRemoteImageUrl(value: string): URL | null {
  try {
    const url = new URL(value);
    if (
      (url.protocol !== "http:" && url.protocol !== "https:") ||
      !url.hostname ||
      url.username ||
      url.password ||
      isLocalHostname(url.hostname)
    ) {
      return null;
    }
    return url;
  } catch {
    return null;
  }
}

export function articleImageSource(value?: string | null, seed?: string | null): string {
  const fallback = generatedArticleCoverSource(seed) || ARTICLE_IMAGE_FALLBACK;
  const source = value?.trim();
  if (!source) {
    return fallback;
  }
  if (source === LEGACY_IMAGE_PROXY_PATH) {
    return IMAGE_PROXY_PATH;
  }
  if (source.startsWith(`${LEGACY_IMAGE_PROXY_PATH}?`)) {
    return `${IMAGE_PROXY_PATH}${source.slice(LEGACY_IMAGE_PROXY_PATH.length)}`;
  }
  if (source === IMAGE_PROXY_PATH || source.startsWith(`${IMAGE_PROXY_PATH}?`)) {
    return source;
  }
  if (source.startsWith("/") && !source.startsWith("//")) {
    return source;
  }

  const remote = validateRemoteImageUrl(source);
  return remote
    ? `${IMAGE_PROXY_PATH}?url=${encodeURIComponent(remote.toString())}`
    : fallback;
}
