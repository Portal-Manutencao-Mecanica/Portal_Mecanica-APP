const IDEMPOTENCY_WINDOW_MS = 30_000;

interface IdempotencyEntry {
  key: string;
  expiresAt: number;
}

const idempotencyEntries = new Map<string, IdempotencyEntry>();

function normalizeValue(value: unknown): unknown {
  if (typeof File !== "undefined" && value instanceof File) {
    return {
      name: value.name,
      size: value.size,
      type: value.type,
      lastModified: value.lastModified,
    };
  }

  if (typeof Blob !== "undefined" && value instanceof Blob) {
    return { size: value.size, type: value.type };
  }

  if (typeof FormData !== "undefined" && value instanceof FormData) {
    return Array.from(value.entries())
      .map(([name, entry]) => [name, normalizeValue(entry)] as const)
      .sort(([firstName], [secondName]) => firstName.localeCompare(secondName));
  }

  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map(normalizeValue);

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([firstKey], [secondKey]) => firstKey.localeCompare(secondKey))
        .map(([key, entry]) => [key, normalizeValue(entry)]),
    );
  }

  return value;
}

function serialize(value: unknown) {
  if (value === undefined) return "";
  return JSON.stringify(normalizeValue(value));
}

function createIdempotencyKey() {
  if (typeof globalThis.crypto !== "undefined" && globalThis.crypto.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `request-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function getIdempotencyKey(
  url: string,
  params: unknown,
  data: unknown,
) {
  const now = Date.now();

  for (const [fingerprint, entry] of idempotencyEntries) {
    if (entry.expiresAt <= now) idempotencyEntries.delete(fingerprint);
  }

  const fingerprint = `${url}|${serialize(params)}|${serialize(data)}`;
  const existingEntry = idempotencyEntries.get(fingerprint);

  if (existingEntry) return existingEntry.key;

  const key = createIdempotencyKey();
  idempotencyEntries.set(fingerprint, {
    key,
    expiresAt: now + IDEMPOTENCY_WINDOW_MS,
  });
  return key;
}
