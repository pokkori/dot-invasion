import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
  currentHp: number;
  maxHp: number;
  label?: string;
  color?: string;
};

export default function HealthBar({ currentHp, maxHp, label, color = '#FF4444' }: Props) {
  const ratio = Math.max(0, currentHp / maxHp);
  const barColor = ratio > 0.5 ? '#44CC44' : ratio > 0.25 ? '#FFAA00' : '#FF4444';

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${ratio * 100}%`, backgroundColor: barColor }]} />
      </View>
      <Text style={styles.value}>{Math.max(0, Math.round(currentHp))}/{maxHp}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 2,
  },
  label: {
    color: '#FF6666',
    fontSize: 14,
    marginRight: 6,
  },
  barBg: {
    flex: 1,
    height: 14,
    backgroundColor: '#1A1A3E',
    borderRadius: 7,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 7,
  },
  value: {
    color: '#FFCCCC',
    fontSize: 11,
    marginLeft: 8,
    width: 70,
    textAlign: 'right',
  },
});
