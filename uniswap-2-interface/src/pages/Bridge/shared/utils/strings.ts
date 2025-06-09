/**
 * Normalizes a string for URL usage by converting to lowercase,
 * trimming whitespace, and replacing spaces with hyphens.
 * @param input The string to normalize
 * @returns The normalized string suitable for URLs
 */
export function normalizeForUrl(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-');
}