/** Broad, overlapping hints for search ordering, not definitive genre classifications. */
export type ArtistTraits = { genres: string[]; formation?: 'band' | 'solo' | 'unit' };
export const ARTIST_TRAITS: Record<string, ArtistTraits> = {};
const add = (genres: string[], names: string, formation?: ArtistTraits['formation']) => {
  for (const name of names.split('|')) {
    const previous = ARTIST_TRAITS[name];
    ARTIST_TRAITS[name] = { genres: [...new Set([...(previous?.genres || []), ...genres])], formation: formation ?? previous?.formation };
  }
};

add(['melodic-punk', 'punk'], '04 Limited Sazabys|Hi-STANDARD|HAWAIIAN6|SHANK|dustbox|locofrank|OVER ARM THROW|GOOD4NOTHING|Dizzy Sunfist|KUZIRA|Northern19|TOTALFAT|EGG BRAIN|HOTSQUALL|F.I.B|DRADNATS|BACKLIFT|BUZZ THE BEARS|SECRET 7 LINE|Track’s|Track\'s|OwL|SHE\'ll SLEEP|HONEST|FIVE STATE DRIVE|ONIONRING|MARIO2BLOCK|ENTH|Green Day', 'band');
add(['hardcore', 'punk'], 'BRAHMAN|SHADOWS|SAND|NUMB|SLANG|PALM|LOYAL TO THE GRAVE|GATES OF HOPELESS|BEYOND HATE|ReVERSE BOYZ|KRUELTY|END IN BLOOD|nervous light of sunday|TRUE FIGHT|Endzweck|MEANING|THINK AGAIN|GARLICBOYS|BBQ CHICKENS', 'band');
add(['metalcore', 'hardcore', 'loud'], 'Crystal Lake|View from the Soyuz|SABLE HILLS|Graupel|HER NAME IN BLOOD|Crossfaith|Paledusk|coldrain|Fear, and Loathing in Las Vegas|universe last a ward|UNHOLY11|Bring Me the Horizon', 'band');
add(['metalcore', 'hardcore', 'loud', 'electronic'], 'Knosis');
add(['melodic-punk', 'hardcore', 'mixture'], 'JasonAndrew', 'band');
add(['ska', 'punk'], 'HEY-SMITH|KEMURI|SKA FREAKS|SCAFULL KING|THE CHERRY COKE$', 'band');
add(['mixture', 'reggae', 'loud'], 'SiM|G-FREAK FACTORY|山嵐', 'band');
add(['mixture', 'loud'], 'ROTTENGRAFFTY|Dragon Ash|RIZE|The BONEZ|マキシマム ザ ホルモン|Rage Against the Machine|Linkin Park|Slipknot|DEFTONES', 'band');
add(['reggae'], 'G-FREAK FACTORY');
add(['punk', 'guitar-rock'], '10-FEET|WANIMA|MONGOL800|ELLEGARDEN|MONOEYES|THE FOREVER YOUNG|ハルカミライ|Hump Back|FOMARE|アルステイク|ヤバイTシャツ屋さん|サバシスター|THE BLUE HEARTS|THE HIGH-LOWS|ザ・クロマニヨンズ', 'band');
add(['alternative', 'guitar-rock'], 'ルサンチマン|ハヌマーン|バズマザーズ|山田亮一とアフターソウル|時速36km|JIGDRESS|さよならポエジー|PK shampoo|the bercedes menz|171|SuiseiNoboAz|the dadadadys|teto|挫・人間|突然少年|錯乱前戦|ジュウ|NUMBER GIRL|ZAZEN BOYS|ART-SCHOOL|THE BACK HORN|9mm Parabellum Bullet|凛として時雨|ヒトリエ|People In The Box|syrup16g|bloodthirsty butchers|NIRVANA|Sonic Youth|Radiohead', 'band');
add(['emo', 'alternative'], 'downt|yubiori|くだらない1日|ANORAK!|Falls|curve|さよならポエジー', 'band');
add(['indie', 'alternative'], 'Helsinki Lambda Club|DENIMS|ドミコ|MONO NO AWARE|DYGL|No Buses|ミツメ|トリプルファイヤー|踊ってばかりの国|おとぎ話|never young beach|シャムキャッツ|浪漫革命|台風クラブ|愛はズボーン|愛しておくれ|THEラブ人間|きのこ帝国|羊文学|kurayamisaka|Hammer Head Shark|揺らぎ|リーガルリリー|サニーデイ・サービス|omeme tenten|mogari|ゆれる|インナージャーニー|メメタァ|pavilion|フリージアン|レトロマイガール！！|The Novembers|the cabs', 'band');
add(['shoegaze', 'alternative'], 'きのこ帝国|羊文学|kurayamisaka|Hammer Head Shark|揺らぎ', 'band');
add(['post-rock', 'math-rock', 'alternative'], 'toe|mouse on the keys|toddle|tricot|the cabs|the band apart', 'band');
add(['guitar-rock', 'pop-rock'], 'BUMP OF CHICKEN|ASIAN KUNG-FU GENERATION|スピッツ|SUPER BEAVER|My Hair is Bad|UNISON SQUARE GARDEN|THE ORAL CIGARETTES|BLUE ENCOUNT|go!go!vanillas|sumika|Mrs. GREEN APPLE|Official髭男dism|back number|Saucy Dog|マカロニえんぴつ|クリープハイプ|緑黄色社会|SHISHAMO|KANA-BOON|KEYTALK|フレデリック|ハンブレッダーズ|マルシィ|ねぐせ。|ヤングスキニー|Novelbright|PEOPLE 1|indigo la End|サンボマスター|フジファブリック|ポルノグラフィティ|レミオロメン|RADWIMPS|チャットモンチー|Base Ball Bear', 'band');
add(['loud', 'guitar-rock'], 'ONE OK ROCK|MY FIRST STORY|Survive Said The Prophet|UVERworld|MAN WITH A MISSION', 'band');
add(['electronic', 'alternative', 'pop-rock'], 'サカナクション|SEKAI NO OWARI', 'band');
add(['metal'], 'METALLICA|SLAYER|Iron Maiden|Black Sabbath|Motörhead', 'band');
add(['punk'], 'Ramones|Sex Pistols|The Clash', 'band');
add(['rock'], 'The Rolling Stones|The Beatles|QUEEN|AC/DC|Guns N’ Roses|Led Zeppelin|Foo Fighters|Oasis|Arctic Monkeys|The Strokes', 'band');
add(['mixture', 'funk'], 'Red Hot Chili Peppers', 'band');
add(['pop'], 'aiko|あいみょん|Ado|Aimer|LiSA|yama|Vaundy|米津玄師|星野源|藤井風|優里|なとり|キタニタツヤ|コレサワ|大森靖子|日食なつこ|阿部真央|椎名林檎|斉藤和義|奥田民生|竹原ピストル|山本彩|秋山黄色|TOMOO|にしな|カネコアヤノ|崎山蒼志', 'solo');
add(['hip-hop'], 'Awich|KREVA|SKY-HI|OZworld|SKRYU|LANA|AK-69|Jin Dogg|SHINGO★西成', 'solo');
add(['hip-hop'], 'Creepy Nuts|RIP SLYME|RHYMESTER|KICK THE CAN CREW|THA BLUE HERB|MOROHA', 'unit');
add(['pop', 'electronic'], 'YOASOBI|ヨルシカ|ずっと真夜中でいいのに。|NOMELON NOLEMON', 'unit');