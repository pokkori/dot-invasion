/** ピクセルの色。RGBA形式 */
export type PixelColor = {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
  a: number; // 0-1（0=透明=空セル）
};

/** カラーパレットの1色分 */
export type PaletteColor = {
  id: string;
  name: string;
  hex: string;
  rgb: PixelColor;
  unlocked: boolean;
  unlockCondition: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
};

/** 3x3ピクセルグリッド（9セル）。行優先。[0]が左上、[8]が右下 */
export type PixelGrid = [
  PixelColor, PixelColor, PixelColor,
  PixelColor, PixelColor, PixelColor,
  PixelColor, PixelColor, PixelColor,
];

/** RGB比率から決定される兵種 */
export type UnitClass =
  | 'attacker'
  | 'defender'
  | 'healer'
  | 'speedster'
  | 'balanced';

/** ユニットの戦闘ステータス */
export type UnitStats = {
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  attackSpeed: number;
  range: number;
  manaCost: number;
};

/** プレイヤーが作成・所持するピクセルユニット */
export type PixelUnit = {
  id: string;
  name: string;
  grid: PixelGrid;
  unitClass: UnitClass;
  stats: UnitStats;
  createdAt: number;
  wins: number;
  losses: number;
  isPreset: boolean;
};

/** デッキ（出撃ユニット3体） */
export type Deck = {
  id: string;
  name: string;
  unitIds: [string, string, string];
};

/** 空のピクセル色 */
export const EMPTY_PIXEL: PixelColor = { r: 0, g: 0, b: 0, a: 0 };

/** 空のグリッド */
export function createEmptyGrid(): PixelGrid {
  return [
    EMPTY_PIXEL, EMPTY_PIXEL, EMPTY_PIXEL,
    EMPTY_PIXEL, EMPTY_PIXEL, EMPTY_PIXEL,
    EMPTY_PIXEL, EMPTY_PIXEL, EMPTY_PIXEL,
  ];
}
