import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <ScrollView
      style={styles.container}
      accessibilityLabel="プライバシーポリシーページ"
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
          プライバシーポリシー
        </Text>

        <Text style={styles.section}>1. 収集する情報</Text>
        <Text style={styles.body}>
          ドット侵略は、ゲームプレイデータ（スコア・実績・ユニットデータ）をデバイス内にのみ保存します。個人情報の収集は行いません。
        </Text>

        <Text style={styles.section}>2. 使用する第三者サービス</Text>
        <Text style={styles.body}>
          {'• Expo SDK: アプリフレームワーク\n• expo-notifications: プッシュ通知（ローカル通知のみ）\n• expo-av: サウンド再生\n• expo-haptics: 振動フィードバック'}
        </Text>

        <Text style={styles.section}>3. データの保存場所</Text>
        <Text style={styles.body}>
          全てのゲームデータはお使いのデバイス上にローカルで保存されます。外部サーバーへの送信は行いません。
        </Text>

        <Text style={styles.section}>4. データの削除</Text>
        <Text style={styles.body}>
          設定画面の「データリセット」機能から全データを削除できます。アプリを削除した場合も全データが削除されます。
        </Text>

        <Text style={styles.section}>5. お問い合わせ</Text>
        <Text style={styles.body}>support@example.com</Text>

        <Text style={styles.updated}>最終更新日: 2025年12月1日</Text>
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
  section: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2DD4BF',
    marginTop: 20,
    marginBottom: 8,
  },
  body: { fontSize: 14, color: '#D1D5DB', lineHeight: 22 },
  updated: { fontSize: 12, color: '#666688', marginTop: 32 },
});
