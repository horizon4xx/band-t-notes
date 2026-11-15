const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const test = require('node:test');
const ts = require('typescript');
const loaded = new Map();
function load(file) {
  if (loaded.has(file)) return loaded.get(file);
  const module = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
  new Function('require', 'exports', 'module', code)(
    name => load(path.resolve(path.dirname(file), name + '.ts')),
    module.exports, module,
  );
  loaded.set(file, module.exports);
  return module.exports;
}
const root = path.resolve(__dirname, '..');
const { suggestBands, BAND_CANDIDATE_COUNT } = load(path.join(root, 'src/constants/bands.ts'));
const { rankByHistory } = load(path.join(root, 'src/constants/history-ranking.ts'));
const now = new Date(2026, 10, 15, 12);
const record = (band, count = 1, date = '2026-11-15') => ({ band, count, date });

test('musical affinity changes ambiguous results for different histories', () => {
  assert.equal(suggestBands('s', [record('Knosis', 5)])[0].name, 'SABLE HILLS');
  assert.equal(suggestBands('s', [record('sumika', 5)])[0].name, 'sumika');
  assert.equal(suggestBands('は', [record('ルサンチマン', 5)])[0].name, 'ハヌマーン');
});

test('exact name and alias matches win over musical affinity', () => {
  const history = [record('Knosis', 25)];
  assert.equal(suggestBands('sumika', history)[0].name, 'sumika');
  assert.equal(suggestBands('じぇいそん', history)[0].name, 'JasonAndrew');
});

test('history aliases resolve to the same artist without duplicate candidates', () => {
  const a = suggestBands('g', [record('G-FREAK FACTORY')]);
  const b = suggestBands('g', [record('じーふりーく')]);
  assert.deepEqual(a.map(x => x.name), b.map(x => x.name));
  assert.equal(new Set(a.map(x => x.name)).size, a.length);
});

test('personal names join suggestions and take priority among matching names', () => {
  assert.equal(suggestBands('存在しないテストバンド', [record('存在しないテストバンド')])[0].name, '存在しないテストバンド');
  assert.equal(suggestBands('s', [record('SUMIKA LOCAL')])[0].name, 'SUMIKA LOCAL');
  assert.equal(suggestBands('sumika', [record('SUMIKA LOCAL')])[0].name, 'sumika');
  assert.equal(suggestBands('', [record('My Local Band')])[0].name, 'My Local Band');
  assert.equal(suggestBands('my', [record('My Local Band'), record('ＭＹ ＬＯＣＡＬ ＢＡＮＤ')]).filter(candidate => candidate.custom).length, 1);
  assert(suggestBands('', [record('Knosis')]).some(candidate => candidate.name === 'Knosis'));
  assert(BAND_CANDIDATE_COUNT >= 1274);
});

test('initial suggestions use familiar names before alphabetical order', () => {
  assert.equal(suggestBands('', [])[0].name, 'Mrs. GREEN APPLE');
  assert.equal(suggestBands('s', [])[0].name, 'スピッツ');
  assert.equal(suggestBands('しむ', [])[0].name, 'SiM');
});

test('recent and frequent sightings outweigh old isolated sightings', () => {
  const score = rankByHistory([record('Knosis', 9), record('sumika', 1, '2025-01-01')], n => n, now);
  assert(score('SABLE HILLS') > score('SUPER BEAVER'));
  const reverse = rankByHistory([record('sumika', 9), record('Knosis', 1, '2025-01-01')], n => n, now);
  assert(reverse('SUPER BEAVER') > reverse('SABLE HILLS'));
});

test('clearing or changing history recomputes candidate order', () => {
  const before = suggestBands('s', []);
  const after = suggestBands('s', [record('Knosis')]);
  assert.notDeepEqual(before.map(x => x.name), after.map(x => x.name));
  assert.deepEqual(suggestBands('s', []).map(x => x.name), before.map(x => x.name));
});
