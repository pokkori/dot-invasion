import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function TokushoPage() {
  const router = useRouter();

  const rows: [string, string][] = [
    ['販売事業者', '個人事業主'],
    ['所在地', '請求があり次第提供いたします'],
    ['電話番号', '請求があり次第提供いたします'],
    ['メールアドレス', 'support@example.com'],
    ['販売価格', 'アプリ内課金（App Store表示価格）'],
    ['支払時期・方法', 'App Store経由の決済'],
    ['サービス提供時期', '決済完了後即時'],
    ['返品・キャンセル', 'デジタルコンテンツの性質上、返金不可'],
    ['動作環境', 'iOS 16.0以上'],
  ];

  return (
    <ScrollView
      style={styles.container}
      accessibilityLabel="特定商取引法に基づく表記ページ"
    >
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="前の画面に戻る"
          accessibilityHint="設定画面に戻ります"
        >
          <Text style={styles.backText}>← 戻る</Text>
        </TouchableOpacity>

        <Text style={styles.title} accessibilityRole="header">
          特定商取引法に基づく表記
        </Text>

        {rows.map(([label, value]) => (
          <View
            key={label}
            style={styles.row}
            accessibilityLabel={`${label}: ${value}`}
          >
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D1A' },
  content: { padding: 20 },
  backButton: {
    marginBottom: 16,
    minHeight: 44,
    justifyContent: 'center',
  },
  backText: { color: '#AAAACC', fontSize: 16 },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingVertical: 12,
  },
  label: { flex: 1, color: '#9CA3AF', fontSize: 14 },
  value: { flex: 2, color: '#FFFFFF', fontSize: 14 },
});
