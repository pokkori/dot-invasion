import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BattleState } from '../types/battle';
import { pixelToHex } from '../utils/colorUtils';

type Props = {
  state: BattleState;
  scale: number;
};

const FIELD_WIDTH = 320;
const FIELD_HEIGHT = 568;

export default function BattleCanvas({ state, scale }: Props) {
  return (
    <View style={[styles.field, { width: FIELD_WIDTH * scale, height: FIELD_HEIGHT * scale }]}>
      {/* Background */}
      <View style={StyleSheet.absoluteFill}>
        <View style={[styles.bg, { backgroundColor: '#1A3A1A' }]} />
      </View>

      {/* Grid lines for atmosphere */}
      {[0.25, 0.5, 0.75].map(ratio => (
        <View
          key={`h-${ratio}`}
          style={[styles.gridLine, {
            top: FIELD_HEIGHT * scale * ratio,
            width: FIELD_WIDTH * scale,
            height: 1,
          }]}
        />
      ))}

      {/* Player Castle */}
      <View
        style={[styles.castle, styles.playerCastle, {
          left: (state.playerCastle.position.x - 16) * scale,
          top: (state.playerCastle.position.y - 16) * scale,
          width: 32 * scale,
          height: 32 * scale,
        }]}
      />

      {/* Enemy Castle */}
      <View
        style={[styles.castle, styles.enemyCastle, {
          left: (state.enemyCastle.position.x - 16) * scale,
          top: (state.enemyCastle.position.y - 16) * scale,
          width: 32 * scale,
          height: 32 * scale,
        }]}
      />

      {/* Deploy zone indicator */}
      <View
        style={[styles.deployZone, {
          top: 350 * scale,
          width: FIELD_WIDTH * scale,
          height: (FIELD_HEIGHT - 350) * scale,
        }]}
      />

      {/* Units */}
      {state.units.filter(u => u.state !== 'dead').map(unit => {
        const unitSize = 16 * scale;
        const pixelSize = unitSize / 3;
        const opacity = unit.state === 'dying' ? 0.4 : 1;

        return (
          <View
            key={unit.instanceId}
            style={[styles.unit, {
              left: (unit.position.x - 8) * scale,
              top: (unit.position.y - 8) * scale,
              width: unitSize,
              height: unitSize,
              opacity,
            }]}
          >
            {/* Mini pixel grid */}
            <View style={styles.unitPixels}>
              {unit.unitData.grid.map((pixel, i) => (
                <View
                  key={i}
                  style={{
                    width: pixelSize,
                    height: pixelSize,
                    backgroundColor: pixel.a > 0 ? pixelToHex(pixel) : 'transparent',
                  }}
                />
              ))}
            </View>

            {/* HP indicator */}
            {unit.state !== 'dying' && (
              <View style={[styles.unitHpBg, { width: unitSize }]}>
                <View
                  style={[styles.unitHpFill, {
                    width: unitSize * (unit.currentHp / unit.unitData.stats.hp),
                    backgroundColor: unit.owner === 'player' ? '#44CC44' : '#FF4444',
                  }]}
                />
              </View>
            )}
          </View>
        );
      })}

      {/* Particles */}
      {state.particles.map(particle => {
        const alpha = particle.life / particle.maxLife;
        const size = particle.size * scale;
        return (
          <View
            key={particle.id}
            style={{
              position: 'absolute',
              left: particle.position.x * scale - size / 2,
              top: particle.position.y * scale - size / 2,
              width: size,
              height: size,
              backgroundColor: `rgba(${particle.color.r},${particle.color.g},${particle.color.b},${alpha})`,
              borderRadius: size / 2,
            }}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    backgroundColor: '#0D1A0D',
    position: 'relative',
    overflow: 'hidden',
  },
  bg: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.3,
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  castle: {
    position: 'absolute',
    borderRadius: 4,
  },
  playerCastle: {
    backgroundColor: '#3366CC',
    borderWidth: 2,
    borderColor: '#5588EE',
  },
  enemyCastle: {
    backgroundColor: '#CC3333',
    borderWidth: 2,
    borderColor: '#EE5555',
  },
  deployZone: {
    position: 'absolute',
    left: 0,
    backgroundColor: 'rgba(50,100,200,0.08)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(100,150,255,0.15)',
  },
  unit: {
    position: 'absolute',
  },
  unitPixels: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    height: '100%',
  },
  unitHpBg: {
    height: 2,
    backgroundColor: '#333333',
    marginTop: 1,
  },
  unitHpFill: {
    height: 2,
  },
});
