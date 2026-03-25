import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Switch, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Link } from 'expo-router';
import { usePlayerStore } from '../src/stores/playerStore';

export default function SettingsScreen() {
  const router = useRouter();
  const data = usePlayerStore(s => s.data);
  const save = usePlayerStore(s => s.save);

  const updateSettings = async (partial: Partial<typeof data.settings>) => {
    const store = usePlayerStore.getState();
    store.data.settings = { ...store.data.settings, ...partial };
    usePlayerStore.setState({ data: { ...store.data } });
    await save();
  };

  const handleReset = () => {
    Alert.alert(
      'データリセット',
      '全てのデータが削除されます。元に戻せません。',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: 'リセット', style: 'destructive', onPress: async () => {
            const AsyncStorage = require('@react-native-async-storage/async-storage').default;
            await AsyncStorage.clear();
            Alert.alert('完了', 'アプリを再起動してください');
          }
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.backButton}
        accessibilityRole="button"
        accessibilityLabel="前の画面に戻る"
        accessibilityHint="ホーム画面に戻ります"
      >
        <Text style={styles.backText}>← 戻る</Text>
      </TouchableOpacity>
      <Text style={styles.header} accessibilityRole="header">設定</Text>

      <View
        style={styles.row}
        accessibilityLabel="サウンド設定"
      >
        <Text style={styles.label}>サウンド</Text>
        <Switch
          value={data.settings.soundEnabled}
          onValueChange={(v) => updateSettings({ soundEnabled: v })}
          trackColor={{ false: '#333366', true: '#2266AA' }}
          accessibilityLabel={`サウンド ${data.settings.soundEnabled ? 'オン' : 'オフ'}`}
          accessibilityHint="タップしてサウンドのオン/オフを切り替えます"
        />
      </View>

      <View
        style={styles.row}
        accessibilityLabel="振動フィードバック設定"
      >
        <Text style={styles.label}>振動フィードバック</Text>
        <Switch
          value={data.settings.hapticEnabled}
          onValueChange={(v) => updateSettings({ hapticEnabled: v })}
          trackColor={{ false: '#333366', true: '#2266AA' }}
          accessibilityLabel={`振動フィードバック ${data.settings.hapticEnabled ? 'オン' : 'オフ'}`}
          accessibilityHint="タップして振動フィードバックのオン/オフを切り替えます"
        />
      </View>

      <View
        style={styles.row}
        accessibilityLabel="通知設定"
      >
        <Text style={styles.label}>通知</Text>
        <Switch
          value={data.settings.notificationsEnabled}
          onValueChange={(v) => updateSettings({ notificationsEnabled: v })}
          trackColor={{ false: '#333366', true: '#2266AA' }}
          accessibilityLabel={`通知 ${data.settings.notificationsEnabled ? 'オン' : 'オフ'}`}
          accessibilityHint="タップして通知のオン/オフを切り替えます"
        />
      </View>

      {/* Battle Speed */}
      <View style={styles.row} accessibilityLabel="バトル速度設定">
        <Text style={styles.label}>バトル速度</Text>
        <View style={styles.speedButtons}>
          {([1, 1.5, 2] as const).map(s => (
            <TouchableOpacity
              key={s}
              style={[styles.speedButton, data.settings.battleSpeed === s && styles.speedActive]}
              onPress={() => updateSettings({ battleSpeed: s })}
              accessibilityRole="button"
              accessibilityLabel={`バトル速度 ${s}倍${data.settings.battleSpeed === s ? ' 現在選択中' : ''}`}
              accessibilityHint={`バトル速度を${s}倍に設定します`}
            >
              <Text style={[styles.speedText, data.settings.battleSpeed === s && styles.speedTextActive]}>
                {s}x
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Account */}
      <Text style={styles.sectionTitle}>アカウント</Text>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={handleReset}
        accessibilityRole="button"
        accessibilityLabel="全データをリセットする"
        accessibilityHint="タップすると全てのゲームデータが削除されます。この操作は元に戻せません"
      >
        <Text style={styles.dangerText}>データリセット</Text>
      </TouchableOpacity>

      {/* Info */}
      <Text style={styles.sectionTitle}>情報</Text>
      <View style={styles.menuItem} accessibilityLabel="アプリバージョン 1.0.0">
        <Text style={styles.menuText}>バージョン: 1.0.0</Text>
      </View>

      {/* Legal */}
      <Text style={styles.sectionTitle}>法的情報</Text>
      <Link
        href="/legal"
        style={styles.legalItem}
        accessibilityRole="link"
        accessibilityLabel="特定商取引法に基づく表記を見る"
      >
        特定商取引法に基づく表記
      </Link>
      <Link
        href="/legal/privacy"
        style={styles.legalItem}
        accessibilityRole="link"
        accessibilityLabel="プライバシーポリシーを見る"
      >
        プライバシーポリシー
      </Link>
      <Link
        href="/legal/terms"
        style={styles.legalItem}
        accessibilityRole="link"
        accessibilityLabel="利用規約を見る"
      >
        利用規約
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A1E' },
  content: { paddingTop: 56, paddingHorizontal: 20, paddingBottom: 40 },
  backButton: { marginBottom: 8 },
  backText: { color: '#AAAACC', fontSize: 16 },
  header: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center', marginBottom: 24 },
  row: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#1E1E3A',
  },
  label: { color: '#FFFFFF', fontSize: 16 },
  sectionTitle: { color: '#FFD700', fontSize: 14, fontWeight: 'bold', marginTop: 24, marginBottom: 8 },
  speedButtons: { flexDirection: 'row', gap: 8 },
  speedButton: {
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 6,
    backgroundColor: '#1E1E3A', borderWidth: 1, borderColor: '#333366',
  },
  speedActive: { backgroundColor: '#2266AA', borderColor: '#4488CC' },
  speedText: { color: '#AAAACC', fontSize: 14 },
  speedTextActive: { color: '#FFFFFF', fontWeight: 'bold' },
  menuItem: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#1E1E3A' },
  menuText: { color: '#AAAACC', fontSize: 14 },
  dangerText: { color: '#FF4444', fontSize: 16 },
  legalItem: {
    display: 'flex',
    color: '#AAAACC',
    fontSize: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1E1E3A',
    minHeight: 44,
  },
});
