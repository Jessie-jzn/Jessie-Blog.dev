import SiteConfig from "@/site.config";

export function getSiteConfig<T>(key: string, defaultValue?: T): T {
  const value = (SiteConfig as any)[key];

  if (value !== undefined) {
    return value;
  }

  if (defaultValue !== undefined) {
    return defaultValue;
  }

  throw new Error(`Config error: missing required site config value "${key}"`);
}
