import { ARTIST_EVENTS } from './artist-events';
import { ARTIST_TRAITS } from './artist-traits';

export type BandHistory = { band: string; count: number; date: string };
export const artistKey = (s: string) => s.normalize('NFKC').toLowerCase()
  .replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60))
  .replace(/[^\p{L}\p{N}]/gu, '');

const traits = new Map(Object.entries(ARTIST_TRAITS).map(([name, value]) => [artistKey(name), value]));
const events = new Map<string, Map<string, number>>();
for (const event of ARTIST_EVENTS) {
  // Smaller shared bills are a stronger clue than a large, broad festival.
  const weight = 1 / Math.sqrt(event.names.length);
  for (const name of event.names) {
    const list = events.get(artistKey(name)) || new Map<string, number>();
    list.set(event.source, weight);
    events.set(artistKey(name), list);
  }
}

const accumulate = (map: Map<string, number>, label: string, value: number) => map.set(label, (map.get(label) || 0) + value);
const norm = (map: Map<string, number>) => Math.sqrt([...map.values()].reduce((n, value) => n + value * value, 0));
function cosine(a: Map<string, number>, b: Map<string, number>, aNorm: number) {
  const denominator = aNorm * norm(b);
  if (!denominator) return 0;
  let dot = 0;
  for (const [label, value] of b) dot += value * (a.get(label) || 0);
  return dot / denominator;
}

export function rankByHistory(history: readonly (BandHistory | string)[], resolveName: (name: string) => string | undefined, now = new Date()) {
  const usage = new Map<string, number>();
  for (const entry of history) {
    const resolved = resolveName(typeof entry === 'string' ? entry : entry.band);
    if (!resolved) continue;
    let weight = 1;
    if (typeof entry !== 'string') {
      const parts = entry.date.split('-').map(Number);
      const recorded = new Date(parts[0], parts[1] - 1, parts[2], 12).getTime();
      const age = Number.isFinite(recorded) ? Math.max(0, (now.getTime() - recorded) / 86400000) : 0;
      const recency = 0.15 + 0.85 * Math.pow(0.5, age / 60);
      const count = Number.isFinite(entry.count) ? Math.max(1, Math.min(25, entry.count)) : 1;
      weight = Math.sqrt(count) * recency;
    }
    accumulate(usage, artistKey(resolved), weight);
  }
  const genres = new Map<string, number>();
  const formations = new Map<string, number>();
  const sharedEvents = new Map<string, number>();
  for (const [name, sightings] of usage) {
    const weight = Math.log1p(sightings);
    const info = traits.get(name);
    for (const genre of info?.genres || []) accumulate(genres, genre, weight / Math.sqrt(info!.genres.length));
    if (info?.formation) accumulate(formations, info.formation, weight);
    for (const [event, strength] of events.get(name) || []) accumulate(sharedEvents, event, strength * weight);
  }
  const genreNorm = norm(genres);
  const eventNorm = norm(sharedEvents);
  const formationTotal = [...formations.values()].reduce((a, b) => a + b, 0);
  const maxUsage = Math.max(1, ...usage.values());
  return (name: string) => {
    const key = artistKey(name);
    const info = traits.get(key);
    const genreSimilarity = cosine(genres, new Map((info?.genres || []).map(genre => [genre, 1])), genreNorm);
    const eventSimilarity = cosine(sharedEvents, events.get(key) || new Map(), eventNorm);
    const formationSimilarity = info?.formation && formationTotal ? (formations.get(info.formation) || 0) / formationTotal : 0;
    const familiarity = Math.log1p(usage.get(key) || 0) / Math.log1p(maxUsage);
    return genreSimilarity * 0.65 + eventSimilarity * 0.2 + formationSimilarity * 0.03 + familiarity * 0.25;
  };
}
