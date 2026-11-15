import { artistKey } from './history-ranking';

// A curated starting order. Personal records take precedence over this default.
const bands = [
  'Mrs. GREEN APPLE', 'back number', 'ONE OK ROCK', 'King Gnu', 'BUMP OF CHICKEN',
  'RADWIMPS', 'スピッツ', 'サザンオールスターズ', 'Mr.Children', 'Official髭男dism',
  'あいみょん', 'Vaundy', 'YOASOBI', '米津玄師', 'サカナクション', 'マキシマム ザ ホルモン',
  'MAN WITH A MISSION', '10-FEET', 'ELLEGARDEN', 'ASIAN KUNG-FU GENERATION',
  'SUPER BEAVER', 'sumika', '04 Limited Sazabys', 'SiM', 'My Hair is Bad',
  'クリープハイプ', 'Saucy Dog', 'UVERworld', '[Alexandros]', 'Creepy Nuts',
  'HEY-SMITH', 'WANIMA', 'Hi-STANDARD', 'MONGOL800', 'SHANK', 'ROTTENGRAFFTY',
  'coldrain', 'Crossfaith', 'Fear, and Loathing in Las Vegas', 'Dragon Ash',
  'ストレイテナー', 'the pillows', 'THE ORAL CIGARETTES', 'ヤバイTシャツ屋さん',
  'ハルカミライ', 'Hump Back', 'KANA-BOON', 'フレデリック', 'go!go!vanillas',
  'BLUE ENCOUNT', 'KEYTALK', '9mm Parabellum Bullet', 'ACIDMAN',
  'NIRVANA', 'METALLICA', 'QUEEN', 'The Beatles', 'The Rolling Stones',
  'Red Hot Chili Peppers', 'Oasis', 'Green Day', 'Linkin Park', 'Slipknot',
  'Radiohead', 'Foo Fighters', 'Guns N’ Roses', 'AC/DC', 'KISS', 'Ramones',
];
const festivals = [
  'ROCK IN JAPAN FESTIVAL', 'FUJI ROCK FESTIVAL', 'SUMMER SONIC', 'COUNTDOWN JAPAN',
  'JAPAN JAM', '京都大作戦', 'VIVA LA ROCK', 'DEAD POP FESTiVAL', 'YON FES',
  'SATANIC CARNIVAL', 'RISING SUN ROCK FESTIVAL', 'MONSTER baSH', 'METROCK',
  'SWEET LOVE SHOWER', 'WILD BUNCH FEST.', 'ARABAKI ROCK FEST.', 'RUSH BALL',
  'ポルノ超特急', '響都超特急', '山人音楽祭', 'BLARE FEST.', 'TREASURE05X',
];
const bandPriority = new Map(bands.map((name, index) => [artistKey(name), bands.length - index]));
const festivalPriority = new Map(festivals.map((name, index) => [artistKey(name), festivals.length - index]));
export const initialBandPriority = (name: string) => bandPriority.get(artistKey(name)) ?? 0;
export const initialFestivalPriority = (name: string) => festivalPriority.get(artistKey(name)) ?? 0;
