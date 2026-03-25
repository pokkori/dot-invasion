import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { PixelColor, PixelGrid as PixelGridType, EMPTY_PIXEL, createEmptyGrid } from '../../src/types/unit';
import { calculateStats, getUnitClassName, getUnitClassIcon, createPixelUnit } from '../../src/engine/UnitFactory';
import { ALL_COLORS } from '../../src/constants/colors';
import { usePlayerStore } from '../../src/stores/playerStore';
import PixelGrid from '../../src/components/PixelGrid';
import ColorPalette from '../../src/components/ColorPalette';
import { colorsEqual } from '../../src/utils/colorUtils';

export default function EditorScreen() {
  const router = useRouter();
  const addUnit = usePlayerStore(s => s.addUnit);
  const save = usePlayerStore(s => s.save);
  const unlockedColorIds = usePlayerStore(s => s.data.inventory.unlockedColorIds);

  const [grid, setGrid] = useState<PixelGridType>(createEmptyGrid());
  const [selectedColor, setSelectedColor] = useState<PixelColor | null>(ALL_COLORS[0].rgb);
  const [unitName, setUnitName] = useState('');
  const [isEraser, setIsEraser] = useState(false);

  const { unitClass, stats } = calculateStats(grid);

  const handleCellPress = useCallback((index: number) => {
    setGrid(prev => {
      const newGrid = [...prev] as PixelGridType;
      if (isEraser) {
        newGrid[index] = { ...EMPTY_PIXEL };
      } else if (selectedColor) {
        // Toggle: if same color, clear it
        if (prev[index].a > 0 && colorsEqual(prev[index], selectedColor)) {
          newGrid[index] = { ...EMPTY_PIXEL };
        } else {
          newGrid[index] = { ...selectedColor };
        }
      }
      return newGrid;
    });
  }, [selectedColor, isEraser]);

  const handleClear = () => {
    Alert.alert('全消去', '全てのセルを消しますか？', [
      { text: 'キャンセル', style: 'cancel' },
      { text: '消去', style: 'destructive', onPress: () => setGrid(createEmptyGrid()) },
    ]);
  };

  const handleRandom = () => {
    const unlocked = ALL_COLORS.filter(c => unlockedColorIds.includes(c.id));
    const newGrid = createEmptyGrid();
    for (let i = 0; i < 9; i++) {
      const color = unlocked[Math.floor(Math.random() * unlocked.length)];
      if (color && Math.random() > 0.3) {
        newGrid[i] = { ...color.rgb };
      }
    }
    setGrid(newGrid);
  };

  const handleSave = async () => {
    const filledCells = grid.filter(p => p.a > 0).length;
    if (filledCells === 0) {
      Alert.alert('エラー', '少なくとも1セル塗ってください');
      return;
    }
    const name = unitName.trim() || `ユニット${Date.now() % 1000}`;
    const unit = createPixelUnit(name, grid);
    addUnit(unit);
    await save();
    Alert.alert('保存完了', `「${name}」を作成しました！`, [
      { text: 'OK', onPress: () => {
        setGrid(createEmptyGrid());
        setUnitName('');
      }},
    ]);
  };

  const statBars = [
    { label: 'HP', value: stats.hp, min: 50, max: 200, color: '#44CC44' },
    { label: 'ATK', value: stats.attack, min: 5, max: 30, color: '#FF4444' },
    { label: 'DEF', value: stats.defense, min: 1, max: 20, color: '#4488FF' },
    { label: 'SPD', value: stats.speed, min: 1.0, max: 4.0, color: '#FFCC00' },
    { label: 'RNG', value: stats.range, min: 20, max: 80, color: '#CC66FF' },
    { label: 'COST', value: stats.manaCost, min: 2, max: 8, color: '#66BBFF' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>ユニット作成</Text>

      {/* Grid */}
      <View style={styles.gridContainer}>
        <PixelGrid
          grid={grid}
          selectedColor={isEraser ? null : selectedColor}
          onCellPress={handleCellPress}
          cellSize={75}
        />
      </View>

      {/* Toolbar */}
      <View style={styles.toolbar}>
        <TouchableOpacity
          style={[styles.toolButton, isEraser && styles.toolActive]}
          onPress={() => setIsEraser(!isEraser)}
          accessibilityRole="button"
          accessibilityLabel={`消しゴム${isEraser ? ' 選択中' : ''}`}
          accessibilityHint="消しゴムモードでセルを消します"
        >
          <Text style={styles.toolText}>消しゴム</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.toolButton}
          onPress={handleClear}
          accessibilityRole="button"
          accessibilityLabel="全消去 グリッドを全てクリアする"
          accessibilityHint="全てのセルを消去します"
        >
          <Text style={styles.toolText}>全消去</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.toolButton}
          onPress={handleRandom}
          accessibilityRole="button"
          accessibilityLabel="ランダム生成 ランダムなドット絵を生成"
          accessibilityHint="所持カラーでランダムなドット絵を生成します"
        >
          <Text style={styles.toolText}>ランダム</Text>
        </TouchableOpacity>
      </View>

      {/* Color Palette */}
      <Text style={styles.sectionLabel}>カラーパレット</Text>
      <ColorPalette
        colors={ALL_COLORS}
        selectedColor={isEraser ? null : selectedColor}
        unlockedColorIds={unlockedColorIds}
        onSelectColor={(color) => {
          setSelectedColor(color);
          setIsEraser(false);
        }}
      />

      {/* Preview */}
      <Text style={styles.sectionLabel}>プレビュー</Text>
      <View style={styles.previewCard}>
        <Text style={styles.classText}>
          兵種: {getUnitClassIcon(unitClass)} {getUnitClassName(unitClass)}
        </Text>
        {statBars.map(bar => {
          const ratio = (bar.value - bar.min) / (bar.max - bar.min);
          return (
            <View key={bar.label} style={styles.statRow}>
              <Text style={styles.statLabel}>{bar.label}</Text>
              <View style={styles.statBarBg}>
                <View style={[styles.statBarFill, { width: `${ratio * 100}%`, backgroundColor: bar.color }]} />
              </View>
              <Text style={styles.statValue}>{typeof bar.value === 'number' && bar.value % 1 !== 0 ? bar.value.toFixed(1) : bar.value}</Text>
            </View>
          );
        })}
      </View>

      {/* Name Input */}
      <TextInput
        style={styles.nameInput}
        placeholder="ユニット名（最大8文字）"
        placeholderTextColor="#666688"
        value={unitName}
        onChangeText={t => setUnitName(t.slice(0, 8))}
        maxLength={8}
      />

      {/* Save Button */}
      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSave}
        accessibilityRole="button"
        accessibilityLabel="保存してデッキに追加する"
        accessibilityHint="現在のドット絵をユニットとして保存しデッキに追加します"
      >
        <Text style={styles.saveButtonText}>保存してデッキに追加</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A1E' },
  content: { paddingTop: 56, paddingHorizontal: 20, paddingBottom: 40 },
  header: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center', marginBottom: 20 },
  gridContainer: { alignItems: 'center', marginBottom: 16 },
  toolbar: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 16 },
  toolButton: {
    backgroundColor: '#1E1E3A', paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 8, borderWidth: 1, borderColor: '#333366',
  },
  toolActive: { borderColor: '#FFD700', backgroundColor: '#2A2A4A' },
  toolText: { color: '#FFFFFF', fontSize: 13 },
  sectionLabel: { color: '#FFD700', fontSize: 14, fontWeight: 'bold', marginTop: 8, marginBottom: 4 },
  previewCard: {
    backgroundColor: '#1E1E3A', borderRadius: 10, padding: 14,
    marginTop: 8, borderWidth: 1, borderColor: '#333366',
  },
  classText: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold', marginBottom: 10 },
  statRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 3 },
  statLabel: { color: '#AAAACC', fontSize: 12, width: 40, fontWeight: '600' },
  statBarBg: { flex: 1, height: 10, backgroundColor: '#0D0D24', borderRadius: 5, overflow: 'hidden', marginHorizontal: 8 },
  statBarFill: { height: '100%', borderRadius: 5 },
  statValue: { color: '#FFFFFF', fontSize: 12, width: 35, textAlign: 'right' },
  nameInput: {
    backgroundColor: '#1E1E3A', borderRadius: 8, padding: 12, marginTop: 16,
    color: '#FFFFFF', fontSize: 16, borderWidth: 1, borderColor: '#333366',
  },
  saveButton: {
    backgroundColor: '#2266AA', borderRadius: 10, padding: 16,
    alignItems: 'center', marginTop: 16,
  },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});
