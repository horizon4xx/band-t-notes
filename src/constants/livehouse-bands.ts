// Additional live-house / alternative artists; this is a search list, not a genre classification.
export const LIVEHOUSE_BANDS = `
ルサンチマン|るさんちまん,RUSANTI-MAN
ハヌマーン|はぬまーん,Hanumaan
バズマザーズ|ばずまざーず,バズマ,Buzz Mothers
山田亮一とアフターソウル|やまだりょういちとあふたーそうる,アフターソウル
時速36km|じそくさんじゅうろっきろ,じそく36きろ,ジソク
JIGDRESS|ジグドレス,じぐどれす
さよならポエジー|さよならぽえじー,ポエジー
PK shampoo|ピーケーシャンプー,ぴーけーしゃんぷー
the bercedes menz|ザベルセデスメンツ,ベルセデスメンツ,ベルセデス
171|イナイチ,いないち
さよならミオちゃん|さよならみおちゃん
ザ・シスターズハイ|ざしすたーずはい,シスターズハイ
SuiseiNoboAz|スイセイノボアズ,すいせいのぼあず,ボアズ
the dadadadys|ザダダダディーズ,ダダダディーズ
teto|テト,てと
Helsinki Lambda Club|ヘルシンキラムダクラブ,ヘルシンキ
DENIMS|デニムス,でにむす
ドミコ|どみこ,domico
MONO NO AWARE|モノノアワレ,もののあわれ
DYGL|デイグロー,でいぐろー
No Buses|ノーバシーズ,のーばしーず
ミツメ|みつめ,mitsume
トリプルファイヤー|とりぷるふぁいやー,Triple Fire
踊ってばかりの国|おどってばかりのくに
おとぎ話|おとぎばなし
カネコアヤノ|かねこあやの
never young beach|ネバーヤングビーチ,ネバヤン
シャムキャッツ|しゃむきゃっつ,Siamese Cats
浪漫革命|ろまんかくめい
台風クラブ|たいふうくらぶ
愛はズボーン|あいはずぼーん,愛ズ
愛しておくれ|あいしておくれ
挫・人間|ざにんげん,挫人間
THEラブ人間|ざらぶにんげん,ラブ人間
それでも世界が続くなら|それでもせかいがつづくなら,それせか
クリトリック・リス|くりとりっくりす
忘れらんねえよ|わすれらんねえよ
突然少年|とつぜんしょうねん
錯乱前戦|さくらんぜんせん
勃発|ぼっぱつ
ジュウ|じゅう
yubiori|ユビオリ,ゆびおり
くだらない1日|くだらないいちにち,くだらない一日
downt|ダウント,だうんと
ANORAK!|アノラック,あのらっく
Falls|フォールズ,ふぉーるず
curve|カーヴ,カーブ
toe|トー,とー
mouse on the keys|マウスオンザキーズ
toddle|トドル,とどる
きのこ帝国|きのこていこく
羊文学|ひつじぶんがく
kurayamisaka|クラヤミザカ,くらやみざか
Hammer Head Shark|ハンマーヘッドシャーク
揺らぎ|ゆらぎ,Yuragi
くだらない1日|クダラナイイチニチ
東京初期衝動|とうきょうしょきしょうどう
鉄風東京|てっぷうとうきょう
Sundae May Club|サンデーメイクラブ
板歯目|ばんしもく
超☆社会的サンダル|ちょうしゃかいてきさんだる
サニーデイ・サービス|さにーでいさーびす
omeme tenten|オメメテンテン,おめめてんてん
mogari|モガリ,もがり
ゆれる|ユレル
ペルシカリア|ぺるしかりあ
インナージャーニー|いんなーじゃーにー
メメタァ|めめたぁ
まなつ|マナツ
pavilion|パビリオン,ぱびりおん
フリージアン|ふりーじあん
レトロマイガール！！|れとろまいがーる
プピリットパロ|ぷぴりっとぱろ
ビレッジマンズストア|びれっじまんずすとあ
Gordon|ゴードン,ごーどん
SULLIVAN's FUN CLUB|サリバンズファンクラブ
T.O.C.A|トーカ,とーか
The Cheserasera|ザケセラセラ,ケセラセラ
`.trim().split('\n').map(line => { const [name, aliases = ''] = line.split('|'); return { name, aliases: aliases.split(',') }; });