import React, { useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { PixelGrid as PixelGridType, PixelColor, EMPTY_PIXEL } from '../types/unit';
import { pixelToHex, colorsEqual } from '../utils/colorUtils';

type Props = {
  grid: PixelGridType;
  selectedColor: PixelColor | null;
  onCellPress: (index: number) => void;
  cellSize?: number;
  editable?: boolean;
};

export default function PixelGrid({ grid, selectedColor, onCellPress, cellSize = 80, editable = true }: Props) {
  const renderCell = useCallback((index: number) => {
    const pixel = grid[index];
    const isFilled = pixel.a > 0;
    const bgColor = isFilled ? pixelToHex(pixel) : undefined;

    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.cell,
          { width: cellSize, height: cellSize },
          isFilled ? { backgroundColor: bgColor } : styles.emptyCell,
        ]}
        onPress={() => editable && onCellPress(index)}
        disabled={!editable}
        activeOpacity={0.7}
      >
        {!isFilled && (
          <View style={styles.checkerboard}>
            <View style={[styles.checker, styles.checkerLight]} />
            <View style={[styles.checker, styles.checkerDark]} />
            <View style={[styles.checker, styles.checkerDark]} />
            <View style={[styles.checker, styles.checkerLight]} />
          </View>
        )}
      </TouchableOpacity>
    );
  }, [grid, selectedColor, onCellPress, cellSize, editable]);

  return (
    <View style={[styles.grid, { width: cellSize * 3 + 4, height: cellSize * 3 + 4 }]}>
      {[0, 1, 2].map(row => (
        <View key={row} style={styles.row}>
          {[0, 1, 2].map(col => renderCell(row * 3 + col))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    borderWidth: 1,
    borderColor: '#333333',
    backgroundColor: '#333333',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    borderWidth: 0.5,
    borderColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  emptyCell: {
    backgroundColor: '#E0E0E0',
  },
  checkerboard: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  checker: {
    width: '50%',
    height: '50%',
  },
  checkerLight: {
    backgroundColor: '#E0E0E0',
  },
  checkerDark: {
    backgroundColor: '#C0C0C0',
  },
});
