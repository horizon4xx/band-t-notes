export type TeeRecord = { band: string; date: string; count: number };
export type Breakdown = { name: string; count: number };
export type DailyCount = { date: string; count: number; items: Breakdown[] };
export type StatisticsData = {
  total: number; ranking: Breakdown[]; days: DailyCount[]; period: string;
};

const nameKey = (name: string) => name.normalize('NFKC').trim().replace(/\s+/g, ' ').toLowerCase();
export function rankRecords(records: readonly TeeRecord[]): Breakdown[] {
  const groups = new Map<string, Breakdown>();
  for (const record of records) {
    const key = nameKey(record.band);
    const item = groups.get(key) ?? { name: record.band, count: 0 };
    item.count += record.count;
    groups.set(key, item);
  }
  return [...groups.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function buildStatistics(records: readonly TeeRecord[], period: string, today: string): StatisticsData {
  const filtered = records.filter(record => period !== '今月' || record.date.startsWith(today.slice(0, 7)));
  const byDate = new Map<string, TeeRecord[]>();
  for (const record of filtered) byDate.set(record.date, [...(byDate.get(record.date) ?? []), record]);
  const dates = [...byDate.keys()].sort();
  const days: DailyCount[] = [];
  if (dates.length) {
    const start = period === '今月' ? `${today.slice(0, 7)}-01` : dates[0];
    const end = dates[dates.length - 1] > today ? dates[dates.length - 1] : today;
    // UTC arithmetic preserves calendar days across timezone and daylight-saving changes.
    for (let time = Date.parse(`${start}T00:00:00Z`); time <= Date.parse(`${end}T00:00:00Z`); time += 86400000) {
      const date = new Date(time).toISOString().slice(0, 10);
      const items = rankRecords(byDate.get(date) ?? []);
      days.push({ date, count: items.reduce((sum, item) => sum + item.count, 0), items });
    }
  }
  return { total: filtered.reduce((sum, record) => sum + record.count, 0), ranking: rankRecords(filtered), days, period };
}

export const chartMaximum = (days: readonly DailyCount[]) => Math.max(4, Math.ceil(Math.max(0, ...days.map(day => day.count)) / 4) * 4);
export const shortDate = (date: string) => `${Number(date.slice(5, 7))}/${Number(date.slice(8, 10))}`;

