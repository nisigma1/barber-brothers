export function normalizeKosovoPhone(value: string): string | null {
  const sanitized = value.replace(/[^\d+]/g, "");

  if (/^\+383\d{8}$/.test(sanitized)) {
    return sanitized;
  }

  if (/^0\d{8}$/.test(sanitized)) {
    return `+383${sanitized.slice(1)}`;
  }

  return null;
}
