import { PixelUnit, PixelColor, PixelGrid } from '../types/unit';

const RED: PixelColor = { r: 255, g: 0, b: 0, a: 1 };
const BLU: PixelColor = { r: 0, g: 102, b: 255, a: 1 };
const GRN: PixelColor = { r: 0, g: 204, b: 0, a: 1 };
const YLW: PixelColor = { r: 255, g: 204, b: 0, a: 1 };
const WHT: PixelColor = { r: 255, g: 255, b: 255, a: 1 };
const BLK: PixelColor = { r: 51, g: 51, b: 51, a: 1 };
const ___: PixelColor = { r: 0, g: 0, b: 0, a: 0 };

/** プリセットユニット5体 */
export const PRESET_UNITS: PixelUnit[] = [
  {
    id: 'preset-red-fighter',
    name: '赤鬼',
    grid: [
      RED, RED, RED,
      RED, RED, RED,
      BLK, RED, BLK,
    ] as PixelGrid,
    unitClass: 'attacker',
    stats: { hp: 80, attack: 24, defense: 3, speed: 2.5, attackSpeed: 20, range: 20, manaCost: 5 },
    createdAt: 0,
    wins: 0,
    losses: 0,
    isPreset: true,
  },
  {
    id: 'preset-blue-shield',
    name: '盾兵',
    grid: [
      BLU, BLU, BLU,
      BLU, WHT, BLU,
      BLU, BLU, BLU,
    ] as PixelGrid,
    unitClass: 'defender',
    stats: { hp: 160, attack: 8, defense: 18, speed: 1.2, attackSpeed: 45, range: 20, manaCost: 4 },
    createdAt: 0,
    wins: 0,
    losses: 0,
    isPreset: true,
  },
  {
    id: 'preset-green-cross',
    name: '回復僧',
    grid: [
      ___, GRN, ___,
      GRN, GRN, GRN,
      ___, GRN, ___,
    ] as PixelGrid,
    unitClass: 'healer',
    stats: { hp: 120, attack: 10, defense: 10, speed: 1.5, attackSpeed: 40, range: 60, manaCost: 5 },
    createdAt: 0,
    wins: 0,
    losses: 0,
    isPreset: true,
  },
  {
    id: 'preset-yellow-bolt',
    name: '疾風',
    grid: [
      ___, YLW, ___,
      YLW, YLW, YLW,
      YLW, ___, YLW,
    ] as PixelGrid,
    unitClass: 'speedster',
    stats: { hp: 70, attack: 15, defense: 4, speed: 3.8, attackSpeed: 18, range: 20, manaCost: 3 },
    createdAt: 0,
    wins: 0,
    losses: 0,
    isPreset: true,
  },
  {
    id: 'preset-grey-soldier',
    name: '万能兵',
    grid: [
      WHT, BLK, WHT,
      BLK, WHT, BLK,
      WHT, BLK, WHT,
    ] as PixelGrid,
    unitClass: 'balanced',
    stats: { hp: 100, attack: 15, defense: 8, speed: 2.0, attackSpeed: 30, range: 30, manaCost: 4 },
    createdAt: 0,
    wins: 0,
    losses: 0,
    isPreset: true,
  },
];
