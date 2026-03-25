import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Link } from 'expo-router';
import { usePlayerStore } from '../../src/stores/playerStore';
import { pixelToHex } from '../../src/utils/colorUtils';
import { IconSvg } from '../../src/components/IconSvg';

export default function HomeScreen() {
  const router = useRouter();
  const data = usePlayerStore(s => s.data);
  const getDeckUnits = usePlayerStore(s => s.getDeckUnits);

  const deckUnits = getDeckUnits();
  const representativeUnit = deckUnits[0] || data.inventory.units[0];

  const recentMatches = data.progress.matchHistory.slice(0, 5);
  const winRate = data.stats.totalBattles > 0
    ? Math.round((data.progress.totalWins / data.stats.totalBattles) * 100)
    : 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Title */}
      <Text style={styles.title}>PIXEL SIEGE</Text>
      <Text style={styles.subtitle}>ドット侵略</Text>

      {/* Player Card */}
      <View style={styles.playerCard}>
        {representativeUnit && (
          <View style={styles.unitPreview}>
            {representativeUnit.grid.map((pixel, i) => (
              <View
                key={i}
                style={{
                  width: 16,
                  height: 16,
                  backgroundColor: pixel.a > 0 ? pixelToHex(pixel) : '#1A1A2E',
                }}
              />
            ))}
          </View>
        )}
        <View style={styles.playerInfo}>
          <Text style={styles.playerName}>
            {data.profile.name || 'プレイヤー'} {data.progress.totalWins > 0 ? `勝率 ${winRate}%` : ''}
          </Text>
          <View style={styles.currencyRow}>
            <IconSvg name="coin" size={16} />
            <Text style={styles.currency}>{data.inventory.coins.toLocaleString()}</Text>
            <IconSvg name="gem" size={16} />
            <Text style={styles.currency}>{data.inventory.gems}</Text>
          </View>
        </View>
      </View>

      {/* Main Battle Button */}
      <TouchableOpacity
        style={styles.mainButton}
        onPress={() => router.push('/battle/select')}
        accessibilityRole="button"
        accessibilityLabel={`出撃 ステージ${data.progress.currentStage}に挑む`}
        accessibilityHint="バトル選択画面に移動します"
      >
        <Text style={styles.mainButtonText}>
          出 撃（ステージ {data.progress.currentStage}）
        </Text>
      </TouchableOpacity>

      {/* Sub Buttons */}
      <View style={styles.subButtons}>
        <TouchableOpacity
          style={styles.subButton}
          onPress={() => router.push('/battle/select')}
          accessibilityRole="button"
          accessibilityLabel="フリーバトル ランダムAIと対戦"
          accessibilityHint="ランダムなAIとバトルします"
        >
          <Text style={styles.subButtonText}>フリーバトル</Text>
          <Text style={styles.subButtonSub}>(ランダムAI)</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.subButton}
          accessibilityRole="button"
          accessibilityLabel="今日のチャレンジ コイン200報酬"
          accessibilityHint="デイリーチャレンジに挑戦します"
        >
          <Text style={styles.subButtonText}>今日のチャレンジ</Text>
          <Text style={styles.subButtonSub}>報酬: コイン200</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Battles */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>戦績</Text>
        <View style={styles.recentRow}>
          <Text style={styles.recentLabel}>直近5戦: </Text>
          <Text style={styles.recentResults}>
            {recentMatches.length === 0
              ? 'まだ戦績がありません'
              : recentMatches.map((m, i) =>
                  m.winner === 'player' ? '○' : m.winner === 'enemy' ? '×' : '△'
                ).join('')}
          </Text>
        </View>
        <Text style={styles.streakText}>連勝記録: {data.stats.longestWinStreak}</Text>
      </View>

      {/* Settings link */}
      <TouchableOpacity
        style={styles.settingsLink}
        onPress={() => router.push('/settings')}
        accessibilityRole="button"
        accessibilityLabel="設定画面を開く"
        accessibilityHint="サウンド・通知などの設定を変更します"
      >
        <Text style={styles.settingsText}>設定</Text>
      </TouchableOpacity>

      {/* Legal Links */}
      <View style={styles.legalRow}>
        <Link
          href="/legal"
          style={styles.legalLink}
          accessibilityRole="link"
          accessibilityLabel="特定商取引法に基づく表記"
        >
          特商法
        </Link>
        <Text style={styles.legalSep}>|</Text>
        <Link
          href="/legal/privacy"
          style={styles.legalLink}
          accessibilityRole="link"
          accessibilityLabel="プライバシーポリシーを見る"
        >
          プライバシー
        </Link>
        <Text style={styles.legalSep}>|</Text>
        <Link
          href="/legal/terms"
          style={styles.legalLink}
          accessibilityRole="link"
          accessibilityLabel="利用規約を見る"
        >
          利用規約
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A1E',
  },
  content: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    textShadowColor: '#FF8800',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#AAAACC',
    textAlign: 'center',
    marginBottom: 24,
  },
  playerCard: {
    backgroundColor: '#1E1E3A',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#333366',
  },
  unitPreview: {
    width: 48,
    height: 48,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  playerInfo: {
    marginLeft: 16,
    flex: 1,
  },
  playerName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  currencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  currency: {
    color: '#CCCCEE',
    fontSize: 14,
  },
  mainButton: {
    backgroundColor: '#CC2200',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#FF4422',
  },
  mainButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  subButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  subButton: {
    flex: 1,
    backgroundColor: '#1E1E3A',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333366',
  },
  subButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  subButtonSub: {
    color: '#888899',
    fontSize: 11,
    marginTop: 4,
  },
  section: {
    backgroundColor: '#1E1E3A',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333366',
  },
  sectionTitle: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentLabel: {
    color: '#AAAACC',
    fontSize: 13,
  },
  recentResults: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  streakText: {
    color: '#AAAACC',
    fontSize: 13,
    marginTop: 4,
  },
  settingsLink: {
    alignItems: 'center',
    marginTop: 8,
  },
  settingsText: {
    color: '#888899',
    fontSize: 14,
  },
  legalRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    paddingBottom: 8,
    gap: 4,
  },
  legalLink: {
    color: '#555577',
    fontSize: 12,
    paddingHorizontal: 6,
    paddingVertical: 4,
    minHeight: 44,
    textAlignVertical: 'center',
  },
  legalSep: {
    color: '#333355',
    fontSize: 12,
  },
});
