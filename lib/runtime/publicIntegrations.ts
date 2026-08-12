interface PublicIntegrationEnv {
  NEXT_PUBLIC_GA_ID?: string;
  NEXT_PUBLIC_ADSENSE_ID?: string;
  NEXT_PUBLIC_CLARITY_ID?: string;
  NEXT_PUBLIC_CUSTOM_SCRIPT_URL?: string;
}

const nonEmpty = (value?: string): string | null => {
  const normalized = value?.trim();
  return normalized && normalized !== "undefined" ? normalized : null;
};

const absoluteHttpUrl = (value?: string): string | null => {
  const normalized = nonEmpty(value);
  if (!normalized) {
    return null;
  }

  try {
    const url = new URL(normalized);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
};

export function getPublicIntegrations(env: PublicIntegrationEnv) {
  return {
    gaId: nonEmpty(env.NEXT_PUBLIC_GA_ID),
    adsenseId: nonEmpty(env.NEXT_PUBLIC_ADSENSE_ID),
    clarityId: nonEmpty(env.NEXT_PUBLIC_CLARITY_ID),
    customScriptUrl: absoluteHttpUrl(env.NEXT_PUBLIC_CUSTOM_SCRIPT_URL),
  };
}
