import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ManaState } from '../types/battle';

type Props = {
  mana: ManaState;
};

export default function ManaBar({ mana }: Props) {
  const ratio = mana.current / mana.max;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>MANA</Text>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${ratio * 100}%` }]} />
      </View>
      <Text style={styles.value}>{mana.current.toFixed(1)}/{mana.max}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  label: {
    color: '#66BBFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 8,
    width: 40,
  },
  barBg: {
    flex: 1,
    height: 12,
    backgroundColor: '#1A1A3E',
    borderRadius: 6,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#3388FF',
    borderRadius: 6,
  },
  value: {
    color: '#AACCFF',
    fontSize: 11,
    marginLeft: 8,
    width: 55,
    textAlign: 'right',
  },
});
