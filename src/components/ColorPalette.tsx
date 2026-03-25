import React from 'react';
import { View, TouchableOpacity, ScrollView, Text, StyleSheet } from 'react-native';
import { PaletteColor, PixelColor } from '../types/unit';
import { colorsEqual } from '../utils/colorUtils';

type Props = {
  colors: PaletteColor[];
  selectedColor: PixelColor | null;
  unlockedColorIds: string[];
  onSelectColor: (color: PixelColor) => void;
};

export default function ColorPalette({ colors, selectedColor, unlockedColorIds, onSelectColor }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      {colors.map(color => {
        const isUnlocked = unlockedColorIds.includes(color.id);
        const isSelected = selectedColor && colorsEqual(selectedColor, color.rgb);

        return (
          <TouchableOpacity
            key={color.id}
            style={[
              styles.colorButton,
              { backgroundColor: color.hex },
              isSelected && styles.selected,
              !isUnlocked && styles.locked,
            ]}
            onPress={() => isUnlocked && onSelectColor(color.rgb)}
            disabled={!isUnlocked}
          >
            {!isUnlocked && (
              <Text style={styles.lockIcon}>🔒</Text>
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  colorButton: {
    width: 44,
    height: 44,
    borderRadius: 4,
    marginHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#555',
  },
  selected: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    transform: [{ scale: 1.15 }],
  },
  locked: {
    opacity: 0.4,
  },
  lockIcon: {
    fontSize: 16,
  },
});
