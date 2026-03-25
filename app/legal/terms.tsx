import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function TermsPage() {
  const router = useRouter();

  return (
    <ScrollView
      style={styles.container}
      accessibilityLabel="利用規約ページ"
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
          利用規約
        </Text>

        <Text style={styles.section}>第1条（サービスの利用）</Text>
        <Text style={styles.body}>
          ドット侵略（以下「本アプリ」）は個人利用を目的としたゲームアプリです。本規約に同意した上でご利用ください。
        </Text>

        <Text style={styles.section}>第2条（禁止事項）</Text>
        <Text style={styles.body}>
          {'・本アプリのリバースエンジニアリング\n・チートツール・改造ツールの使用\n・法令に反する利用\n・第三者への権利侵害行為'}
        </Text>

        <Text style={styles.section}>第3条（課金について）</Text>
        <Text style={styles.body}>
          本アプリ内のアイテム購入はApp Storeを通じて行われます。購入したデジタルコンテンツの返金は、デジタルコンテンツの性質上対応できません。
        </Text>

        <Text style={styles.section}>第4条（免責事項）</Text>
        <Text style={styles.body}>
          本アプリの利用によって生じた損害について、開発者は一切の責任を負いません。
        </Text>

        <Text style={styles.section}>第5条（変更・終了）</Text>
        <Text style={styles.body}>
          開発者は予告なく本サービスの内容変更・終了ができるものとします。
        </Text>

        <Text style={styles.section}>第6条（準拠法）</Text>
        <Text style={styles.body}>
          本規約は日本法に準拠し、解釈されるものとします。
        </Text>

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
