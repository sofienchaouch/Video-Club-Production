// Extracts a bare 11-char YouTube video ID from any common URL shape
// (youtu.be, watch?v=, embed/, shorts/) or passes through an already-bare ID.
// Admin-entered values aren't guaranteed to be normalized at save time, so
// every consumer of a stored youtubeId should resolve it through this
// instead of using the raw field directly.
export function extractYoutubeId(raw?: string): string | undefined {
  if (!raw || typeof raw !== "string") return undefined;
  const trimmed = raw.trim();
  if (/^[\w-]{11}$/.test(trimmed)) return trimmed;
  const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : undefined;
}
