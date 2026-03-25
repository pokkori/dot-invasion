import { PixelUnit, PixelColor, PixelGrid } from './unit';

/** バトルフィールド上の座標 */
export type Vec2 = {
  x: number;
  y: number;
};

/** フィールド上で活動中のユニットインスタンス */
export type BattleUnit = {
  instanceId: string;
  unitData: PixelUnit;
  owner: 'player' | 'enemy';
  position: Vec2;
  currentHp: number;
  state: 'moving' | 'attacking' | 'dying' | 'dead';
  target: string | null;
  attackCooldown: number;
  facing: 'up' | 'down';
  spawnFrame: number;
  dyingFrame?: number;
};

/** 飛散するドットパーティクル */
export type Particle = {
  id: string;
  position: Vec2;
  velocity: Vec2;
  color: PixelColor;
  life: number;
  maxLife: number;
  size: number;
};

/** 本拠地（城） */
export type Castle = {
  owner: 'player' | 'enemy';
  position: Vec2;
  maxHp: number;
  currentHp: number;
  width: number;
  height: number;
};

/** マナ状態 */
export type ManaState = {
  current: number;
  max: number;
  regenRate: number;
};

/** バトル全体の状態 */
export type BattleState = {
  phase: 'preparing' | 'battling' | 'finished';
  frameCount: number;
  maxFrames: number;
  playerCastle: Castle;
  enemyCastle: Castle;
  playerMana: ManaState;
  enemyMana: ManaState;
  units: BattleUnit[];
  particles: Particle[];
  playerDeck: PixelUnit[];
  enemyDeck: PixelUnit[];
  winner: 'player' | 'enemy' | 'draw' | null;
};

/** 対戦結果 */
export type MatchResult = {
  id: string;
  timestamp: number;
  opponentId: string;
  opponentName: string;
  winner: 'player' | 'enemy' | 'draw';
  playerDeckIds: string[];
  duration: number;
  playerCastleHpRemaining: number;
  enemyCastleHpRemaining: number;
  totalDamageDealt: number;
  totalDamageReceived: number;
  unitsDeployed: number;
  unitsLost: number;
  rewards: MatchReward;
};

/** 報酬 */
export type MatchReward = {
  xp: number;
  unlockedColors: string[];
  coins: number;
};

/** リプレイ1フレーム分（5fpsサンプリング） */
export type ReplayFrame = {
  frame: number;
  units: { instanceId: string; x: number; y: number; hp: number; state: string }[];
  playerCastleHp: number;
  enemyCastleHp: number;
  particles: { x: number; y: number; color: string }[];
};

/** AI対戦相手 */
export type AIOpponent = {
  id: string;
  name: string;
  avatar: PixelGrid;
  difficulty: 'easy' | 'normal' | 'hard';
  deck: PixelUnit[];
  description: string;
  stageNumber: number;
  rewardColorId: string;
  rewardCoins: number;
  castleHp: number;
};
