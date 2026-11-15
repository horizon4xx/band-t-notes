const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const test = require('node:test');
const ts = require('typescript');
function load(relative) {
  const file = path.resolve(__dirname, '..', relative);
  const module = { exports: {} };
  new Function('require', 'exports', 'module', ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText)(name => load(path.relative(path.resolve(__dirname, '..'), path.resolve(path.dirname(file), name + '.ts'))), module.exports, module);
  return module.exports;
}
const { notebookStorageKey, notebookAccent, NOTEBOOK_PAGES, notebookPageIndex } = load('src/constants/notebook-modes.ts');
const { suggestFestivals } = load('src/constants/festivals.ts');

test('existing band records retain their original storage key and festival records use a separate key', () => {
  assert.equal(notebookStorageKey('band'), 'bandtee.records.v1');
  assert.notEqual(notebookStorageKey('band'), notebookStorageKey('festival'));
  assert.equal(notebookAccent('festival'), '#FF8A3D');
});

test('band is the initial main page and festival is its right-hand neighbor', () => {
  assert.equal(notebookPageIndex('band'), 0);
  assert.equal(notebookPageIndex('festival'), 1);
  assert.deepEqual(NOTEBOOK_PAGES, ['band', 'festival']);
});

test('festival suggestions accept Japanese readings and abbreviations', () => {
  for (const [input, expected] of [['ヨンフェス', 'YON FES'], ['でっどぽっぷ', 'DEAD POP FESTiVAL'], ['ロッキン', 'ROCK IN JAPAN FESTIVAL'], ['やまびと', '山人音楽祭'], ['ポルノ', 'ポルノ超特急']]) {
    assert.equal(suggestFestivals(input, [])[0].name, expected);
  }
  assert.deepEqual(suggestFestivals('', []), []);
});

test('festival search adds personal festival names without duplicates', () => {
  assert.equal(suggestFestivals('my', [{ band: 'MY FES', count: 10 }])[0].name, 'MY FES');
  assert.deepEqual(suggestFestivals('', [{ band: 'MY FES', count: 10 }]), []);
  assert.deepEqual(suggestFestivals('　 ', [{ band: 'MY FES', count: 10 }]), []);
  assert.equal(suggestFestivals('SUMMER SONIC', [{ band: 'SUMMER SONIC LOCAL', count: 10 }])[0].name, 'SUMMER SONIC');
  assert.equal(suggestFestivals('yon', [{ band: 'MY YON', count: 10 }])[0].name, 'YON FES');
  assert.equal(suggestFestivals('s', [{ band: 'SUMMER LOCAL FES', count: 2 }])[0].name, 'SUMMER LOCAL FES');
  assert.equal(suggestFestivals('my', [{ band: 'MY FES', count: 1 }, { band: 'ｍｙ ｆｅｓ', count: 1 }]).length, 1);
  const suggestions = suggestFestivals('love', []);
  assert.equal(new Set(suggestions.map(s => s.name)).size, suggestions.length);
});
