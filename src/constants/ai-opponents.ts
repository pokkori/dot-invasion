import { AIOpponent } from '../types/battle';
import { PixelUnit, PixelColor, PixelGrid } from '../types/unit';

const RED: PixelColor = { r: 255, g: 0, b: 0, a: 1 };
const BLU: PixelColor = { r: 0, g: 102, b: 255, a: 1 };
const GRN: PixelColor = { r: 0, g: 204, b: 0, a: 1 };
const YLW: PixelColor = { r: 255, g: 204, b: 0, a: 1 };
const WHT: PixelColor = { r: 255, g: 255, b: 255, a: 1 };
const BLK: PixelColor = { r: 51, g: 51, b: 51, a: 1 };
const ___: PixelColor = { r: 0, g: 0, b: 0, a: 0 };

function makeUnit(id: string, name: string, grid: PixelGrid, unitClass: PixelUnit['unitClass'], stats: PixelUnit['stats']): PixelUnit {
  return { id, name, grid, unitClass, stats, createdAt: 0, wins: 0, losses: 0, isPreset: true };
}

// --- Easy ステージ 1-5 ---

const slimeUnit = makeUnit('ai-slime', 'スライム', [GRN, GRN, GRN, GRN, GRN, GRN, GRN, GRN, GRN] as PixelGrid, 'balanced', { hp: 80, attack: 10, defense: 5, speed: 1.5, attackSpeed: 35, range: 25, manaCost: 3 });

const redKnightAtk = makeUnit('ai-red-knight-a', '赤騎士', [RED, RED, RED, RED, RED, RED, RED, RED, RED] as PixelGrid, 'attacker', { hp: 70, attack: 20, defense: 3, speed: 2.0, attackSpeed: 22, range: 20, manaCost: 4 });
const redKnightBal = makeUnit('ai-red-knight-b', '赤兵', [RED, WHT, RED, WHT, RED, WHT, RED, WHT, RED] as PixelGrid, 'balanced', { hp: 90, attack: 12, defense: 6, speed: 1.8, attackSpeed: 30, range: 25, manaCost: 3 });

const blueWallDef = makeUnit('ai-blue-wall', '青壁', [BLU, BLU, BLU, BLU, BLU, BLU, BLU, BLU, BLU] as PixelGrid, 'defender', { hp: 180, attack: 6, defense: 18, speed: 1.0, attackSpeed: 50, range: 20, manaCost: 4 });

const greenMonkHeal = makeUnit('ai-green-monk', '緑僧', [___, GRN, ___, GRN, GRN, GRN, ___, GRN, ___] as PixelGrid, 'healer', { hp: 110, attack: 8, defense: 8, speed: 1.3, attackSpeed: 42, range: 55, manaCost: 4 });
const greenMonkDef = makeUnit('ai-green-monk-d', '緑盾', [GRN, BLU, GRN, BLU, GRN, BLU, GRN, BLU, GRN] as PixelGrid, 'defender', { hp: 140, attack: 7, defense: 14, speed: 1.2, attackSpeed: 45, range: 20, manaCost: 4 });

const yellowRushSpd = makeUnit('ai-yellow-rush', '黄疾', [YLW, ___, YLW, YLW, YLW, YLW, ___, YLW, ___] as PixelGrid, 'speedster', { hp: 60, attack: 14, defense: 3, speed: 3.5, attackSpeed: 20, range: 20, manaCost: 3 });

// --- Normal ステージ 6-10 ---
const fireAtk = makeUnit('ai-fire-atk', '火攻', [RED, RED, RED, RED, YLW, RED, RED, RED, RED] as PixelGrid, 'attacker', { hp: 90, attack: 22, defense: 4, speed: 2.5, attackSpeed: 20, range: 20, manaCost: 5 });
const fireSpd = makeUnit('ai-fire-spd', '火速', [YLW, RED, YLW, RED, YLW, RED, YLW, RED, YLW] as PixelGrid, 'speedster', { hp: 75, attack: 16, defense: 3, speed: 3.2, attackSpeed: 22, range: 20, manaCost: 4 });

const iceDef = makeUnit('ai-ice-def', '氷壁', [BLU, WHT, BLU, BLU, BLU, BLU, BLU, WHT, BLU] as PixelGrid, 'defender', { hp: 190, attack: 7, defense: 19, speed: 1.0, attackSpeed: 48, range: 20, manaCost: 5 });
const iceHeal = makeUnit('ai-ice-heal', '氷癒', [GRN, BLU, GRN, BLU, GRN, BLU, GRN, BLU, GRN] as PixelGrid, 'healer', { hp: 130, attack: 9, defense: 12, speed: 1.2, attackSpeed: 40, range: 60, manaCost: 5 });

const thunderSpd = makeUnit('ai-thunder-spd', '雷速', [YLW, YLW, YLW, YLW, WHT, YLW, YLW, YLW, YLW] as PixelGrid, 'speedster', { hp: 65, attack: 18, defense: 3, speed: 3.8, attackSpeed: 18, range: 20, manaCost: 3 });
const thunderAtk = makeUnit('ai-thunder-atk', '雷撃', [RED, YLW, RED, YLW, RED, YLW, RED, YLW, RED] as PixelGrid, 'attacker', { hp: 85, attack: 20, defense: 5, speed: 2.8, attackSpeed: 22, range: 20, manaCost: 5 });

const darkHeal = makeUnit('ai-dark-heal', '闇癒', [GRN, BLK, GRN, BLK, GRN, BLK, GRN, BLK, GRN] as PixelGrid, 'healer', { hp: 140, attack: 12, defense: 10, speed: 1.5, attackSpeed: 38, range: 60, manaCost: 5 });
const darkAtk = makeUnit('ai-dark-atk', '闇攻', [RED, BLK, RED, BLK, RED, BLK, RED, BLK, RED] as PixelGrid, 'attacker', { hp: 100, attack: 22, defense: 5, speed: 2.2, attackSpeed: 22, range: 25, manaCost: 5 });

const chaosDef = makeUnit('ai-chaos-def', '混盾', [BLU, RED, BLU, RED, BLU, RED, BLU, RED, BLU] as PixelGrid, 'defender', { hp: 160, attack: 10, defense: 15, speed: 1.5, attackSpeed: 35, range: 20, manaCost: 4 });
const chaosSpd = makeUnit('ai-chaos-spd', '混速', [YLW, BLU, YLW, RED, YLW, GRN, YLW, RED, YLW] as PixelGrid, 'speedster', { hp: 80, attack: 16, defense: 5, speed: 3.0, attackSpeed: 22, range: 20, manaCost: 4 });

// --- Hard ステージ 11-15 ---
const bloodAtk = makeUnit('ai-blood-atk', '血攻', [RED, RED, RED, RED, RED, RED, RED, RED, RED] as PixelGrid, 'attacker', { hp: 110, attack: 28, defense: 5, speed: 2.8, attackSpeed: 18, range: 22, manaCost: 6 });

const frostDef = makeUnit('ai-frost-def', '霜壁', [BLU, BLU, BLU, BLU, WHT, BLU, BLU, BLU, BLU] as PixelGrid, 'defender', { hp: 200, attack: 8, defense: 20, speed: 1.0, attackSpeed: 50, range: 20, manaCost: 5 });
const frostHeal = makeUnit('ai-frost-heal', '霜癒', [GRN, BLU, GRN, BLU, GRN, BLU, GRN, BLU, GRN] as PixelGrid, 'healer', { hp: 150, attack: 12, defense: 14, speed: 1.2, attackSpeed: 38, range: 65, manaCost: 6 });

const stormSpd = makeUnit('ai-storm-spd', '嵐速', [YLW, YLW, YLW, YLW, RED, YLW, YLW, YLW, YLW] as PixelGrid, 'speedster', { hp: 80, attack: 20, defense: 4, speed: 4.0, attackSpeed: 16, range: 20, manaCost: 4 });

const sageHeal = makeUnit('ai-sage-heal', '賢癒', [GRN, WHT, GRN, WHT, GRN, WHT, GRN, WHT, GRN] as PixelGrid, 'healer', { hp: 160, attack: 14, defense: 12, speed: 1.5, attackSpeed: 35, range: 70, manaCost: 6 });

const godAtk = makeUnit('ai-god-atk', '神攻', [RED, YLW, RED, RED, WHT, RED, RED, YLW, RED] as PixelGrid, 'attacker', { hp: 130, attack: 28, defense: 6, speed: 2.5, attackSpeed: 18, range: 25, manaCost: 7 });
const godDef = makeUnit('ai-god-def', '神壁', [BLU, WHT, BLU, BLU, BLU, BLU, BLU, WHT, BLU] as PixelGrid, 'defender', { hp: 200, attack: 10, defense: 20, speed: 1.2, attackSpeed: 45, range: 20, manaCost: 6 });
const godHeal = makeUnit('ai-god-heal', '神癒', [GRN, WHT, GRN, GRN, WHT, GRN, GRN, WHT, GRN] as PixelGrid, 'healer', { hp: 170, attack: 14, defense: 14, speed: 1.5, attackSpeed: 35, range: 70, manaCost: 7 });
const godBal = makeUnit('ai-god-bal', '神兵', [WHT, BLK, WHT, RED, GRN, BLU, WHT, BLK, WHT] as PixelGrid, 'balanced', { hp: 150, attack: 18, defense: 12, speed: 2.0, attackSpeed: 28, range: 30, manaCost: 6 });

export const AI_OPPONENTS: AIOpponent[] = [
  // Easy
  { id: 'stage-1', name: 'ドットスライム', avatar: [GRN, GRN, GRN, GRN, BLK, GRN, GRN, GRN, GRN] as PixelGrid, difficulty: 'easy', deck: [slimeUnit, slimeUnit, slimeUnit], description: 'のんびり進軍するだけ', stageNumber: 1, rewardColorId: 'lime-green', rewardCoins: 100, castleHp: 300 },
  { id: 'stage-2', name: 'レッドナイト', avatar: [RED, RED, RED, RED, WHT, RED, RED, RED, RED] as PixelGrid, difficulty: 'easy', deck: [redKnightAtk, redKnightAtk, redKnightBal], description: '攻撃偏重。防御で耐えれば勝てる', stageNumber: 2, rewardColorId: 'crimson', rewardCoins: 120, castleHp: 350 },
  { id: 'stage-3', name: 'ブルーウォール', avatar: [BLU, BLU, BLU, BLU, BLU, BLU, BLU, BLU, BLU] as PixelGrid, difficulty: 'easy', deck: [blueWallDef, blueWallDef, blueWallDef], description: '硬いが攻撃力がない。時間切れ注意', stageNumber: 3, rewardColorId: 'sky-blue', rewardCoins: 120, castleHp: 400 },
  { id: 'stage-4', name: 'グリーンモンク', avatar: [___, GRN, ___, GRN, GRN, GRN, ___, GRN, ___] as PixelGrid, difficulty: 'easy', deck: [greenMonkHeal, greenMonkHeal, greenMonkDef], description: '回復持ち。集中攻撃で倒せ', stageNumber: 4, rewardColorId: 'orange', rewardCoins: 130, castleHp: 350 },
  { id: 'stage-5', name: 'イエローラッシュ', avatar: [YLW, ___, YLW, YLW, YLW, YLW, ___, YLW, ___] as PixelGrid, difficulty: 'easy', deck: [yellowRushSpd, yellowRushSpd, yellowRushSpd], description: '高速で次々来る。壁役が重要', stageNumber: 5, rewardColorId: 'purple', rewardCoins: 150, castleHp: 300 },

  // Normal
  { id: 'stage-6', name: 'ファイアロード', avatar: [RED, YLW, RED, YLW, RED, YLW, RED, YLW, RED] as PixelGrid, difficulty: 'normal', deck: [fireAtk, fireAtk, fireSpd], description: '火力と速度の両立。回復で対抗', stageNumber: 6, rewardColorId: 'pink', rewardCoins: 160, castleHp: 450 },
  { id: 'stage-7', name: 'アイスガード', avatar: [BLU, WHT, BLU, WHT, BLU, WHT, BLU, WHT, BLU] as PixelGrid, difficulty: 'normal', deck: [iceDef, iceDef, iceHeal], description: '鉄壁＋回復。長期戦は不利', stageNumber: 7, rewardColorId: 'teal', rewardCoins: 170, castleHp: 500 },
  { id: 'stage-8', name: 'サンダーストーム', avatar: [YLW, YLW, YLW, YLW, WHT, YLW, YLW, YLW, YLW] as PixelGrid, difficulty: 'normal', deck: [thunderSpd, thunderSpd, thunderAtk], description: '開幕ラッシュ。序盤を凌げば勝ち', stageNumber: 8, rewardColorId: 'gold', rewardCoins: 180, castleHp: 400 },
  { id: 'stage-9', name: 'ダークプリースト', avatar: [BLK, GRN, BLK, GRN, BLK, GRN, BLK, GRN, BLK] as PixelGrid, difficulty: 'normal', deck: [darkHeal, darkHeal, darkAtk], description: '回復しながら攻め。相性有利で押せ', stageNumber: 9, rewardColorId: 'neon-green', rewardCoins: 180, castleHp: 500 },
  { id: 'stage-10', name: 'カオスナイト', avatar: [RED, BLU, YLW, GRN, WHT, RED, YLW, BLU, GRN] as PixelGrid, difficulty: 'normal', deck: [darkAtk, chaosDef, chaosSpd], description: 'バランス型。読みが重要', stageNumber: 10, rewardColorId: 'neon-pink', rewardCoins: 200, castleHp: 550 },

  // Hard
  { id: 'stage-11', name: 'ブラッドキング', avatar: [RED, BLK, RED, BLK, RED, BLK, RED, BLK, RED] as PixelGrid, difficulty: 'hard', deck: [bloodAtk, bloodAtk, bloodAtk], description: '超火力。防御型で受けきれ', stageNumber: 11, rewardColorId: 'ice-blue', rewardCoins: 220, castleHp: 600 },
  { id: 'stage-12', name: 'フロストエンペラー', avatar: [BLU, WHT, BLU, BLU, BLU, BLU, BLU, WHT, BLU] as PixelGrid, difficulty: 'hard', deck: [frostDef, frostDef, frostHeal], description: '鉄壁中の鉄壁。速攻型で殴り合え', stageNumber: 12, rewardColorId: 'blood-red', rewardCoins: 240, castleHp: 700 },
  { id: 'stage-13', name: 'ストームロード', avatar: [YLW, RED, YLW, YLW, YLW, YLW, YLW, RED, YLW] as PixelGrid, difficulty: 'hard', deck: [stormSpd, stormSpd, stormSpd], description: '超高速ラッシュ。壁3体で凌げ', stageNumber: 13, rewardColorId: 'royal-purple', rewardCoins: 250, castleHp: 550 },
  { id: 'stage-14', name: 'エターナルセイジ', avatar: [GRN, WHT, GRN, WHT, GRN, WHT, GRN, WHT, GRN] as PixelGrid, difficulty: 'hard', deck: [sageHeal, sageHeal, sageHeal], description: '回復地獄。火力集中で削り切れ', stageNumber: 14, rewardColorId: 'chromatic', rewardCoins: 260, castleHp: 650 },
  { id: 'stage-15', name: 'ピクセルゴッド', avatar: [WHT, RED, WHT, BLU, GRN, YLW, WHT, BLK, WHT] as PixelGrid, difficulty: 'hard', deck: [godAtk, godDef, godBal], description: '最終ボス。デッキ構成と配置タイミングが全て', stageNumber: 15, rewardColorId: 'void-black', rewardCoins: 300, castleHp: 800 },
];

export function getOpponentByStage(stage: number): AIOpponent | undefined {
  return AI_OPPONENTS.find(o => o.stageNumber === stage);
}
