import { notebookAccent, type NotebookMode } from '@/constants/notebook-modes';
import { chartMaximum, shareStatistics, shortDate, type StatisticsData } from './statistics';

export function createStatisticsImage(source: StatisticsData, mode: NotebookMode): Promise<Blob> {
  const data = shareStatistics(source);
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1050 + Math.max(1, data.ranking.length) * 112;
  const ctx = canvas.getContext('2d');
  if (!ctx) return Promise.reject(new Error('画像を作成できませんでした。'));
  const accent = notebookAccent(mode);
  ctx.fillStyle = '#111116'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  const text = (value: string, x: number, y: number, size = 30, color = '#F7F7FB', bold = false) => {
    ctx.font = `${bold ? '800' : '400'} ${size}px sans-serif`; ctx.fillStyle = color; ctx.fillText(value, x, y);
  };
  const wrapped = (value: string, x: number, y: number, width: number) => {
    const lines: string[] = []; let line = '';
    ctx.font = '600 30px sans-serif';
    for (const character of value) {
      if (ctx.measureText(line + character).width > width && line) { lines.push(line); line = character; }
      else line += character;
    }
    lines.push(line);
    lines.slice(0, 2).forEach((item, index) => {
      if (index === 1 && lines.length > 2) {
        while (item && ctx.measureText(item + '…').width > width) item = item.slice(0, -1);
        item += '…';
      }
      text(item, x, y + index * 37, 30, '#F7F7FB', true);
    });
  };
  ctx.fillStyle = accent; ctx.fillRect(64, 64, 74, 10);
  text(mode === 'festival' ? 'FES T NOTES' : 'BAND T NOTES', 64, 150, 62, '#F7F7FB', true);
  text(`街で見つけたTシャツの記録 · ${data.period}`, 64, 207, 28, '#B9B9C6');
  text(source.days.length ? `${source.days[0].date} — ${source.days[source.days.length - 1].date}` : 'まだ記録がありません', 64, 254, 25, '#9292A3');
  text(String(data.total), 64, 390, 98, accent, true); text('見かけた枚数', 64, 438, 28, '#B9B9C6');
  text(String(data.uniqueCount), 620, 390, 98, accent, true); text(mode === 'festival' ? 'フェス数' : 'バンド数', 620, 438, 28, '#B9B9C6');
  text(data.chartLabel, 64, 525, 32, '#F7F7FB', true);
  text('縦軸：枚数 ／ 横軸：日にち', 64, 571, 24, '#9292A3');
  const left = 130, right = 1000, top = 620, bottom = 830;
  const max = chartMaximum(data.days);
  for (let step = 0; step <= 4; step++) {
    const y = bottom - (bottom - top) * step / 4;
    ctx.strokeStyle = '#343440'; ctx.beginPath(); ctx.moveTo(left, y); ctx.lineTo(right, y); ctx.stroke();
    text(String(max * step / 4), 65, y + 8, 22, '#9292A3');
  }
  if (data.days.length) {
    const slot = (right - left) / data.days.length;
    data.days.forEach((day, index) => {
      const height = day.count / max * (bottom - top);
      ctx.fillStyle = accent; ctx.fillRect(left + index * slot + slot * 0.15, bottom - Math.max(2, height), slot * 0.7, Math.max(2, height));
      if (index % Math.max(1, Math.ceil(data.days.length / 6)) === 0 || index === data.days.length - 1) {
        text(shortDate(day.date), left + index * slot - 12, bottom + 40, 20, '#B9B9C6');
      }
    });
  } else text('記録するとグラフが表示されます', 210, 740, 28, '#9292A3');
  text(data.rankingLabel, 64, 950, 32, '#F7F7FB', true);
  data.ranking.forEach((item, index) => {
    const y = 1020 + index * 112;
    wrapped(`${index + 1}. ${item.name}`, 64, y, 760);
    ctx.textAlign = 'right'; text(`${item.count}枚`, 1010, y, 32, accent, true); ctx.textAlign = 'left';
    ctx.fillStyle = '#343440'; ctx.fillRect(64, y + 76, 950, 5);
    ctx.fillStyle = accent; ctx.fillRect(64, y + 76, 950 * item.count / data.ranking[0].count, 5);
  });
  if (!data.ranking.length) text('街で見つけたら、その場で記録しよう。', 64, 1030, 28, '#B9B9C6');
  text('街で出会った音楽を、記録する。', 64, canvas.height - 32, 24, '#9292A3');
  return new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('画像を作成できませんでした。')), 'image/png'));
}
