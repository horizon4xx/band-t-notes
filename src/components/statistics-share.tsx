import { useRef, useState, type ComponentRef } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { captureRef, releaseCapture } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { notebookAccent, type NotebookMode } from '@/constants/notebook-modes';
import { chartMaximum, shareStatistics, shortDate, type StatisticsData } from '@/utils/statistics';

export function StatisticsShare({ data: source, mode }: { data: StatisticsData; mode: NotebookMode }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const report = useRef<ComponentRef<typeof View>>(null);
  const data = shareStatistics(source);
  const accent = notebookAccent(mode);
  const maximum = chartMaximum(data.days);
  async function share() {
    if (!ready || busy) return;
    setBusy(true); setError(''); let uri: string | undefined;
    try {
      if (!await Sharing.isAvailableAsync()) throw new Error('この端末では画像を共有できません。');
      uri = await captureRef(report, { format: 'png', quality: 1, result: 'tmpfile' });
      await Sharing.shareAsync(uri, { mimeType: 'image/png', UTI: 'public.png', dialogTitle: '統計を画像で共有' });
    } catch { setError('画像を共有できませんでした。もう一度お試しください。'); }
    finally { if (uri) releaseCapture(uri); setBusy(false); }
  }
  return <>
    <Pressable accessibilityRole="button" onPress={() => { setOpen(true); setReady(false); setError(''); }} style={styles.open}><Text style={{ color: accent, fontWeight: '800' }}>↗ 統計を画像で共有</Text></Pressable>
    <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
      <View style={styles.overlay}><View style={styles.dialog}>
        <View style={styles.row}><Text style={styles.heading}>共有する画像</Text><Pressable accessibilityRole="button" accessibilityLabel="共有プレビューを閉じる" onPress={() => setOpen(false)} style={styles.button}><Text style={styles.text}>閉じる</Text></Pressable></View>
        <ScrollView style={{ flexShrink: 1 }}>
          <View ref={report} collapsable={false} onLayout={() => setReady(true)} style={styles.report}>
            <Text style={[styles.brand, { color: accent }]}>{mode === 'festival' ? 'FES T NOTES' : 'BAND T NOTES'}</Text>
            <Text style={styles.note}>街で見つけたTシャツの記録 · {data.period}</Text>
            {!!source.days.length && <Text style={styles.note}>{source.days[0].date} — {source.days[source.days.length - 1].date}</Text>}
            <View style={[styles.row, { paddingVertical: 16 }]}><View><Text style={[styles.big, { color: accent }]}>{data.total}</Text><Text style={styles.note}>見かけた枚数</Text></View><View><Text style={[styles.big, { color: accent }]}>{data.uniqueCount}</Text><Text style={styles.note}>{mode === 'festival' ? 'フェス数' : 'バンド数'}</Text></View></View>
            <Text style={styles.heading}>{data.chartLabel}</Text>
            <View style={{ flexDirection: 'row', gap: 6 }}><View style={{ height: 124, justifyContent: 'space-between' }}>{[4, 3, 2, 1, 0].map(step => <Text key={step} style={styles.tick}>{maximum * step / 4}</Text>)}</View><View style={{ flex: 1, flexDirection: 'row' }}>{data.days.map((day, index) => <View key={day.date} style={{ flex: 1 }}><View style={{ height: 124, justifyContent: 'flex-end', borderBottomWidth: 1, borderColor: '#555562' }}><View style={{ marginHorizontal: 1, height: Math.max(2, day.count / maximum * 116), backgroundColor: accent }} /></View><Text style={styles.tick}>{index % Math.max(1, Math.ceil(data.days.length / 5)) === 0 ? shortDate(day.date) : ''}</Text></View>)}</View></View>
            <Text style={styles.heading}>{data.rankingLabel}</Text>
            {data.ranking.map((item, index) => <View key={item.name} style={styles.row}><Text style={[styles.text, { flex: 1 }]}>{index + 1}. {item.name}</Text><Text style={{ color: accent, fontWeight: '800' }}>{item.count}枚</Text></View>)}
            {!data.total && <Text style={styles.note}>まだ記録がありません。</Text>}
            <Text style={[styles.note, { marginTop: 12 }]}>街で出会った音楽を、記録する。</Text>
          </View>
        </ScrollView>
        {!!error && <Text style={{ color: '#FF9C9C' }}>{error}</Text>}
        <Pressable accessibilityRole="button" disabled={!ready || busy} onPress={() => { void share(); }} style={[styles.button, { backgroundColor: accent, borderRadius: 14, alignItems: 'center', opacity: ready && !busy ? 1 : 0.5 }]}><Text style={{ color: '#171A11', fontWeight: '800' }}>{busy ? '共有中…' : '画像を共有する'}</Text></Pressable>
      </View></View>
    </Modal>
  </>;
}
const styles = StyleSheet.create({
  open: { padding: 13, minHeight: 44, alignItems: 'center', borderRadius: 14, borderWidth: 1, borderColor: '#41414D' }, overlay: { flex: 1, backgroundColor: '#000B', justifyContent: 'center', paddingHorizontal: 16, paddingVertical: 32 }, dialog: { maxHeight: '100%', padding: 16, gap: 12, backgroundColor: '#202029', borderRadius: 22 }, report: { backgroundColor: '#111116', padding: 18, gap: 14 }, row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 }, brand: { fontSize: 26, fontWeight: '900' }, heading: { fontSize: 16, fontWeight: '800', color: '#F7F7FB' }, note: { fontSize: 11, lineHeight: 18, color: '#B9B9C6' }, tick: { fontSize: 8, color: '#9292A3', lineHeight: 12 }, big: { fontSize: 42, fontWeight: '800' }, text: { color: '#F7F7FB', fontSize: 13, lineHeight: 20 }, button: { minHeight: 48, padding: 14 },
});
