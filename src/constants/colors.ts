import { PaletteColor } from '../types/unit';

/** 初期色パレット（6色、最初からアンロック済み） */
export const INITIAL_COLORS: PaletteColor[] = [
  {
    id: 'red-basic',
    name: 'レッド',
    hex: '#FF0000',
    rgb: { r: 255, g: 0, b: 0, a: 1 },
    unlocked: true,
    unlockCondition: '初期色',
    rarity: 'common',
  },
  {
    id: 'blue-basic',
    name: 'ブルー',
    hex: '#0066FF',
    rgb: { r: 0, g: 102, b: 255, a: 1 },
    unlocked: true,
    unlockCondition: '初期色',
    rarity: 'common',
  },
  {
    id: 'green-basic',
    name: 'グリーン',
    hex: '#00CC00',
    rgb: { r: 0, g: 204, b: 0, a: 1 },
    unlocked: true,
    unlockCondition: '初期色',
    rarity: 'common',
  },
  {
    id: 'yellow-basic',
    name: 'イエロー',
    hex: '#FFCC00',
    rgb: { r: 255, g: 204, b: 0, a: 1 },
    unlocked: true,
    unlockCondition: '初期色',
    rarity: 'common',
  },
  {
    id: 'white-basic',
    name: 'ホワイト',
    hex: '#FFFFFF',
    rgb: { r: 255, g: 255, b: 255, a: 1 },
    unlocked: true,
    unlockCondition: '初期色',
    rarity: 'common',
  },
  {
    id: 'black-basic',
    name: 'ブラック',
    hex: '#333333',
    rgb: { r: 51, g: 51, b: 51, a: 1 },
    unlocked: true,
    unlockCondition: '初期色',
    rarity: 'common',
  },
];

/** アンロック色（15色、ステージクリア報酬） */
export const UNLOCK_COLORS: PaletteColor[] = [
  { id: 'lime-green', name: 'ライムグリーン', hex: '#66FF00', rgb: { r: 102, g: 255, b: 0, a: 1 }, unlocked: false, unlockCondition: 'ステージ1クリア', rarity: 'common' },
  { id: 'crimson', name: 'クリムゾン', hex: '#DC143C', rgb: { r: 220, g: 20, b: 60, a: 1 }, unlocked: false, unlockCondition: 'ステージ2クリア', rarity: 'common' },
  { id: 'sky-blue', name: 'スカイブルー', hex: '#00BFFF', rgb: { r: 0, g: 191, b: 255, a: 1 }, unlocked: false, unlockCondition: 'ステージ3クリア', rarity: 'common' },
  { id: 'orange', name: 'オレンジ', hex: '#FF8800', rgb: { r: 255, g: 136, b: 0, a: 1 }, unlocked: false, unlockCondition: 'ステージ4クリア', rarity: 'common' },
  { id: 'purple', name: 'パープル', hex: '#9900FF', rgb: { r: 153, g: 0, b: 255, a: 1 }, unlocked: false, unlockCondition: 'ステージ5クリア', rarity: 'uncommon' },
  { id: 'pink', name: 'ピンク', hex: '#FF66B2', rgb: { r: 255, g: 102, b: 178, a: 1 }, unlocked: false, unlockCondition: 'ステージ6クリア', rarity: 'uncommon' },
  { id: 'teal', name: 'ティール', hex: '#008080', rgb: { r: 0, g: 128, b: 128, a: 1 }, unlocked: false, unlockCondition: 'ステージ7クリア', rarity: 'uncommon' },
  { id: 'gold', name: 'ゴールド', hex: '#FFD700', rgb: { r: 255, g: 215, b: 0, a: 1 }, unlocked: false, unlockCondition: 'ステージ8クリア', rarity: 'uncommon' },
  { id: 'neon-green', name: 'ネオングリーン', hex: '#39FF14', rgb: { r: 57, g: 255, b: 20, a: 1 }, unlocked: false, unlockCondition: 'ステージ9クリア', rarity: 'rare' },
  { id: 'neon-pink', name: 'ネオンピンク', hex: '#FF1493', rgb: { r: 255, g: 20, b: 147, a: 1 }, unlocked: false, unlockCondition: 'ステージ10クリア', rarity: 'rare' },
  { id: 'ice-blue', name: 'アイスブルー', hex: '#7DF9FF', rgb: { r: 125, g: 249, b: 255, a: 1 }, unlocked: false, unlockCondition: 'ステージ11クリア', rarity: 'rare' },
  { id: 'blood-red', name: 'ブラッドレッド', hex: '#8B0000', rgb: { r: 139, g: 0, b: 0, a: 1 }, unlocked: false, unlockCondition: 'ステージ12クリア', rarity: 'rare' },
  { id: 'royal-purple', name: 'ロイヤルパープル', hex: '#4B0082', rgb: { r: 75, g: 0, b: 130, a: 1 }, unlocked: false, unlockCondition: 'ステージ13クリア', rarity: 'legendary' },
  { id: 'chromatic', name: 'クロマティック', hex: '#FF00FF', rgb: { r: 255, g: 0, b: 255, a: 1 }, unlocked: false, unlockCondition: 'ステージ14クリア', rarity: 'legendary' },
  { id: 'void-black', name: 'ヴォイドブラック', hex: '#0A0A0A', rgb: { r: 10, g: 10, b: 10, a: 1 }, unlocked: false, unlockCondition: 'ステージ15クリア', rarity: 'legendary' },
];

/** 全色を結合したリスト */
export const ALL_COLORS: PaletteColor[] = [...INITIAL_COLORS, ...UNLOCK_COLORS];

/** IDから色を取得 */
export function getColorById(id: string): PaletteColor | undefined {
  return ALL_COLORS.find(c => c.id === id);
}
