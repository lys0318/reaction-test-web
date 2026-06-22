export const locales = ["ko", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ko";

export function isLocale(value: string | undefined): value is Locale {
  return value === "ko" || value === "en";
}

export function getOppositeLocale(locale: Locale): Locale {
  return locale === "ko" ? "en" : "ko";
}

export function replaceLocale(pathname: string, locale: Locale): string {
  const parts = pathname.split("/");
  if (isLocale(parts[1])) {
    parts[1] = locale;
    return parts.join("/") || `/${locale}`;
  }
  return `/${locale}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}
