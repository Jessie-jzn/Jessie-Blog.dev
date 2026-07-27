export const ARTICLE_IMAGE_FALLBACK = "/images/default.jpg";
const IMAGE_PROXY_PATH = "/api/image-proxy";

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

export function articleImageSource(value?: string | null): string {
  const source = value?.trim();
  if (!source) {
    return ARTICLE_IMAGE_FALLBACK;
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
    : ARTICLE_IMAGE_FALLBACK;
}
