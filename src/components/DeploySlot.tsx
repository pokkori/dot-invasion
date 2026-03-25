import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PixelUnit } from '../types/unit';
import { pixelToHex } from '../utils/colorUtils';

type Props = {
  unit: PixelUnit;
  mana: number;
  selected: boolean;
  onPress: () => void;
};

export default function DeploySlot({ unit, mana, selected, onPress }: Props) {
  const canAfford = mana >= unit.stats.manaCost;

  return (
    <TouchableOpacity
      style={[
        styles.slot,
        selected && styles.selected,
        !canAfford && styles.disabled,
      ]}
      onPress={onPress}
      disabled={!canAfford}
    >
      <View style={styles.miniGrid}>
        {unit.grid.map((pixel, i) => (
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
      <Text style={[styles.name, !canAfford && styles.disabledText]} numberOfLines={1}>
        {unit.name}
      </Text>
      <Text style={[styles.cost, !canAfford && styles.disabledText]}>
        C:{unit.stats.manaCost}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  slot: {
    backgroundColor: '#1E1E3A',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333366',
    flex: 1,
    maxWidth: 100,
  },
  selected: {
    borderColor: '#FFD700',
    borderWidth: 2,
    backgroundColor: '#2A2A4A',
  },
  disabled: {
    opacity: 0.4,
  },
  miniGrid: {
    width: 30,
    height: 30,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  name: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 4,
  },
  cost: {
    color: '#66BBFF',
    fontSize: 10,
    marginTop: 2,
  },
  disabledText: {
    color: '#555566',
  },
});
