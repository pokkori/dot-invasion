import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { usePlayerStore } from '../../src/stores/playerStore';
import { PixelUnit, Deck } from '../../src/types/unit';
import UnitCard from '../../src/components/UnitCard';
import { getUnitClassName, getUnitClassIcon } from '../../src/engine/UnitFactory';
import { pixelToHex } from '../../src/utils/colorUtils';

export default function ArmyScreen() {
  const router = useRouter();
  const data = usePlayerStore(s => s.data);
  const updateDeck = usePlayerStore(s => s.updateDeck);
  const removeUnit = usePlayerStore(s => s.removeUnit);
  const save = usePlayerStore(s => s.save);
  const getActiveDeck = usePlayerStore(s => s.getActiveDeck);
  const getDeckUnits = usePlayerStore(s => s.getDeckUnits);

  const [selectedForDeck, setSelectedForDeck] = useState<number | null>(null);

  const activeDeck = getActiveDeck();
  const deckUnits = getDeckUnits();
  const allUnits = data.inventory.units;

  const handleUnitTap = (unit: PixelUnit) => {
    if (selectedForDeck !== null && activeDeck) {
      // Add unit to deck slot
      const newIds = [...activeDeck.unitIds] as [string, string, string];
      newIds[selectedForDeck] = unit.id;
      updateDeck({ ...activeDeck, unitIds: newIds });
      save();
      setSelectedForDeck(null);
    } else {
      // Show detail
      Alert.alert(
        unit.name,
        `兵種: ${getUnitClassIcon(unit.unitClass)} ${getUnitClassName(unit.unitClass)}\nHP: ${unit.stats.hp} ATK: ${unit.stats.attack} DEF: ${unit.stats.defense}\nSPD: ${unit.stats.speed} COST: ${unit.stats.manaCost}\n勝利: ${unit.wins} 敗北: ${unit.losses}`,
        [
          { text: '閉じる' },
          ...(!unit.isPreset ? [{ text: '削除', style: 'destructive' as const, onPress: () => {
            removeUnit(unit.id);
            save();
          }}] : []),
        ]
      );
    }
  };

  const handleDeckSlotTap = (index: number) => {
    if (selectedForDeck === index) {
      setSelectedForDeck(null);
    } else {
      setSelectedForDeck(index);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>軍団管理</Text>

      {/* Active Deck */}
      <Text style={styles.sectionTitle}>出撃デッキ</Text>
      <View style={styles.deckRow}>
        {[0, 1, 2].map(i => {
          const unit = deckUnits[i];
          return (
            <TouchableOpacity
              key={i}
              style={[styles.deckSlot, selectedForDeck === i && styles.deckSlotSelected]}
              onPress={() => handleDeckSlotTap(i)}
              accessibilityRole="button"
              accessibilityLabel={unit ? `デッキスロット${i + 1}: ${unit.name} ATK${unit.stats.attack} コスト${unit.stats.manaCost}` : `デッキスロット${i + 1}: 空`}
              accessibilityHint={selectedForDeck === i ? 'もう一度タップして選択解除' : 'タップしてユニットを配置するスロットを選択'}
            >
              {unit ? (
                <>
                  <View style={styles.miniGrid}>
                    {unit.grid.map((pixel, pi) => (
                      <View
                        key={pi}
                        style={{
                          width: 14,
                          height: 14,
                          backgroundColor: pixel.a > 0 ? pixelToHex(pixel) : '#1A1A2E',
                        }}
                      />
                    ))}
                  </View>
                  <Text style={styles.deckUnitName} numberOfLines={1}>{unit.name}</Text>
                  <Text style={styles.deckUnitStat}>ATK{unit.stats.attack} C:{unit.stats.manaCost}</Text>
                </>
              ) : (
                <Text style={styles.emptySlot}>空</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
      {selectedForDeck !== null && (
        <Text style={styles.hintText}>下のユニットをタップしてデッキに配置</Text>
      )}

      {/* All Units */}
      <Text style={styles.sectionTitle}>所持ユニット ({allUnits.length}/50)</Text>
      <View style={styles.unitsGrid}>
        {allUnits.map(unit => (
          <View key={unit.id} style={styles.unitWrapper}>
            <UnitCard
              unit={unit}
              onPress={() => handleUnitTap(unit)}
              compact={false}
            />
          </View>
        ))}
      </View>

      {/* Create New */}
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => router.push('/(tabs)/editor')}
        accessibilityRole="button"
        accessibilityLabel="新規ユニットを作成する"
        accessibilityHint="ドット絵エディタでユニットを作成します"
      >
        <Text style={styles.createButtonText}>＋ 新規作成</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A1E' },
  content: { paddingTop: 56, paddingHorizontal: 16, paddingBottom: 40 },
  header: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center', marginBottom: 20 },
  sectionTitle: { color: '#FFD700', fontSize: 14, fontWeight: 'bold', marginBottom: 8, marginTop: 12 },
  deckRow: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 8 },
  deckSlot: {
    backgroundColor: '#1E1E3A', borderRadius: 10, padding: 10, alignItems: 'center',
    borderWidth: 1, borderColor: '#333366', width: 100,
  },
  deckSlotSelected: { borderColor: '#FFD700', borderWidth: 2 },
  miniGrid: { width: 42, height: 42, flexDirection: 'row', flexWrap: 'wrap' },
  deckUnitName: { color: '#FFFFFF', fontSize: 11, fontWeight: 'bold', marginTop: 4 },
  deckUnitStat: { color: '#AAAACC', fontSize: 10, marginTop: 2 },
  emptySlot: { color: '#666688', fontSize: 14, paddingVertical: 16 },
  hintText: { color: '#FFD700', fontSize: 12, textAlign: 'center', marginBottom: 8 },
  unitsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  unitWrapper: { width: '23%' },
  createButton: {
    backgroundColor: '#2A2A4A', borderRadius: 10, padding: 16,
    alignItems: 'center', marginTop: 20, borderWidth: 1, borderColor: '#444488',
    borderStyle: 'dashed',
  },
  createButtonText: { color: '#AAAACC', fontSize: 16, fontWeight: 'bold' },
});
