import { PixelGrid, UnitClass, UnitStats, PixelUnit, PixelColor } from '../types/unit';

function lerp(min: number, max: number, t: number): number {
  return min + (max - min) * Math.max(0, Math.min(1, t));
}

function roundTo(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

const DEFAULT_STATS: UnitStats = {
  hp: 100, attack: 15, defense: 8, speed: 2.0,
  attackSpeed: 30, range: 30, manaCost: 4,
};

export function calculateStats(grid: PixelGrid): { unitClass: UnitClass; stats: UnitStats } {
  let totalR = 0, totalG = 0, totalB = 0;
  let filledCells = 0;

  for (const pixel of grid) {
    if (pixel.a === 0) continue;
    totalR += pixel.r;
    totalG += pixel.g;
    totalB += pixel.b;
    filledCells++;
  }

  if (filledCells === 0) {
    return { unitClass: 'balanced', stats: { ...DEFAULT_STATS } };
  }

  const maxPossible = filledCells * 255;
  const rRatio = totalR / maxPossible;
  const gRatio = totalG / maxPossible;
  const bRatio = totalB / maxPossible;
  const yRatio = Math.max(0, (rRatio + gRatio - bRatio) / 2);

  const channels: Record<string, number> = { r: rRatio, g: gRatio, b: bRatio, y: yRatio };
  const sorted = Object.entries(channels).sort(([, a], [, b]) => b - a);
  const maxChannel = sorted[0];

  const sortedVals = Object.values(channels).sort((a, b) => b - a);
  const unitClass: UnitClass =
    (sortedVals[0] - sortedVals[1]) < 0.15 ? 'balanced' :
    maxChannel[0] === 'r' ? 'attacker' :
    maxChannel[0] === 'b' ? 'defender' :
    maxChannel[0] === 'g' ? 'healer' :
    'speedster';

  const cellBonus = filledCells / 9;

  const stats: UnitStats = {
    hp:          Math.round(lerp(50, 200, gRatio * 0.6 + bRatio * 0.3 + cellBonus * 0.1)),
    attack:      Math.round(lerp(5, 30,  rRatio * 0.8 + yRatio * 0.2)),
    defense:     Math.round(lerp(1, 20,  bRatio * 0.7 + gRatio * 0.3)),
    speed:       roundTo(lerp(1.0, 4.0,  yRatio * 0.5 + rRatio * 0.3 + (1 - bRatio) * 0.2), 1),
    attackSpeed: Math.round(lerp(60, 15, rRatio * 0.6 + yRatio * 0.4)),
    range:       Math.round(lerp(20, 80, bRatio * 0.4 + gRatio * 0.4 + (1 - rRatio) * 0.2)),
    manaCost:    Math.round(lerp(2, 8,   cellBonus * 0.5 + (rRatio + bRatio + gRatio) / 3 * 0.5)),
  };

  return { unitClass, stats };
}

export function createPixelUnit(
  name: string,
  grid: PixelGrid,
  isPreset: boolean = false,
): PixelUnit {
  const { unitClass, stats } = calculateStats(grid);
  return {
    id: `unit_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name,
    grid,
    unitClass,
    stats,
    createdAt: Date.now(),
    wins: 0,
    losses: 0,
    isPreset,
  };
}

export function getUnitClassName(unitClass: UnitClass): string {
  switch (unitClass) {
    case 'attacker': return 'アタッカー';
    case 'defender': return 'ディフェンダー';
    case 'healer': return 'ヒーラー';
    case 'speedster': return 'スピードスター';
    case 'balanced': return 'バランス';
  }
}

export function getUnitClassIcon(unitClass: UnitClass): string {
  switch (unitClass) {
    case 'attacker': return '⚔️';
    case 'defender': return '🛡️';
    case 'healer': return '💚';
    case 'speedster': return '⚡';
    case 'balanced': return '⭐';
  }
}
