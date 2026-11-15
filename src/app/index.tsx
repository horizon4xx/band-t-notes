import { Statistics } from '@/components/statistics';
import { NotebookPager } from '@/components/notebook-pager';
import { suggestFestivals } from '@/constants/festivals';
import { notebookStorageKey, notebookAccent, type NotebookMode } from '@/constants/notebook-modes';
import { suggestBands } from '@/constants/bands';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const notify = (title: string, message?: string) => {
  if (Platform.OS === 'web') globalThis.alert([title, message].filter(Boolean).join('\n'));
  else Alert.alert(title, message);
};

type Entry = { id: string; band: string; date: string; count: number };
const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
const NotebookTabContext = createContext<{
  tab: string;
  setTab: (tab: string) => void;
  descriptionHeight: number;
  measureDescription: (mode: NotebookMode, height: number) => void;
} | null>(null);

export default function HomeScreen() {
  const [tab, setTab] = useState('記録');
  const [descriptionHeights, setDescriptionHeights] = useState({ band: 0, festival: 0 });
  const measureDescription = useCallback((mode: NotebookMode, height: number) => {
    const roundedHeight = Math.ceil(height);
    setDescriptionHeights(previous => previous[mode] === roundedHeight
      ? previous
      : { ...previous, [mode]: roundedHeight });
  }, []);
  const descriptionHeight = Math.max(descriptionHeights.band, descriptionHeights.festival);
  return <NotebookTabContext.Provider value={{ tab, setTab, descriptionHeight, measureDescription }}>
    <NotebookPager key="band-first" Page={TeeNotebook} />
  </NotebookTabContext.Provider>;
}

function TeeNotebook({ mode, onSwitch }: { mode: NotebookMode; onSwitch: (mode: NotebookMode) => void }) {
  const festival = mode === 'festival';
  const storageKey = notebookStorageKey(mode);
  const accent = notebookAccent(mode);
  const styles = useMemo(() => createStyles(accent), [accent]);
  const [records, setRecords] = useState<Entry[]>([]);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const { tab, setTab, descriptionHeight, measureDescription } = useContext(NotebookTabContext)!;
  const [band, setBand] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [count, setCount] = useState(1);
  const [editing, setEditing] = useState<string | null>(null);
  const [notice, setNotice] = useState('');
  const [period, setPeriod] = useState('すべて');


  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(storageKey).then(raw => {
      if (!active) return;
      if (raw) {
        const data: unknown = JSON.parse(raw);
        if (!Array.isArray(data) || !data.every(r => r && typeof r.id === 'string' && typeof r.band === 'string' && typeof r.date === 'string' && Number.isInteger(r.count) && r.count > 0)) throw Error('Invalid saved records');
        setRecords(data);
      }
      setReady(true);
    }).catch(() => { if(active) { setStorageError(true); setReady(true); } });
    return () => { active = false; };
  }, [storageKey]);

  async function persist(next: Entry[]) {
    setBusy(true);
    try { await AsyncStorage.setItem(storageKey, JSON.stringify(next)); setRecords(next); return true; }
    catch { notify('保存できませんでした', '記録は変更していません。もう一度試してください。'); return false; }
    finally { setBusy(false); }
  }
  function clearForm() { setShowSuggestions(false); setBand(''); setCount(1); setEditing(null); }
  async function save() {
    if (!ready || busy || storageError) return;
    const clean = band.trim().replace(/\s+/g,' ');
    const n = Number(count);
    if (!clean) { notify(festival ? 'フェス名を入力してね' : 'バンド名を入力してね'); return; }
    if (!Number.isInteger(n) || n < 1 || n > 999) { notify('枚数は1〜999の整数で入力してね'); return; }
    const entry: Entry = { id: editing || `${Date.now()}-${Math.random().toString(36).slice(2,8)}`, band: clean, date: editing ? (records.find(r => r.id === editing)?.date ?? today()) : today(), count: n };
    const next = editing ? records.map(r => r.id === editing ? entry : r) : [entry, ...records];
    if (await persist(next)) { setNotice(`${clean}を${editing ? '更新' : '記録'}しました`); clearForm(); }
  }
  function remove(r: Entry) {
    if (Platform.OS === 'web') {
      if (globalThis.confirm('この記録を削除しますか？\n' + r.band + ' / ' + r.date + ' / ' + r.count + '枚')) void persist(records.filter(item => item.id !== r.id));
      return;
    }
    Alert.alert('記録を削除しますか？', `${r.band} / ${r.date} / ${r.count}枚`, [{ text:'キャンセル', style:'cancel' }, { text:'削除', style:'destructive', onPress: () => { void persist(records.filter(item => item.id !== r.id)); } }]);
  }
  const suggestions = band.trim() && showSuggestions ? (festival ? suggestFestivals(band, records) : suggestBands(band, records)) : [];


  return (
    <SafeAreaView style={styles.screen} edges={['top','left','right']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
          <Text style={styles.eyebrow}>{festival ? '街で出会ったフェスTを、記録する。' : '町で出会ったバンドを、記録する。'}</Text>
          <Text style={styles.title}>{festival ? 'FES T NOTES' : 'BAND T NOTES'}</Text>
          <View style={styles.modeRow}>
            <Pressable accessibilityRole="button" accessibilityState={{ selected: !festival }} disabled={busy} onPress={() => onSwitch('band')} style={[styles.modeButton,!festival && styles.selected]}><Text style={!festival ? styles.selectedText : styles.muted}>バンドT</Text></Pressable>
            <Pressable accessibilityRole="button" accessibilityState={{ selected: festival }} disabled={busy} onPress={() => onSwitch('festival')} style={[styles.modeButton,festival && styles.selected]}><Text style={festival ? styles.selectedText : styles.muted}>フェスT</Text></Pressable>
            <Text style={styles.swipeHint}>{festival ? '← バンドTへ' : 'フェスT →'}</Text>
          </View>
          <View style={styles.tabs}>{['記録','統計','履歴'].map(t => <Pressable key={t} accessibilityRole="tab" accessibilityState={{selected:tab===t}} onPress={() => setTab(t)} style={[styles.tab,tab===t && styles.selected]}><Text style={[styles.tabText,tab===t && styles.selectedText]}>{t}</Text></Pressable>)}</View>
          {!ready && <Text style={styles.muted}>記録を読み込んでいます…</Text>}
          {storageError && <Text style={styles.error}>保存データを読み込めませんでした。上書きを防ぐため記録を停止しています。アプリを開き直してください。</Text>}
          {tab === '記録' && <View style={styles.card}>
            <Text style={styles.heading}>{editing ? '記録を編集' : festival ? 'フェスTを見つけたら' : 'バンドTを見つけたら'}</Text>
            <Text style={styles.label}>{festival ? 'フェス名' : 'バンド名'}</Text>
            <TextInput accessibilityLabel={festival ? 'フェス名' : 'バンド名'} value={band} onChangeText={text => { setBand(text); setShowSuggestions(true); }} onFocus={() => setShowSuggestions(true)} autoCorrect={false} placeholderTextColor="#85858F" maxLength={100} style={styles.input} />
            {suggestions.length > 0 && <View style={styles.suggestions}><Text style={styles.note}>候補をタップして入力</Text>{suggestions.map(item => <Pressable accessibilityRole="button" accessibilityLabel={item.name + 'を選択'} key={item.name} onPress={() => { setBand(item.name); setShowSuggestions(false); Keyboard.dismiss(); }} style={styles.suggestion}><Text style={styles.suggestionName}>{item.name}</Text><Text style={styles.note}>{item.used ? '記録済み' : '＋'}</Text></Pressable>)}</View>}
            <View style={{ minHeight: descriptionHeight }}>
              <Text style={styles.note} onLayout={event => measureDescription(mode, event.nativeEvent.layout.height)}>{festival ? 'フェス名や略称で検索。候補にないフェスも記録できます。' : '英字・ひらがな・カタカナで候補を検索できます。候補にない名前もそのまま記録できます。'}</Text>
            </View>
            <Text style={styles.label}>枚数</Text>
            <View style={styles.stepper}>
              <Pressable accessibilityRole="button" accessibilityLabel="枚数を1減らす" disabled={count <= 1 || busy} onPress={() => setCount(n => Math.max(1,n-1))} style={[styles.stepButton,(count<=1 || busy) && styles.disabled]}><Text style={styles.stepSymbol}>−</Text></Pressable>
              <Text accessibilityLiveRegion="polite" style={styles.stepValue}>{count}<Text style={styles.stepUnit}> 枚</Text></Text>
              <Pressable accessibilityRole="button" accessibilityLabel="枚数を1増やす" disabled={count >= 999 || busy} onPress={() => setCount(n => Math.min(999,n+1))} style={[styles.stepButton,(count>=999 || busy) && styles.disabled]}><Text style={styles.stepSymbol}>＋</Text></Pressable>
            </View>
            <Pressable accessibilityRole="button" disabled={!ready || busy || storageError} onPress={() => { void save(); }} style={[styles.primary,(!ready || busy || storageError) && styles.disabled]}><Text style={styles.primaryText}>{busy ? '保存中…' : editing ? '変更を保存する' : '＋ 見つけたTシャツを記録'}</Text></Pressable>
            {editing && <Pressable onPress={clearForm} style={styles.smallButton}><Text style={styles.muted}>編集をキャンセル</Text></Pressable>}
            {!!notice && <Text accessibilityLiveRegion="polite" style={styles.success}>{notice}</Text>}
            <Text style={styles.note}>日付は記録した当日に自動設定。見つけたらその場で記録しよう。</Text>
          </View>}
          {tab === '統計' && <Statistics records={records} mode={mode} today={today()} period={period} onPeriodChange={setPeriod} />}
          {tab === '履歴' && <><Text style={styles.heading}>見つけた記録 · {records.length}件</Text>{!records.length && <View style={styles.card}><Text style={styles.muted}>まだ記録がありません。「記録」から最初の1枚を追加してみよう。</Text></View>}{[...records].sort((a,b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id)).map(r => <View key={r.id} style={styles.card}><View style={styles.row}><Text style={styles.rankName}>{r.band}</Text><Text style={styles.rankCount}>{r.count}枚</Text></View><Text style={styles.muted}>{r.date}</Text><View style={styles.actions}><Pressable disabled={busy} onPress={() => {setBand(r.band);setShowSuggestions(false);setCount(r.count);setEditing(r.id);setNotice('');setTab('記録');}} style={styles.smallButton}><Text style={styles.edit}>編集</Text></Pressable><Pressable disabled={busy} onPress={() => remove(r)} style={styles.smallButton}><Text style={styles.delete}>削除</Text></Pressable></View></View>)}</>}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const createStyles = (accent: string) => StyleSheet.create({
  modeRow:{flexDirection:'row',alignItems:'center',gap:8,flexWrap:'wrap'},modeButton:{paddingHorizontal:14,paddingVertical:10,minHeight:44,borderRadius:22,backgroundColor:'#252530',justifyContent:'center'},swipeHint:{fontSize:11,color:'#9292A3',marginLeft:'auto'},
  stepper:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',backgroundColor:'#121219',borderRadius:14,padding:8},stepButton:{width:56,height:56,borderRadius:12,backgroundColor:'#343440',alignItems:'center',justifyContent:'center'},stepSymbol:{fontSize:28,color:accent,fontWeight:'700'},stepValue:{fontSize:30,fontWeight:'800',color:'#F7F7FB',fontVariant:['tabular-nums']},stepUnit:{fontSize:14,fontWeight:'400'},suggestions:{backgroundColor:'#17171F',borderRadius:14,padding:12,gap:3},suggestion:{minHeight:48,paddingVertical:12,flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:10,borderBottomWidth:1,borderBottomColor:'#30303A'},suggestionName:{color:accent,fontSize:15,fontWeight:'700',flex:1},flex:{flex:1},screen:{flex:1,backgroundColor:'#111116'},content:{padding:22,paddingBottom:48,gap:18},eyebrow:{color:'#B9B9C6',fontSize:12,marginTop:10},title:{fontSize:30,fontWeight:'900',color:'#F7F7FB',letterSpacing:1},tabs:{flexDirection:'row',backgroundColor:'#22222C',borderRadius:16,padding:5,gap:4},tab:{flex:1,padding:13,alignItems:'center',borderRadius:12},tabText:{color:'#B9B9C6',fontWeight:'700'},selected:{backgroundColor:accent},selectedText:{color:'#171A11',fontWeight:'800'},card:{backgroundColor:'#202029',borderRadius:22,padding:20,gap:14},heading:{color:'#F7F7FB',fontSize:19,fontWeight:'800'},label:{color:'#D7D7E1',fontSize:13,fontWeight:'600',marginTop:3},input:{backgroundColor:'#121219',borderWidth:1,borderColor:'#3C3C49',borderRadius:12,color:'#FFFFFF',fontSize:16,padding:14,minHeight:50},primary:{backgroundColor:accent,borderRadius:14,padding:18,alignItems:'center',marginTop:8},primaryText:{color:'#171A11',fontSize:16,fontWeight:'800'},disabled:{opacity:0.4},muted:{color:'#B9B9C6',fontSize:13,lineHeight:21},note:{color:'#9292A3',fontSize:12,lineHeight:20},success:{color:accent,fontSize:14},error:{color:'#FF9C9C',lineHeight:22},filters:{flexDirection:'row',gap:10},chip:{paddingHorizontal:20,paddingVertical:10,borderRadius:24,backgroundColor:'#252530'},summary:{flexDirection:'row',justifyContent:'space-around',padding:22,backgroundColor:'#202029',borderRadius:22},big:{fontSize:42,fontWeight:'800',color:accent},row:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',gap:12},rank:{gap:9,paddingVertical:7},rankName:{color:'#F7F7FB',fontSize:16,fontWeight:'700',flex:1},rankCount:{color:accent,fontWeight:'700',fontSize:15},barTrack:{height:7,borderRadius:4,backgroundColor:'#363642',overflow:'hidden'},bar:{height:7,borderRadius:4,backgroundColor:accent},body:{color:'#F7F7FB',fontSize:15,flex:1},actions:{flexDirection:'row',justifyContent:'flex-end',gap:10},smallButton:{padding:12,minHeight:44},edit:{color:accent},delete:{color:'#FF9C9C'},footer:{fontSize:11,color:'#9292A3',textAlign:'center',lineHeight:19,marginTop:8}
});
