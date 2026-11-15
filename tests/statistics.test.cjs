const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const test = require('node:test');
const ts = require('typescript');
const moduleUnderTest = { exports: {} };
new Function('exports', 'module', ts.transpileModule(fs.readFileSync(path.resolve(__dirname, '../src/utils/statistics.ts'), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText)(moduleUnderTest.exports, moduleUnderTest);
const { buildStatistics, chartMaximum } = moduleUnderTest.exports;
const record = (band, date, count) => ({ band, date, count });

test('daily totals count shirts, fill zero days and aggregate same-name entries', () => {
  const data = buildStatistics([record('Knosis', '2026-11-01', 3), record('ＫＮＯＳＩＳ', '2026-11-01', 2), record('Other', '2026-11-03', 1)], 'すべて', '2026-11-03');
  assert.equal(data.total, 6);
  assert.deepEqual(data.days.map(day => day.count), [5, 0, 1]);
  assert.deepEqual(data.days[0].items, [{ name: 'Knosis', count: 5 }]);
  assert.equal(data.ranking.length, 2);
  assert.equal(chartMaximum(data.days), 8);
});
test('current month excludes older data and handles month boundaries and leap days', () => {
  const records = [record('A', '2024-02-28', 2), record('B', '2024-03-01', 3)];
  const month = buildStatistics(records, '今月', '2024-03-02');
  assert.equal(month.total, 3);
  assert.deepEqual(month.days.map(day => day.date), ['2024-03-01', '2024-03-02']);
  const all = buildStatistics(records, 'すべて', '2024-03-02');
  assert.equal(all.days[1].date, '2024-02-29');
  assert.equal(all.days[1].count, 0);
});
test('empty records have zero totals and no chart days', () => {
  const data = buildStatistics([], '今月', '2026-11-16');
  assert.deepEqual(data.days, []);
  assert.deepEqual(data.ranking, []);
  assert.equal(data.total, 0);
});
