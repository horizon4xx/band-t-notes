import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { notebookAccent, type NotebookMode } from '@/constants/notebook-modes';
import { createStatisticsImage } from '@/utils/statistics-image.web';
import type { StatisticsData } from '@/utils/statistics';

export function StatisticsShare({ data, mode }: { data: StatisticsData; mode: NotebookMode }) {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState<{ uri: string; file: File } | null>(null);
  const [error, setError] = useState('');
  const [sharing, setSharing] = useState(false);
  const accent = notebookAccent(mode);
  useEffect(() => {
    if (!open) return;
    let active = true; let uri: string | undefined;
    createStatisticsImage(data, mode).then(blob => {
      if (!active) return;
      uri = URL.createObjectURL(blob);
      setImage({ uri, file: new File([blob], `${mode}-t-notes.png`, { type: 'image/png' }) });
    }).catch(() => { if (active) setError('画像を作成できませんでした。閉じてもう一度お試しください。'); });
    return () => { active = false; if (uri) URL.revokeObjectURL(uri); };
  }, [open, data, mode]);
  const canShare = image && typeof navigator !== 'undefined' && navigator.canShare?.({ files: [image.file] });
  async function share() {
    if (!image || sharing) return;
    setSharing(true); setError('');
    try { await navigator.share({ files: [image.file], title: mode === 'festival' ? 'FES T NOTES' : 'BAND T NOTES' }); }
    catch (reason) { if (!(reason instanceof Error && reason.name === 'AbortError')) setError('共有できませんでした。「画像を保存」から保存して共有できます。'); }
    finally { setSharing(false); }
  }
  function download() {
    if (!image) return;
    const link = document.createElement('a'); link.href = image.uri; link.download = image.file.name;
    document.body.appendChild(link); link.click(); link.remove();
  }
  return <>
    <Pressable accessibilityRole="button" onPress={() => { setImage(null); setError(''); setOpen(true); }} style={styles.open}><Text style={{ color: accent, fontWeight: '800', fontSize: 14 }}>↗ 統計を画像で共有</Text></Pressable>
    <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
      <View style={styles.overlay}><View style={styles.dialog}>
        <View style={styles.header}><Text style={styles.title}>共有する画像</Text><Pressable accessibilityRole="button" accessibilityLabel="共有プレビューを閉じる" onPress={() => setOpen(false)} style={styles.close}><Text style={styles.text}>閉じる</Text></Pressable></View>
        <ScrollView style={styles.preview} contentContainerStyle={{ paddingBottom: 12 }}>
          {image ? <Image accessibilityLabel="統計の共有画像" source={{ uri: image.uri }} style={{ width: '100%', aspectRatio: 1080 / (1050 + Math.max(1, Math.min(10, data.ranking.length)) * 112) }} resizeMode="contain" /> : !error && <ActivityIndicator color={accent} style={{ margin: 40 }} />}
        </ScrollView>
        {!!error && <Text accessibilityLiveRegion="polite" style={styles.error}>{error}</Text>}
        {canShare ? <Pressable accessibilityRole="button" disabled={sharing} onPress={() => { void share(); }} style={[styles.primary, { backgroundColor: accent }]}><Text style={styles.primaryText}>{sharing ? '共有中…' : '画像を共有する'}</Text></Pressable> : image && <Text style={styles.note}>画像を保存して、LINEやSNSから共有できます。</Text>}
        <Pressable accessibilityRole="button" disabled={!image} onPress={download} style={styles.save}><Text style={[styles.text, { opacity: image ? 1 : 0.4 }]}>画像を保存</Text></Pressable>
      </View></View>
    </Modal>
  </>;
}
const styles = StyleSheet.create({
  open: { minHeight: 44, padding: 13, alignItems: 'center', borderRadius: 14, borderWidth: 1, borderColor: '#41414D' },
  overlay: { flex: 1, backgroundColor: '#000B', paddingHorizontal: 16, paddingVertical: 32, justifyContent: 'center', alignItems: 'center' },
  dialog: { width: '100%', maxWidth: 500, maxHeight: '100%', backgroundColor: '#202029', padding: 16, borderRadius: 22, gap: 12 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, title: { color: '#F7F7FB', fontSize: 18, fontWeight: '800' }, close: { padding: 12, minHeight: 44 }, text: { color: '#F7F7FB', fontSize: 14 }, preview: { flexShrink: 1 },
  primary: { minHeight: 48, padding: 15, alignItems: 'center', borderRadius: 14 }, primaryText: { color: '#171A11', fontWeight: '800' }, save: { minHeight: 44, padding: 12, alignItems: 'center' }, note: { color: '#B9B9C6', fontSize: 12, lineHeight: 20 }, error: { color: '#FF9C9C', fontSize: 13, lineHeight: 20 },
});
