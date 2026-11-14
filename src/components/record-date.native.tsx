import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Keyboard, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export function RecordDate({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const parts = value.split('-').map(Number);
  const parsed = new Date(parts[0], parts[1] - 1, parts[2], 12);
  const selected = Number.isNaN(parsed.getTime()) ? new Date() : parsed;
  return <View style={styles.container}>
    <View style={styles.row}>
      <TextInput accessibilityLabel="見かけた日" value={value} onChangeText={onChange} maxLength={10} placeholder="YYYY-MM-DD" placeholderTextColor="#85858F" autoCapitalize="none" style={styles.input} />
      <Pressable accessibilityRole="button" accessibilityLabel="カレンダーで日付を選ぶ" accessibilityState={{ expanded: open }} onPress={() => { Keyboard.dismiss(); setOpen(!open); }} style={styles.icon}><Text style={styles.iconText}>📅</Text></Pressable>
    </View>
    {open && <View style={styles.calendar}>
      <DateTimePicker value={selected} mode="date" display={Platform.OS === 'ios' ? 'inline' : 'default'} locale="ja-JP" themeVariant="dark" accentColor="#D8FF66"
        onValueChange={(_, date) => { onChange(`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`); if (Platform.OS !== 'ios') setOpen(false); }} onDismiss={() => setOpen(false)} />
      {Platform.OS === 'ios' && <Pressable accessibilityRole="button" onPress={() => setOpen(false)} style={styles.done}><Text style={styles.doneText}>完了</Text></Pressable>}
    </View>}
  </View>;
}
const styles = StyleSheet.create({
  container: { gap: 10 }, row: { flexDirection: 'row', gap: 10 },
  input: { flex: 1, minWidth: 0, backgroundColor: '#121219', borderWidth: 1, borderColor: '#3C3C49', borderRadius: 12, color: '#FFFFFF', fontSize: 16, padding: 14, minHeight: 50 },
  icon: { width: 54, minHeight: 50, alignItems: 'center', justifyContent: 'center', backgroundColor: '#343440', borderRadius: 12 }, iconText: { fontSize: 25 },
  calendar: { backgroundColor: '#121219', borderRadius: 16, overflow: 'hidden' }, done: { minHeight: 48, padding: 14, alignItems: 'center' }, doneText: { color: '#D8FF66', fontSize: 16, fontWeight: '700' },
});
