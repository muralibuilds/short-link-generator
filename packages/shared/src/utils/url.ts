export function buildShortUrl(base: string, urlId: string): string {
  const normalizedBase = base.replace(/\/$/, "");
  return `${normalizedBase}/api/short/${urlId}`;
}

export function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
