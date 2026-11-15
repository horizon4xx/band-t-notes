import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { notebookAccent, type NotebookMode } from '@/constants/notebook-modes';
import { buildStatistics, chartMaximum, shortDate, type TeeRecord } from '@/utils/statistics';
import { StatisticsShare } from './statistics-share';

export function Statistics({ records, mode, today, period, onPeriodChange }: { records: readonly TeeRecord[]; mode: NotebookMode; today: string; period: string; onPeriodChange: (period: string) => void }) {
  const [selectedDate, setSelectedDate] = useState('');
  const data = useMemo(() => buildStatistics(records, period, today), [records, period, today]);
  const maximum = chartMaximum(data.days);
  const accent = notebookAccent(mode);
  const selected = data.days.find(day => day.date === selectedDate)
    ?? [...data.days].reverse().find(day => day.count > 0);
  return <>
    <View style={styles.toolbar}>
      <View style={styles.filters}>{['すべて', '今月'].map(value => <Pressable key={value} accessibilityRole="button" accessibilityState={{ selected: period === value }} onPress={() => onPeriodChange(value)} style={[styles.chip, period === value && { backgroundColor: accent }]}><Text style={period === value ? styles.selected : styles.muted}>{value}</Text></Pressable>)}</View>
      <StatisticsShare data={data} mode={mode} />
    </View>
    <View style={styles.summary}><View><Text style={[styles.big, { color: accent }]}>{data.total}</Text><Text style={styles.muted}>見かけた枚数</Text></View><View><Text style={[styles.big, { color: accent }]}>{data.ranking.length}</Text><Text style={styles.muted}>{mode === 'festival' ? 'フェス数' : 'バンド数'}</Text></View></View>
    <View style={styles.card}>
      <Text style={styles.heading}>日別の枚数</Text>
      {!data.days.length ? <Text style={styles.muted}>記録すると日別の棒グラフが表示されます。</Text> : <>
        <Text style={styles.hint}>棒をタップして内訳を見る · 左右にスクロール</Text>
        <View style={styles.chart}>
          <View style={styles.axis}>{[4, 3, 2, 1, 0].map(step => <Text key={step} style={styles.tick}>{maximum * step / 4}</Text>)}</View>
          <FlatList key={`${period}-${data.days[0].date}`} horizontal data={data.days} extraData={selected?.date} showsHorizontalScrollIndicator
            initialScrollIndex={Math.max(0, data.days.length - 6)} getItemLayout={(_, index) => ({ length: 44, offset: 44 * index, index })}
            keyExtractor={item => item.date} style={styles.plot} renderItem={({ item }) => <Pressable accessibilityRole="button" accessibilityLabel={`${item.date}、${item.count}枚の内訳`} accessibilityState={{ selected: selected?.date === item.date }} onPress={() => setSelectedDate(item.date)} style={styles.column}>
              <View style={styles.barArea}><View style={[styles.bar, { height: Math.max(3, item.count / maximum * 160), backgroundColor: accent, opacity: selected?.date === item.date ? 1 : 0.45 }]} /></View>
              <Text style={[styles.date, selected?.date === item.date && { color: accent }]}>{shortDate(item.date)}</Text>
            </Pressable>} />
        </View>
        {selected && <View accessibilityLiveRegion="polite" style={styles.breakdown}>
          <Text style={styles.subheading}>{selected.date.replaceAll('-', '/')} · {selected.count}枚</Text>
          {!selected.items.length && <Text style={styles.muted}>この日の記録はありません。</Text>}
          {selected.items.map(item => <View key={item.name} style={styles.row}><Text style={styles.name}>{item.name}</Text><Text style={[styles.count, { color: accent }]}>{item.count}枚</Text></View>)}
        </View>}
      </>}
    </View>
    <View style={styles.card}><Text style={styles.heading}>{mode === 'festival' ? 'フェス別ランキング' : 'バンド別ランキング'}</Text>
      {!data.ranking.length && <Text style={styles.muted}>記録すると、ここにランキングが表示されます。</Text>}
      {data.ranking.map((item, index) => <View key={item.name} style={styles.rank}><View style={styles.row}><Text style={styles.name}>{index + 1}. {item.name}</Text><Text style={[styles.count, { color: accent }]}>{item.count}枚</Text></View><View style={styles.track}><View style={{ height: 7, borderRadius: 4, backgroundColor: accent, width: `${item.count / data.ranking[0].count * 100}%` }} /></View></View>)}
    </View>
  </>;
}

const styles = StyleSheet.create({
  toolbar: { gap: 12 }, filters: { flexDirection: 'row', gap: 10 }, chip: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 24, backgroundColor: '#252530' }, selected: { color: '#171A11', fontWeight: '800' },
  summary: { flexDirection: 'row', justifyContent: 'space-around', padding: 22, backgroundColor: '#202029', borderRadius: 22 }, big: { fontSize: 42, fontWeight: '800' },
  card: { padding: 20, gap: 14, borderRadius: 22, backgroundColor: '#202029' }, heading: { fontSize: 19, fontWeight: '800', color: '#F7F7FB' }, subheading: { color: '#F7F7FB', fontSize: 15, fontWeight: '700' }, muted: { color: '#B9B9C6', fontSize: 13, lineHeight: 21 }, hint: { color: '#9292A3', fontSize: 11, lineHeight: 18 },
  chart: { flexDirection: 'row', height: 200 }, axis: { width: 32, height: 168, justifyContent: 'space-between', paddingBottom: 0 }, tick: { color: '#9292A3', fontSize: 10, lineHeight: 12, textAlign: 'right', paddingRight: 7 }, plot: { flex: 1 }, column: { width: 44, height: 195 }, barArea: { height: 166, paddingTop: 6, borderBottomWidth: 1, borderColor: '#555562', justifyContent: 'flex-end', alignItems: 'center' }, bar: { width: 28, borderTopLeftRadius: 5, borderTopRightRadius: 5 }, date: { color: '#B9B9C6', fontSize: 10, paddingTop: 8, textAlign: 'center' },
  breakdown: { borderTopWidth: 1, borderColor: '#3C3C49', paddingTop: 15, gap: 12 }, row: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, alignItems: 'center' }, name: { color: '#F7F7FB', fontSize: 15, fontWeight: '600', flex: 1 }, count: { fontSize: 15, fontWeight: '700' }, rank: { gap: 10, paddingVertical: 7 }, track: { height: 7, backgroundColor: '#363642', borderRadius: 4, overflow: 'hidden' },
});
