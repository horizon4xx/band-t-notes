import { StyleSheet, TextInput } from 'react-native';

export function RecordDate({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <TextInput accessibilityLabel="見かけた日（YYYY-MM-DD）" value={value} onChangeText={onChange} placeholder="YYYY-MM-DD" maxLength={10} style={styles.input} />;
}
const styles = StyleSheet.create({ input: { backgroundColor: '#121219', borderWidth: 1, borderColor: '#3C3C49', borderRadius: 12, color: '#FFFFFF', fontSize: 16, padding: 14, minHeight: 50 } });
