import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { usePlayerStore } from '../../src/stores/playerStore';
import { useBattleStore } from '../../src/stores/battleStore';
import { GameEngine } from '../../src/engine/GameEngine';
import { BattleState } from '../../src/types/battle';
import HealthBar from '../../src/components/HealthBar';
import ManaBar from '../../src/components/ManaBar';
import BattleCanvas from '../../src/components/BattleCanvas';
import DeploySlot from '../../src/components/DeploySlot';

const FIELD_WIDTH = 320;
const FIELD_HEIGHT = 568;

export default function BattleDeployScreen() {
  const router = useRouter();
  const opponent = useBattleStore(s => s.opponent);
  const setBattleState = useBattleStore(s => s.setBattleState);
  const selectedUnitIndex = useBattleStore(s => s.selectedUnitIndex);
  const setSelectedUnitIndex = useBattleStore(s => s.setSelectedUnitIndex);
  const getDeckUnits = usePlayerStore(s => s.getDeckUnits);

  const deckUnits = getDeckUnits();
  const engineRef = useRef<GameEngine | null>(null);
  const [state, setState] = useState<BattleState | null>(null);
  const [speed, setSpeed] = useState<1 | 2>(1);
  const [paused, setPaused] = useState(false);

  const screenWidth = Dimensions.get('window').width;
  const scale = Math.min(screenWidth / FIELD_WIDTH, 1.2);

  useEffect(() => {
    if (!opponent || deckUnits.length === 0) {
      router.back();
      return;
    }

    const engine = new GameEngine(deckUnits, opponent, (newState) => {
      setState({ ...newState });
      if (newState.phase === 'finished') {
        setBattleState(newState);
        setTimeout(() => {
          router.replace('/battle/result');
        }, 500);
      }
    });

    engineRef.current = engine;
    engine.start();

    return () => {
      engine.stop();
    };
  }, []);

  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setSpeed(speed);
    }
  }, [speed]);

  const handleFieldPress = useCallback((event: { nativeEvent: { locationX: number; locationY: number } }) => {
    if (!engineRef.current || selectedUnitIndex === null || !state || state.phase !== 'battling') return;

    const x = event.nativeEvent.locationX / scale;
    const y = event.nativeEvent.locationY / scale;

    const success = engineRef.current.deployPlayerUnit(selectedUnitIndex, { x, y });
    if (success) {
      // Keep the selected unit for repeated deployment
    }
  }, [selectedUnitIndex, state, scale]);

  const handlePause = () => {
    if (!engineRef.current) return;
    if (paused) {
      engineRef.current.start();
      setPaused(false);
    } else {
      engineRef.current.stop();
      setPaused(true);
    }
  };

  if (!state) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const timeRemaining = Math.max(0, Math.ceil((state.maxFrames - state.frameCount) / 60));
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <View style={styles.container}>
      {/* Enemy HP */}
      <HealthBar
        currentHp={state.enemyCastle.currentHp}
        maxHp={state.enemyCastle.maxHp}
        label="❤️"
      />
      <Text style={styles.timer}>{minutes}:{seconds.toString().padStart(2, '0')}</Text>

      {/* Battle Field */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleFieldPress}
        style={[styles.fieldWrapper, { width: FIELD_WIDTH * scale, height: FIELD_HEIGHT * scale }]}
      >
        <BattleCanvas state={state} scale={scale} />
      </TouchableOpacity>

      {/* Player HP */}
      <HealthBar
        currentHp={state.playerCastle.currentHp}
        maxHp={state.playerCastle.maxHp}
        label="❤️"
      />

      {/* Mana */}
      <ManaBar mana={state.playerMana} />

      {/* Deploy Slots */}
      <View style={styles.slotsRow}>
        {state.playerDeck.map((unit, index) => (
          <DeploySlot
            key={unit.id}
            unit={unit}
            mana={state.playerMana.current}
            selected={selectedUnitIndex === index}
            onPress={() => setSelectedUnitIndex(selectedUnitIndex === index ? null : index)}
          />
        ))}
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={handlePause}>
          <Text style={styles.controlText}>{paused ? '▶ 再開' : '⏸ 一時停止'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setSpeed(speed === 1 ? 2 : 1)}
        >
          <Text style={styles.controlText}>{speed === 1 ? '⏩ 2倍速' : '⏩ 1倍速'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A1E', paddingTop: 40 },
  loadingText: { color: '#FFFFFF', fontSize: 18, textAlign: 'center', marginTop: 100 },
  timer: {
    color: '#FFFFFF', fontSize: 14, textAlign: 'right', paddingHorizontal: 16, marginBottom: 2,
  },
  fieldWrapper: {
    alignSelf: 'center',
    overflow: 'hidden',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#333366',
  },
  slotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginVertical: 6,
    paddingHorizontal: 12,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    paddingBottom: 12,
  },
  controlButton: {
    backgroundColor: '#1E1E3A',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#333366',
  },
  controlText: { color: '#AAAACC', fontSize: 13 },
});
