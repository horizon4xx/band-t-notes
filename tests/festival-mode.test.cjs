const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const test = require('node:test');
const ts = require('typescript');
function load(relative) {
  const file = path.resolve(__dirname, '..', relative);
  const module = { exports: {} };
  new Function('exports', 'module', ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText)(module.exports, module);
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

test('festival search excludes band names and duplicates', () => {
  assert.deepEqual(suggestFestivals('Knosis', [{ band: 'Knosis', count: 10 }]), []);
  const suggestions = suggestFestivals('love', []);
  assert.equal(new Set(suggestions.map(s => s.name)).size, suggestions.length);
});
