import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PixelUnit } from '../types/unit';
import { pixelToHex } from '../utils/colorUtils';
import { getUnitClassIcon } from '../engine/UnitFactory';

type Props = {
  unit: PixelUnit;
  onPress?: () => void;
  onLongPress?: () => void;
  compact?: boolean;
  selected?: boolean;
};

export default function UnitCard({ unit, onPress, onLongPress, compact = false, selected = false }: Props) {
  const gridSize = compact ? 10 : 16;

  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.selectedCard, compact && styles.compactCard]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      {/* Mini pixel grid */}
      <View style={[styles.miniGrid, { width: gridSize * 3, height: gridSize * 3 }]}>
        {unit.grid.map((pixel, i) => (
          <View
            key={i}
            style={{
              width: gridSize,
              height: gridSize,
              backgroundColor: pixel.a > 0 ? pixelToHex(pixel) : '#1A1A2E',
            }}
          />
        ))}
      </View>

      {!compact && (
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>{unit.name}</Text>
          <Text style={styles.classText}>
            {getUnitClassIcon(unit.unitClass)} ATK{unit.stats.attack} C:{unit.stats.manaCost}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E1E3A',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333366',
  },
  compactCard: {
    padding: 4,
  },
  selectedCard: {
    borderColor: '#FFD700',
    borderWidth: 2,
  },
  miniGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  info: {
    marginTop: 4,
    alignItems: 'center',
  },
  name: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  classText: {
    color: '#AAAACC',
    fontSize: 9,
    marginTop: 2,
  },
});
