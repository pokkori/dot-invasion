import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { usePlayerStore } from '../../src/stores/playerStore';
import { useBattleStore } from '../../src/stores/battleStore';
import { MatchResult } from '../../src/types/battle';
import { generateId } from '../../src/utils/mathUtils';
import { IconSvg } from '../../src/components/IconSvg';

export default function BattleResultScreen() {
  const router = useRouter();
  const battleState = useBattleStore(s => s.battleState);
  const opponent = useBattleStore(s => s.opponent);
  const reset = useBattleStore(s => s.reset);
  const addCoins = usePlayerStore(s => s.addCoins);
  const addMatchResult = usePlayerStore(s => s.addMatchResult);
  const clearStage = usePlayerStore(s => s.clearStage);
  const unlockColor = usePlayerStore(s => s.unlockColor);
  const save = usePlayerStore(s => s.save);

  const isWin = battleState?.winner === 'player';
  const isDraw = battleState?.winner === 'draw';
  const duration = battleState ? Math.floor(battleState.frameCount / 60) : 0;
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  useEffect(() => {
    if (!battleState || !opponent) return;

    const coins = isWin ? opponent.rewardCoins : 30;
    addCoins(coins);

    if (isWin) {
      clearStage(opponent.stageNumber);
      if (opponent.rewardColorId) {
        unlockColor(opponent.rewardColorId);
      }
    }

    const result: MatchResult = {
      id: generateId(),
      timestamp: Date.now(),
      opponentId: opponent.id,
      opponentName: opponent.name,
      winner: battleState.winner || 'draw',
      playerDeckIds: battleState.playerDeck.map(u => u.id),
      duration: battleState.frameCount,
      playerCastleHpRemaining: battleState.playerCastle.currentHp,
      enemyCastleHpRemaining: battleState.enemyCastle.currentHp,
      totalDamageDealt: 0,
      totalDamageReceived: 0,
      unitsDeployed: 0,
      unitsLost: 0,
      rewards: { xp: 0, unlockedColors: isWin && opponent.rewardColorId ? [opponent.rewardColorId] : [], coins },
    };
    addMatchResult(result);
    save();
  }, []);

  const handleGoHome = () => {
    reset();
    router.replace('/(tabs)/home');
  };

  const handleRetry = () => {
    reset();
    router.replace('/battle/select');
  };

  if (!battleState || !opponent) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Result Title */}
      <Text style={[styles.resultTitle, isWin ? styles.victory : isDraw ? styles.draw : styles.defeat]}>
        {isWin ? '⚔️ VICTORY! ⚔️' : isDraw ? '△ DRAW △' : 'DEFEAT...'}
      </Text>

      <Text style={styles.opponentName}>vs {opponent.name}</Text>

      {/* Stats */}
      <View style={styles.statsCard}>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>戦闘時間</Text>
          <Text style={styles.statValue}>{minutes}:{seconds.toString().padStart(2, '0')}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>自城残HP</Text>
          <Text style={styles.statValue}>{Math.max(0, Math.round(battleState.playerCastle.currentHp))}/{battleState.playerCastle.maxHp}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>敵城残HP</Text>
          <Text style={styles.statValue}>{Math.max(0, Math.round(battleState.enemyCastle.currentHp))}/{battleState.enemyCastle.maxHp}</Text>
        </View>
      </View>

      {/* Rewards */}
      <View style={styles.rewardsCard}>
        <Text style={styles.rewardsTitle}>報酬</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <IconSvg name="coin" size={16} />
          <Text style={styles.rewardItem}>+{isWin ? opponent.rewardCoins : 30}コイン</Text>
        </View>
        {isWin && opponent.rewardColorId && (
          <Text style={styles.rewardItem}>新色アンロック！</Text>
        )}
      </View>

      {/* Actions */}
      <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
        <Text style={styles.buttonText}>もう一度</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
        <Text style={styles.buttonText}>ホームに戻る</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A1E' },
  content: { paddingTop: 80, paddingHorizontal: 20, paddingBottom: 40, alignItems: 'center' },
  loadingText: { color: '#FFFFFF', fontSize: 18, textAlign: 'center', marginTop: 100 },
  resultTitle: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  victory: { color: '#FFD700', textShadowColor: '#FF8800', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 16 },
  defeat: { color: '#888888' },
  draw: { color: '#AAAACC' },
  opponentName: { color: '#AAAACC', fontSize: 16, marginBottom: 24 },
  statsCard: {
    backgroundColor: '#1E1E3A', borderRadius: 10, padding: 16, width: '100%',
    borderWidth: 1, borderColor: '#333366', marginBottom: 16,
  },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  statLabel: { color: '#AAAACC', fontSize: 14 },
  statValue: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },
  rewardsCard: {
    backgroundColor: '#1E1E3A', borderRadius: 10, padding: 16, width: '100%',
    borderWidth: 1, borderColor: '#333366', marginBottom: 24,
  },
  rewardsTitle: { color: '#FFD700', fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  rewardItem: { color: '#FFFFFF', fontSize: 15, marginVertical: 4 },
  retryButton: {
    backgroundColor: '#2266AA', borderRadius: 10, paddingVertical: 14, width: '100%',
    alignItems: 'center', marginBottom: 12,
  },
  homeButton: {
    backgroundColor: '#1E1E3A', borderRadius: 10, paddingVertical: 14, width: '100%',
    alignItems: 'center', borderWidth: 1, borderColor: '#333366',
  },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});
