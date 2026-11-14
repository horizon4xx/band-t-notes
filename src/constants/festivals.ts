const FESTIVALS = [
  ['YON FES', 'ヨンフェス,よんふぇす,04'],
  ['DEAD POP FESTiVAL', 'デッドポップフェスティバル,デッドポップ,デッドポップフェス,DPF'],
  ['ポルノ超特急', 'ぽるのちょうとっきゅう,ポルノ'],
  ['響都超特急', 'きょうとちょうとっきゅう,キョウトチョウトッキュウ'],
  ['ROCK IN JAPAN FESTIVAL', 'ロックインジャパン,ロッキン,ロキノン,RIJF'],
  ['山人音楽祭', 'やまびとおんがくさい,ヤマビト,山人'],
  ['京都大作戦', 'きょうとだいさくせん,ダイサクセン'],
  ['SATANIC CARNIVAL', 'サタニックカーニバル,サタニック,サタカニ'],
  ['SATANIC PARTY', 'サタニックパーティー,サタパ'],
  ['BLOODAXE FESTIVAL', 'ブラッドアックスフェスティバル,ブラッドアックス'],
  ['FUJI ROCK FESTIVAL', 'フジロックフェスティバル,フジロック'],
  ['SUMMER SONIC', 'サマーソニック,サマソニ'],
  ['COUNTDOWN JAPAN', 'カウントダウンジャパン,CDJ'],
  ['JAPAN JAM', 'ジャパンジャム,ジャパジャム,JJ'],
  ['VIVA LA ROCK', 'ビバラロック,ヴィヴァラロック,ビバラ'],
  ['METROCK', 'メトロック'],
  ['RISING SUN ROCK FESTIVAL', 'ライジングサンロックフェスティバル,ライジングサン,RSR'],
  ['RUSH BALL', 'ラッシュボール,ラシュボ'],
  ['MONSTER baSH', 'モンスターバッシュ,モンバス'],
  ['WILD BUNCH FEST.', 'ワイルドバンチフェス,ワイバン'],
  ['SWEET LOVE SHOWER', 'スウィートラブシャワー,スイートラブシャワー,ラブシャ'],
  ['SPACE SHOWER SWEET LOVE SHOWER SPRING', 'ラブシャスプリング'],
  ['ARABAKI ROCK FEST.', 'アラバキロックフェス,アラバキ'],
  ['JOIN ALIVE', 'ジョインアライブ,ジョイン'],
  ['FREEDOM NAGOYA', 'フリーダムナゴヤ,フリーダム'],
  ['百万石音楽祭', 'ひゃくまんごくおんがくさい,ミリオンロック'],
  ['OSAKA GIGANTIC MUSIC FESTIVAL', 'オオサカジャイガンティックミュージックフェスティバル,ジャイガ'],
  ['TRIANGLE', 'トライアングル'],
  ['TRUST NIGHT', 'トラストナイト'],
  ['COMING KOBE', 'カミングコウベ,カミコベ'],
  ['COMIN’KOBE', 'コミンコウベ'],
  ['MERRY ROCK PARADE', 'メリーロックパレード,メリロ'],
  ['TREASURE05X', 'トレジャーゼロゴエックス,トレジャー'],
  ['DPF EXTRA', 'デッドポップエクストラ'],
  ['HAZIKETEMAZARE FESTIVAL', 'ハジケテマザレフェスティバル,ハジマザ'],
  ['BLARE FEST.', 'ブレアフェス,ブレア'],
  ['AIR JAM', 'エアジャム'],
  ['POWER STOCK', 'パワーストック,パワスト'],
  ['八食サマーフリーライブ', 'はっしょくさまーふりーらいぶ,ハッショク'],
  ['男鹿ナマハゲロックフェスティバル', 'おがなまはげろっくふぇすてぃばる,男鹿フェス'],
  ['OGA NAMAHAGE ROCK FESTIVAL', 'オガナマハゲロックフェスティバル,ONRF'],
  ['氣志團万博', 'きしだんばんぱく,キシダンバンパク'],
  ['風とロック芋煮会', 'かぜとろっくいもにかい,芋煮会'],
  ['中津川 THE SOLAR BUDOKAN', 'なかつがわそーらーぶどうかん,ソーラーブドウカン'],
  ['New Acoustic Camp', 'ニューアコースティックキャンプ,ニューアコ'],
  ['New Spring Harvest', 'ニュースプリングハーベスト'],
  ['頂 -ITADAKI-', 'いただき,イタダキ'],
  ['森、道、市場', 'もりみちいちば,モリミチ'],
  ['GREENROOM FESTIVAL', 'グリーンルームフェスティバル,グリーンルーム'],
  ['朝霧JAM', 'あさぎりじゃむ,アサギリ'],
  ['結いのおと', 'ゆいのおと'],
  ['ボロフェスタ', 'ぼろふぇすた,ボロフェス'],
  ['下北沢にて', 'しもきたざわにて,シモニテ,下北にて'],
  ['Shimokitazawa SOUND CRUISING', 'シモキタザワサウンドクルージング,サウクル'],
  ['見放題', 'みほうだい,ミホウダイ'],
  ['TOKYO CALLING', 'トーキョーコーリング,トウキョウコーリング'],
  ['TOKYO ISLAND', 'トーキョーアイランド,トウキョウアイランド'],
  ['MINAMI WHEEL', 'ミナミホイール,ミナホ'],
  ['SAKAE SP-RING', 'サカエスプリング,サカスプ'],
  ['SYNCHRONICITY', 'シンクロニシティ'],
  ['CRAFTROCK FESTIVAL', 'クラフトロックフェスティバル,クラフトロック'],
  ['OTODAMA 音泉魂', 'おとだまおんせんだましい,オトダマ'],
  ['PIA MUSIC COMPLEX', 'ピアミュージックコンプレックス,ぴあフェス,PMC'],
  ['FUKUOKA MUSIC FES.', 'フクオカミュージックフェス,福フェス'],
  ['MEGA VEGAS', 'メガベガス'],
  ['PUNKSPRING', 'パンクスプリング,パンスプ'],
  ['KNOTFEST JAPAN', 'ノットフェスジャパン,ノットフェス'],
  ['LOUD PARK', 'ラウドパーク,ラウパ'],
  ['DOWNLOAD JAPAN', 'ダウンロードジャパン'],
  ['KOBE SONO SONO', 'コウベソノソノ,ソノソノ'],
  ['SWEET LOVE SHOWER', 'ラブシャワー'],
] as const;

const key = (s: string) => s.normalize('NFKC').toLowerCase()
  .replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60))
  .replace(/[^\p{L}\p{N}]/gu, '');

export function suggestFestivals(input: string, history: readonly { band: string; count: number }[]) {
  const query = key(input);
  if (!query) return [];
  const usage = new Map<string, number>();
  for (const entry of history) usage.set(key(entry.band), (usage.get(key(entry.band)) || 0) + entry.count);
  const catalog = new Map<string, { name: string; aliases: string[] }>();
  for (const [name, aliases] of FESTIVALS) {
    const previous = catalog.get(key(name));
    catalog.set(key(name), { name, aliases: [...(previous?.aliases || []), ...aliases.split(',')] });
  }
  return [...catalog.values()].map(festival => {
    const terms = [festival.name, ...festival.aliases].map(key);
    const match = terms.includes(query) ? 3 : terms.some(t => t.startsWith(query)) ? 2 : terms.some(t => t.includes(query)) ? 1 : 0;
    return { ...festival, match, used: usage.has(key(festival.name)), frequency: usage.get(key(festival.name)) || 0 };
  }).filter(festival => festival.match > 0)
    .sort((a, b) => b.match - a.match || b.frequency - a.frequency || a.name.localeCompare(b.name))
    .slice(0, 8);
}
