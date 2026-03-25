import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { usePlayerStore } from '../../src/stores/playerStore';
import { useBattleStore } from '../../src/stores/battleStore';
import { AI_OPPONENTS } from '../../src/constants/ai-opponents';
import { STAGE_ZONES } from '../../src/constants/stages';
import { pixelToHex } from '../../src/utils/colorUtils';
import { IconSvg } from '../../src/components/IconSvg';

export default function BattleSelectScreen() {
  const router = useRouter();
  const data = usePlayerStore(s => s.data);
  const setOpponent = useBattleStore(s => s.setOpponent);

  const handleSelect = (stageNumber: number) => {
    const opponent = AI_OPPONENTS.find(o => o.stageNumber === stageNumber);
    if (!opponent) return;
    setOpponent(opponent);
    router.push('/battle/deploy');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>← 戻る</Text>
      </TouchableOpacity>
      <Text style={styles.header}>ステージ選択</Text>

      {STAGE_ZONES.map(zone => (
        <View key={zone.name}>
          <Text style={styles.zoneTitle}>
            ステージ {zone.stages[0]}-{zone.stages[zone.stages.length - 1]}: {zone.name}
          </Text>

          {zone.stages.map(stageNum => {
            const opponent = AI_OPPONENTS.find(o => o.stageNumber === stageNum);
            if (!opponent) return null;

            const isCleared = data.progress.clearedStages.includes(stageNum);
            const isUnlocked = stageNum <= data.progress.currentStage;
            const stars = isCleared ? (opponent.difficulty === 'hard' ? '★★★' : opponent.difficulty === 'normal' ? '★★☆' : '★☆☆') : '☆☆☆';

            return (
              <View
                key={stageNum}
                style={[styles.stageCard, !isUnlocked && styles.locked]}
              >
                <View style={styles.stageHeader}>
                  <Text style={styles.stageStars}>{stars}</Text>
                  <Text style={[styles.stageName, !isUnlocked && styles.lockedText]}>{opponent.name}</Text>
                </View>

                {/* Avatar */}
                <View style={styles.avatarRow}>
                  <View style={styles.avatar}>
                    {opponent.avatar.map((pixel, i) => (
                      <View
                        key={i}
                        style={{
                          width: 10,
                          height: 10,
                          backgroundColor: pixel.a > 0 ? pixelToHex(pixel) : '#1A1A2E',
                        }}
                      />
                    ))}
                  </View>
                  <View style={styles.stageInfo}>
                    <Text style={[styles.stageDesc, !isUnlocked && styles.lockedText]}>
                      {isUnlocked ? opponent.description : `ステージ${stageNum - 1}クリアで解放`}
                    </Text>
                    {isUnlocked && (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <Text style={styles.rewardText}>報酬: </Text>
                        <IconSvg name="coin" size={14} />
                        <Text style={styles.rewardText}>{opponent.rewardCoins}</Text>
                      </View>
                    )}
                  </View>
                </View>

                {isUnlocked && (
                  <TouchableOpacity
                    style={styles.challengeButton}
                    onPress={() => handleSelect(stageNum)}
                  >
                    <Text style={styles.challengeText}>挑戦する</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A1E' },
  content: { paddingTop: 56, paddingHorizontal: 16, paddingBottom: 40 },
  backButton: { marginBottom: 8 },
  backText: { color: '#AAAACC', fontSize: 16 },
  header: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center', marginBottom: 20 },
  zoneTitle: { color: '#FFD700', fontSize: 15, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  stageCard: {
    backgroundColor: '#1E1E3A', borderRadius: 10, padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: '#333366',
  },
  locked: { opacity: 0.5 },
  stageHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  stageStars: { color: '#FFD700', fontSize: 14, marginRight: 8 },
  stageName: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  lockedText: { color: '#666688' },
  avatarRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 30, height: 30, flexDirection: 'row', flexWrap: 'wrap', marginRight: 12 },
  stageInfo: { flex: 1 },
  stageDesc: { color: '#AAAACC', fontSize: 13 },
  rewardText: { color: '#FFD700', fontSize: 12, marginTop: 2 },
  challengeButton: {
    backgroundColor: '#CC2200', borderRadius: 8, paddingVertical: 10,
    alignItems: 'center', marginTop: 10,
  },
  challengeText: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },
});
