import { artistKey, rankByHistory, type BandHistory } from './history-ranking';
import { initialBandPriority } from './candidate-priority';
import { LIVEHOUSE_BANDS } from './livehouse-bands';
import { FESTIVAL_BANDS } from './festival-bands';
import { JAPANESE_BANDS } from './japanese-bands';

export const BAND_NAMES = [
  { name: 'NIRVANA', aliases: ['ニルヴァーナ', 'ニルバーナ'] },
  { name: 'METALLICA', aliases: ['メタリカ'] },
  { name: 'The Rolling Stones', aliases: ['ローリングストーンズ', 'ストーンズ'] },
  { name: 'The Beatles', aliases: ['ビートルズ'] },
  { name: 'QUEEN', aliases: ['クイーン'] },
  { name: 'AC/DC', aliases: ['エーシーディーシー'] },
  { name: 'Guns N’ Roses', aliases: ['ガンズアンドローゼズ', 'ガンズ'] },
  { name: 'Red Hot Chili Peppers', aliases: ['レッドホットチリペッパーズ', 'レッチリ', 'RHCP'] },
  { name: 'Pink Floyd', aliases: ['ピンクフロイド'] },
  { name: 'Led Zeppelin', aliases: ['レッドツェッペリン'] },
  { name: 'Iron Maiden', aliases: ['アイアンメイデン'] },
  { name: 'Black Sabbath', aliases: ['ブラックサバス'] },
  { name: 'SLAYER', aliases: ['スレイヤー'] },
  { name: 'Slipknot', aliases: ['スリップノット'] },
  { name: 'KISS', aliases: ['キッス'] },
  { name: 'Ramones', aliases: ['ラモーンズ'] },
  { name: 'Sex Pistols', aliases: ['セックスピストルズ'] },
  { name: 'The Clash', aliases: ['クラッシュ'] },
  { name: 'Joy Division', aliases: ['ジョイディヴィジョン'] },
  { name: 'Sonic Youth', aliases: ['ソニックユース'] },
  { name: 'Oasis', aliases: ['オアシス'] },
  { name: 'Radiohead', aliases: ['レディオヘッド'] },
  { name: 'Green Day', aliases: ['グリーンデイ'] },
  { name: 'Foo Fighters', aliases: ['フーファイターズ'] },
  { name: 'Linkin Park', aliases: ['リンキンパーク'] },
  { name: 'Rage Against the Machine', aliases: ['レイジアゲインストザマシーン', 'RATM'] },
  { name: 'Arctic Monkeys', aliases: ['アークティックモンキーズ'] },
  { name: 'The Strokes', aliases: ['ストロークス'] },
  { name: 'My Chemical Romance', aliases: ['マイケミカルロマンス', 'マイケミ', 'MCR'] },
  { name: 'Bring Me the Horizon', aliases: ['ブリングミーザホライズン', 'BMTH'] },
  { name: 'Grateful Dead', aliases: ['グレイトフルデッド'] },
  { name: 'Motörhead', aliases: ['モーターヘッド', 'Motorhead'] },
  { name: 'Nine Inch Nails', aliases: ['ナインインチネイルズ', 'NIN'] },
  { name: 'DEFTONES', aliases: ['デフトーンズ'] },
];

const key = artistKey;

type Candidate = { name: string; aliases: string[]; used: boolean };
const catalog = new Map<string, Candidate>();
for (const band of [...BAND_NAMES, ...JAPANESE_BANDS, ...FESTIVAL_BANDS, ...LIVEHOUSE_BANDS]) {
  const existing = catalog.get(key(band.name));
  catalog.set(key(band.name), {
    name: band.name,
    aliases: [...new Set([...(existing?.aliases || []), ...band.aliases])],
    used: false,
  });
}
export const BAND_CANDIDATE_COUNT = catalog.size;
const domestic = new Set([...JAPANESE_BANDS, ...FESTIVAL_BANDS, ...LIVEHOUSE_BANDS].map(b => key(b.name)));
const aliasIndex = new Map<string, string>();
for (const candidate of catalog.values()) {
  for (const alias of [candidate.name, ...candidate.aliases]) {
    if (!aliasIndex.has(key(alias))) aliasIndex.set(key(alias), candidate.name);
  }
}
const resolveName = (name: string) => catalog.get(key(name))?.name ?? aliasIndex.get(key(name));
type History = readonly (BandHistory | string)[];
const historyCache = new WeakMap<History, { day: string; score: (name: string) => number; used: Set<string> }>();
function historyContext(history: History) {
  const now = new Date();
  const day = [now.getFullYear(), now.getMonth(), now.getDate()].join('-');
  const cached = historyCache.get(history);
  if (cached?.day === day) return cached;
  const used = new Set(history.map(entry => resolveName(typeof entry === 'string' ? entry : entry.band)).filter((name): name is string => !!name).map(key));
  const value = { day, score: rankByHistory(history, resolveName, now), used };
  historyCache.set(history, value);
  return value;
}

export function suggestBands(input: string, history: History) {
  const query = key(input);
  if (!query) return [];
  const context = historyContext(history);
  const personal = new Map<string, Candidate & { custom: boolean; frequency: number }>();
  for (const entry of history) {
    const name = (typeof entry === 'string' ? entry : entry.band).trim();
    if (!key(name) || resolveName(name)) continue;
    const previous = personal.get(key(name));
    personal.set(key(name), { name: previous?.name ?? name, aliases: [], used: true, custom: true,
      frequency: (previous?.frequency ?? 0) + (typeof entry === 'string' ? 1 : entry.count) });
  }
  return [...catalog.values()].map(candidate => ({ ...candidate, custom: false, frequency: 0 })).concat([...personal.values()])
    .map(candidate => {
      const names = [candidate.name, ...candidate.aliases].map(key);
      const match = names.some(name => name === query) ? 3
        : names.some(name => name.startsWith(query)) ? 2
        : names.some(name => name.includes(query)) ? 1 : 0;
      return { ...candidate, used: candidate.custom || context.used.has(key(candidate.name)), match, affinity: context.score(candidate.name) };
    })
    .filter(candidate => candidate.match > 0)
    .sort((a, b) => b.match - a.match
      || Number(b.custom) - Number(a.custom)
      || b.frequency - a.frequency
      || b.affinity - a.affinity
      || initialBandPriority(b.name) - initialBandPriority(a.name)
      || Number(domestic.has(key(b.name))) - Number(domestic.has(key(a.name)))
      || a.name.localeCompare(b.name))
    .slice(0, 8);
}
