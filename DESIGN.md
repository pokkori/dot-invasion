# Pixel Siege / ドット侵略 - 詳細設計書

> **Version**: 1.0.0
> **Last Updated**: 2026-03-20
> **Tech Stack**: React Native (Expo SDK 52) + TypeScript + expo-gl (GLView)
> **Target**: iOS 15+ / Android 10+

---

## 目次

1. [プロジェクト構成](#1-プロジェクト構成)
2. [TypeScript型定義](#2-typescript型定義)
3. [画面設計](#3-画面設計)
4. [ゲームロジック](#4-ゲームロジック)
5. [ドット絵エディタ仕様](#5-ドット絵エディタ仕様)
6. [収益化設計](#6-収益化設計)
7. [アプリ特有機能](#7-アプリ特有機能)
8. [データ永続化](#8-データ永続化)
9. [シェア機能](#9-シェア機能)
10. [初期コンテンツ](#10-初期コンテンツ)

---

## 1. プロジェクト構成

```
pixel-siege/
├── app.json
├── package.json
├── tsconfig.json
├── babel.config.js
├── eas.json
├── App.tsx                          # Expo Router エントリ
├── app/
│   ├── _layout.tsx                  # Root layout (NavigationContainer)
│   ├── index.tsx                    # スプラッシュ→ホームへリダイレクト
│   ├── (tabs)/
│   │   ├── _layout.tsx              # タブナビゲーション定義
│   │   ├── home.tsx                 # ホーム画面
│   │   ├── editor.tsx               # ドット絵エディタ画面
│   │   ├── army.tsx                 # 軍団管理画面
│   │   └── shop.tsx                 # ショップ画面
│   ├── battle/
│   │   ├── _layout.tsx              # バトル画面レイアウト（タブ非表示）
│   │   ├── select.tsx               # 対戦相手選択画面
│   │   ├── deploy.tsx               # ユニット配置＋バトル本体画面
│   │   └── result.tsx               # 勝敗結果画面
│   └── settings.tsx                 # 設定画面
├── src/
│   ├── types/
│   │   ├── unit.ts                  # PixelUnit, Color, UnitStats
│   │   ├── battle.ts                # BattleState, BattleUnit, Projectile
│   │   ├── player.ts                # PlayerData, Inventory, Achievement
│   │   └── shop.ts                  # ShopItem, IAPProduct
│   ├── constants/
│   │   ├── colors.ts                # 色パレット定義（初期+アンロック）
│   │   ├── presets.ts               # プリセットユニット5体
│   │   ├── ai-opponents.ts          # AI対戦相手15体定義
│   │   ├── achievements.ts          # 実績30個定義
│   │   ├── balance.ts               # ゲームバランス数値（マナ・ダメージ係数）
│   │   └── stages.ts                # ステージ定義（AI難易度マッピング）
│   ├── engine/
│   │   ├── GameEngine.ts            # メインゲームループ（60fps requestAnimationFrame）
│   │   ├── UnitFactory.ts           # RGB→ステータス変換・ユニット生成
│   │   ├── PhysicsEngine.ts         # 移動・衝突判定・押し出し処理
│   │   ├── CombatEngine.ts          # ダメージ計算・死亡処理・パーティクル生成
│   │   ├── AIController.ts          # AI思考ロジック（3難易度）
│   │   ├── ManaSystem.ts            # マナ管理・回復
│   │   └── ParticleSystem.ts        # ドット粒子エフェクト管理
│   ├── components/
│   │   ├── PixelGrid.tsx            # 3×3ピクセルエディタ本体
│   │   ├── ColorPalette.tsx         # 色選択パレット
│   │   ├── UnitCard.tsx             # ユニットカード表示（ステータスバー付き）
│   │   ├── BattleCanvas.tsx         # バトル描画Canvas（expo-gl）
│   │   ├── ManaBar.tsx              # マナゲージUI
│   │   ├── HealthBar.tsx            # 本拠地HPバー
│   │   ├── DeploySlot.tsx           # 配置スロット（3枠）
│   │   ├── UnitPreview.tsx          # ユニットプレビュー（拡大表示）
│   │   ├── ParticleOverlay.tsx      # パーティクルエフェクト描画
│   │   ├── ResultModal.tsx          # 勝敗モーダル
│   │   ├── AchievementToast.tsx     # 実績解除トースト
│   │   ├── RewardAnimation.tsx      # 報酬獲得アニメーション
│   │   └── AdBanner.tsx             # AdMobバナー広告ラッパー
│   ├── hooks/
│   │   ├── useGameLoop.ts           # requestAnimationFrame管理
│   │   ├── useBattle.ts             # バトル状態管理（useReducer）
│   │   ├── usePlayerData.ts         # プレイヤーデータCRUD
│   │   ├── useHaptics.ts            # 振動フィードバック
│   │   ├── useSound.ts             # 効果音再生
│   │   └── useAds.ts                # AdMob広告制御
│   ├── stores/
│   │   ├── playerStore.ts           # Zustand: プレイヤー状態
│   │   └── battleStore.ts           # Zustand: バトル中状態
│   ├── utils/
│   │   ├── storage.ts               # AsyncStorage ラッパー
│   │   ├── colorUtils.ts            # RGB操作・比率計算
│   │   ├── shareUtils.ts            # シェア画像生成・GIF生成
│   │   ├── hapticUtils.ts           # ハプティクスパターン定義
│   │   ├── soundUtils.ts            # サウンドファイル管理
│   │   └── mathUtils.ts             # ベクトル演算・乱数
│   └── services/
│       ├── iapService.ts            # アプリ内課金処理
│       ├── adService.ts             # AdMob初期化・リワード広告
│       ├── analyticsService.ts      # イベント計測
│       └── gameCenterService.ts     # Game Center / Google Play Games
├── assets/
│   ├── images/
│   │   ├── logo.png                 # アプリロゴ（512×512）
│   │   ├── splash.png               # スプラッシュ画面
│   │   ├── battle-bg.png            # バトル背景（ドット絵風草原 320×568）
│   │   ├── castle-player.png        # プレイヤー本拠地スプライト（32×32）
│   │   ├── castle-enemy.png         # 敵本拠地スプライト（32×32）
│   │   └── icons/
│   │       ├── mana.png             # マナアイコン（16×16）
│   │       ├── attack.png           # 攻撃アイコン
│   │       ├── defense.png          # 防御アイコン
│   │       ├── speed.png            # 速度アイコン
│   │       └── hp.png               # HPアイコン
│   ├── sounds/
│   │   ├── deploy.mp3               # ユニット配置音（ポッ）
│   │   ├── hit.mp3                  # ヒット音（パシッ）
│   │   ├── destroy.mp3              # 破壊音（バシャッ）
│   │   ├── victory.mp3              # 勝利ファンファーレ（2秒）
│   │   ├── defeat.mp3               # 敗北音（1.5秒）
│   │   ├── mana-ready.mp3           # マナ満タン通知（チーン）
│   │   └── unlock.mp3               # アンロック音（キラーン）
│   └── fonts/
│       └── PixelMplus12-Regular.ttf # ドット絵フォント
└── __tests__/
    ├── engine/
    │   ├── UnitFactory.test.ts
    │   ├── PhysicsEngine.test.ts
    │   ├── CombatEngine.test.ts
    │   └── AIController.test.ts
    └── utils/
        └── colorUtils.test.ts
```

### package.json 主要依存関係

```json
{
  "dependencies": {
    "expo": "~52.0.0",
    "expo-router": "~4.0.0",
    "expo-gl": "~14.0.0",
    "expo-haptics": "~13.0.0",
    "expo-av": "~14.0.0",
    "expo-sharing": "~12.0.0",
    "expo-file-system": "~17.0.0",
    "expo-image-manipulator": "~12.0.0",
    "expo-in-app-purchases": "~15.0.0",
    "react-native-game-center": "^2.0.0",
    "react-native-google-mobile-ads": "^14.0.0",
    "zustand": "^4.5.0",
    "@react-native-async-storage/async-storage": "^1.23.0",
    "react-native-reanimated": "~3.16.0",
    "react-native-gesture-handler": "~2.20.0",
    "gifenc": "^1.0.3"
  }
}
```

---

## 2. TypeScript型定義

### src/types/unit.ts

```typescript
/** ピクセルの色。RGBA形式 */
export type PixelColor = {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
  a: number; // 0-1（0=透明=空セル）
};

/** カラーパレットの1色分 */
export type PaletteColor = {
  id: string;           // "red-basic", "blue-neon" など
  name: string;         // 表示名（日本語）
  hex: string;          // "#FF0000"
  rgb: PixelColor;
  unlocked: boolean;    // アンロック済みか
  unlockCondition: string; // アンロック条件の説明
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
};

/** 3×3ピクセルグリッド（9セル）。行優先。[0]が左上、[8]が右下 */
export type PixelGrid = [
  PixelColor, PixelColor, PixelColor,
  PixelColor, PixelColor, PixelColor,
  PixelColor, PixelColor, PixelColor,
];

/** RGB比率から決定される兵種 */
export type UnitClass =
  | 'attacker'   // 赤比率最大
  | 'defender'   // 青比率最大
  | 'healer'     // 緑比率最大
  | 'speedster'  // 黄比率最大（R+G高、B低）
  | 'balanced';  // 比率均等

/** ユニットの戦闘ステータス */
export type UnitStats = {
  hp: number;          // 体力（50-200）
  attack: number;      // 攻撃力（5-30）
  defense: number;     // 防御力（1-20）
  speed: number;       // 移動速度 px/frame（1.0-4.0）
  attackSpeed: number; // 攻撃間隔 frames（15-60。低いほど速い）
  range: number;       // 攻撃射程 px（20-80。近接20、遠距離80）
  manaCost: number;    // 配置に必要なマナ（2-8）
};

/** プレイヤーが作成・所持するピクセルユニット */
export type PixelUnit = {
  id: string;          // UUID v4
  name: string;        // ユーザー命名（最大8文字）
  grid: PixelGrid;     // 3×3ピクセルデータ
  unitClass: UnitClass;
  stats: UnitStats;
  createdAt: number;   // Date.now()
  wins: number;        // このユニットでの勝利数
  losses: number;
  isPreset: boolean;   // プリセットユニットか
};

/** デッキ（出撃ユニット3体） */
export type Deck = {
  id: string;
  name: string;
  unitIds: [string, string, string]; // 必ず3体
};
```

### src/types/battle.ts

```typescript
import { PixelUnit, PixelColor } from './unit';

/** バトルフィールド上の座標 */
export type Vec2 = {
  x: number; // 0-320（フィールド幅 320px）
  y: number; // 0-568（フィールド高 568px）
};

/** フィールド上で活動中のユニットインスタンス */
export type BattleUnit = {
  instanceId: string;         // バトル内のユニーク識別子
  unitData: PixelUnit;        // 元のユニットデータ
  owner: 'player' | 'enemy';
  position: Vec2;
  currentHp: number;          // 残りHP
  state: 'moving' | 'attacking' | 'dying' | 'dead';
  target: string | null;      // 攻撃対象のinstanceId（null=本拠地に向かう）
  attackCooldown: number;     // 次の攻撃までの残りフレーム数
  facing: 'up' | 'down';     // 向き（player=up, enemy=down）
  spawnFrame: number;         // 出現フレーム
};

/** 飛散するドットパーティクル */
export type Particle = {
  id: string;
  position: Vec2;
  velocity: Vec2;
  color: PixelColor;
  life: number;      // 残存フレーム数（0で消滅）
  maxLife: number;    // 初期寿命
  size: number;       // 描画サイズ（px） 2-6
};

/** 本拠地（城） */
export type Castle = {
  owner: 'player' | 'enemy';
  position: Vec2;      // 中心座標
  maxHp: number;       // 最大HP（500）
  currentHp: number;
  width: number;       // 当たり判定幅（32）
  height: number;      // 当たり判定高（32）
};

/** マナ状態 */
export type ManaState = {
  current: number;     // 現在のマナ（0.0-10.0）
  max: number;         // 最大マナ（10）
  regenRate: number;   // 1フレームあたりの回復量（0.01 = 約10秒で1マナ）
};

/** バトル全体の状態 */
export type BattleState = {
  phase: 'preparing' | 'battling' | 'finished';
  frameCount: number;           // 経過フレーム数
  maxFrames: number;            // 制限時間（180秒 = 10800フレーム @60fps）
  playerCastle: Castle;
  enemyCastle: Castle;
  playerMana: ManaState;
  enemyMana: ManaState;
  units: BattleUnit[];          // フィールド上の全ユニット
  particles: Particle[];        // 表示中のパーティクル
  playerDeck: PixelUnit[];      // プレイヤーの手持ち3体
  enemyDeck: PixelUnit[];       // 敵の手持ち3体
  winner: 'player' | 'enemy' | 'draw' | null;
};

/** 対戦結果 */
export type MatchResult = {
  id: string;
  timestamp: number;
  opponent: AIOpponent;
  winner: 'player' | 'enemy' | 'draw';
  playerDeck: PixelUnit[];
  enemyDeck: PixelUnit[];
  duration: number;             // 経過フレーム数
  playerCastleHpRemaining: number;
  enemyCastleHpRemaining: number;
  totalDamageDealt: number;
  totalDamageReceived: number;
  unitsDeployed: number;
  unitsLost: number;
  rewards: MatchReward;
  replayFrames: ReplayFrame[];  // リプレイ用フレームデータ（5fpsサンプリング）
};

/** 報酬 */
export type MatchReward = {
  xp: number;
  unlockedColors: string[];    // アンロックされた色ID
  coins: number;               // ゲーム内通貨
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
  name: string;               // "ドット将軍" など
  avatar: PixelGrid;          // 3×3のアバター
  difficulty: 'easy' | 'normal' | 'hard';
  deck: PixelUnit[];          // AI固有ユニット3体
  description: string;        // "赤一色の猛攻が得意" など
  stageNumber: number;        // ステージ番号（1-15）
  rewardColorId: string;      // 勝利時にアンロックされる色ID
  rewardCoins: number;        // 勝利報酬コイン
  castleHp: number;           // 本拠地HP（ステージ依存: 300-800）
};
```

### src/types/player.ts

```typescript
import { PixelUnit, Deck, PaletteColor } from './unit';
import { MatchResult } from './battle';

/** プレイヤーの全永続データ */
export type PlayerData = {
  version: number;              // データバージョン（マイグレーション用）
  profile: PlayerProfile;
  inventory: Inventory;
  progress: Progress;
  settings: GameSettings;
  stats: PlayerStats;
};

export type PlayerProfile = {
  name: string;                 // プレイヤー名（初回起動時に入力、最大8文字）
  createdAt: number;
  lastPlayedAt: number;
};

export type Inventory = {
  units: PixelUnit[];           // 所持ユニット一覧（最大50体）
  decks: Deck[];                // 保存済みデッキ（最大5個）
  activeDeckId: string;         // 現在選択中のデッキID
  unlockedColorIds: string[];   // アンロック済み色ID
  coins: number;                // ゲーム内通貨
  gems: number;                 // 課金通貨
  adsWatchedToday: number;      // 本日視聴広告数
  lastAdDate: string;           // "2026-03-20" 形式
};

export type Progress = {
  currentStage: number;          // 到達ステージ（1-15）
  clearedStages: number[];       // クリア済みステージ番号配列
  matchHistory: MatchResult[];   // 直近50戦の履歴
  achievements: AchievementState[];
  tutorialCompleted: boolean;
  totalWins: number;
  totalLosses: number;
};

export type AchievementState = {
  id: string;
  unlocked: boolean;
  unlockedAt: number | null;
  progress: number;              // 0.0-1.0（進捗率）
};

export type GameSettings = {
  soundEnabled: boolean;
  hapticEnabled: boolean;
  notificationsEnabled: boolean;
  language: 'ja' | 'en';
  battleSpeed: 1 | 1.5 | 2;     // バトル速度倍率
};

export type PlayerStats = {
  totalBattles: number;
  totalUnitsCreated: number;
  totalParticlesGenerated: number; // シェア用のおもしろ統計
  longestWinStreak: number;
  currentWinStreak: number;
  favoriteUnitId: string | null;   // 最も使用したユニットID
};
```

### src/types/shop.ts

```typescript
/** ショップアイテム */
export type ShopItem = {
  id: string;
  type: 'color_pack' | 'unit_slot' | 'deck_slot' | 'gem_pack' | 'ad_removal';
  name: string;
  description: string;
  priceType: 'coins' | 'gems' | 'real_money';
  price: number;                  // coins/gems数 or 円
  contents: ShopItemContent[];
  available: boolean;
  purchaseLimit: number;          // 0=無制限
  purchasedCount: number;
};

export type ShopItemContent = {
  type: 'color' | 'coins' | 'gems' | 'unit_slot' | 'deck_slot';
  id?: string;                    // color IDなど
  amount: number;
};

/** IAP商品定義 */
export type IAPProduct = {
  productId: string;              // App Store / Play Store の商品ID
  name: string;
  price: string;                  // "¥160" など（ストアから取得）
  gems: number;                   // 付与ジェム数
  bonusGems: number;              // ボーナス分
  popular: boolean;               // 「人気」バッジ表示
};
```

---

## 3. 画面設計

### 3.1 ホーム画面 (`app/(tabs)/home.tsx`)

```
┌──────────────────────────────────────┐
│  ═══ PIXEL SIEGE ═══                 │  ← ドットフォント、ネオンカラー
│  ドット侵略                           │
│                                      │
│  ┌────────────────────────────┐      │
│  │  [プレイヤーの代表ユニット]    │      │  ← 3×3を拡大表示（48×48px）
│  │  ★ Lv.5  勝率 62%           │      │
│  │  コイン: 1,250  ジェム: 30    │      │
│  └────────────────────────────┘      │
│                                      │
│  ┌──────────────────────────────┐    │
│  │  ⚔️ 出 撃（ステージ 3）       │    │  ← メインCTAボタン（大・赤グラデ）
│  └──────────────────────────────┘    │
│                                      │
│  ┌─────────┐  ┌─────────────────┐   │
│  │フリーバトル│  │  今日のチャレンジ  │   │  ← 横並び2ボタン
│  │ (ランダムAI)│  │  報酬: 金色×1    │   │
│  └─────────┘  └─────────────────┘   │
│                                      │
│  ── 戦績 ──────────────────────      │
│  直近5戦: ○○×○×                     │
│  連勝記録: 4                          │
│                                      │
│  [バナー広告 320×50]                  │
│                                      │
│  [🏠ホーム] [🎨エディタ] [⚔️軍団] [🛒ショップ]  │  ← タブバー
└──────────────────────────────────────┘
```

**操作フロー**:
- 「出撃」タップ → `battle/select.tsx` に遷移
- 「フリーバトル」 → ランダムAI選択してすぐ `battle/deploy.tsx`
- 「今日のチャレンジ」 → 日替わり特殊条件バトル（例: マナ回復2倍）

### 3.2 ドット絵エディタ画面 (`app/(tabs)/editor.tsx`)

```
┌──────────────────────────────────────┐
│  ← 戻る       ユニット作成       保存 →│
│                                      │
│         ┌───┬───┬───┐               │
│         │   │   │   │   ← 3×3グリッド │
│         ├───┼───┼───┤     各セル80×80px│
│         │   │   │   │     タップで色塗り │
│         ├───┼───┼───┤                 │
│         │   │   │   │                 │
│         └───┴───┴───┘               │
│                                      │
│  [消しゴム] [全消去] [ランダム]          │  ← ツールバー
│                                      │
│  ── カラーパレット ──                  │
│  🔴🔵🟢🟡⬜⬛ [🔒][🔒][🔒]          │  ← 横スクロール
│  赤  青  緑  黄  白  黒  ???          │    ロックはグレー表示
│                                      │
│  ── プレビュー ──                     │
│  兵種: ⚔️アタッカー                   │  ← リアルタイム判定
│  ┌──────────────────────┐            │
│  │ HP     ████████░░ 120 │            │  ← ステータスバー
│  │ ATK    ██████████ 25  │            │
│  │ DEF    ███░░░░░░░  5  │            │
│  │ SPD    ██████░░░░ 2.5 │            │
│  │ RANGE  ██░░░░░░░░ 20  │            │    近接
│  │ COST   ████░░░░░░  4  │            │    マナコスト
│  └──────────────────────┘            │
│                                      │
│  名前: [________]  (最大8文字)         │
│                                      │
│  [💾 保存してデッキに追加]              │  ← 主要アクション
│                                      │
│  [🏠ホーム] [🎨エディタ] [⚔️軍団] [🛒ショップ]  │
└──────────────────────────────────────┘
```

**操作フロー**:
1. パレットから色をタップして選択（選択中の色にはボーダー表示）
2. グリッドのセルをタップ → 選択色で塗る
3. リアルタイムでプレビュー欄のステータスが更新される
4. 名前入力 → 「保存してデッキに追加」で所持ユニットに保存
5. 空セル（a=0）は透明として扱い、ステータス計算に含まない

### 3.3 軍団管理画面 (`app/(tabs)/army.tsx`)

```
┌──────────────────────────────────────┐
│  ← 戻る         軍団管理              │
│                                      │
│  ── 出撃デッキ ──                     │
│  ┌────┐  ┌────┐  ┌────┐             │
│  │ 🟥 │  │ 🟦 │  │ 🟩 │   ← 3枠固定  │
│  │赤鬼  │  │盾兵  │  │回復  │            │
│  │ATK25 │  │DEF18│  │HP180│            │
│  │COST4 │  │COST3│  │COST5│            │
│  └────┘  └────┘  └────┘             │
│  [長押しで入れ替え]                     │
│                                      │
│  ── 所持ユニット (12/50) ──            │
│  ┌────┐┌────┐┌────┐┌────┐           │  ← スクロール可能グリッド
│  │    ││    ││    ││    │           │    4列表示
│  └────┘└────┘└────┘└────┘           │
│  ┌────┐┌────┐┌────┐┌────┐           │
│  │    ││    ││    ││    │           │
│  └────┘└────┘└────┘└────┘           │
│  ...                                 │
│                                      │
│  [＋ 新規作成]                        │  ← エディタ画面へ遷移
│                                      │
│  [🏠ホーム] [🎨エディタ] [⚔️軍団] [🛒ショップ]  │
└──────────────────────────────────────┘
```

**操作**:
- ユニットカードをタップ → 詳細モーダル（ステータス・戦績・削除）
- ユニットカードを長押し → ドラッグ＆ドロップでデッキ枠に配置
- デッキ枠のユニットをタップ → デッキから外す確認ダイアログ

### 3.4 対戦相手選択画面 (`app/battle/select.tsx`)

```
┌──────────────────────────────────────┐
│  ← 戻る      ステージ選択             │
│                                      │
│  ── ステージ 1-5: 初陣の荒野 ──       │
│  ┌──────────────────────────────┐    │
│  │ ★☆☆  ドットスライム            │    │  ← クリア済み=星表示
│  │ [🟢🟢🟢 / 🟢🟩🟢 / 🟢🟢🟢] │    │     AIアバター表示
│  │ "のんびり進軍するだけ"           │    │
│  │ 報酬: ライムグリーン             │    │
│  │                    [挑戦する]   │    │
│  └──────────────────────────────┘    │
│                                      │
│  ┌──────────────────────────────┐    │
│  │ ★★☆  レッドナイト              │    │
│  │ ...                            │    │
│  └──────────────────────────────┘    │
│                                      │
│  ┌──────────────────────────────┐    │
│  │ 🔒 ステージ3 （ステージ2クリアで解放）│    │
│  └──────────────────────────────┘    │
│                                      │
│  ...（スクロール）                     │
└──────────────────────────────────────┘
```

### 3.5 バトル画面 (`app/battle/deploy.tsx`) ← ゲームの核心

```
┌──────────────────────────────────────┐
│ ❤️ ████████░░ 420/500   ⏱ 2:30      │  ← 敵城HPバー + 残り時間
│                                      │
│  ┌──────────────────────────────┐    │
│  │         [敵の城]               │    │  ← y=40 に固定
│  │              🔴                │    │     敵ユニットはここから出現
│  │           🔴    🔴             │    │
│  │                               │    │
│  │        ← 戦場エリア →          │    │  ← 320×400px のキャンバス
│  │     ユニットが自動進軍          │    │     ドット絵背景
│  │                               │    │     パーティクルが飛散
│  │           🔵    🔵             │    │
│  │              🔵                │    │     プレイヤーユニットは上に進む
│  │         [自分の城]             │    │  ← y=528 に固定
│  └──────────────────────────────┘    │
│                                      │
│ ❤️ ██████████ 500/500               │  ← 自城HPバー
│                                      │
│ マナ: ██████░░░░ 6.2/10             │  ← マナゲージ（青グラデ）
│                                      │
│ ┌────┐  ┌────┐  ┌────┐              │  ← 配置スロット3枠
│ │ 🟥 │  │ 🟦 │  │ 🟩 │              │    タップで選択→フィールドタップで配置
│ │赤鬼 │  │盾兵 │  │回復 │              │    マナ不足時はグレーアウト
│ │C:4  │  │C:3  │  │C:5  │              │    クールダウン表示（半透明オーバーレイ）
│ └────┘  └────┘  └────┘              │
│                                      │
│  [⏸ 一時停止]  [⏩ 2倍速]            │
└──────────────────────────────────────┘
```

**バトル画面の操作**:
1. 下部のスロットからユニットをタップ → 選択状態（枠がハイライト）
2. フィールドの自陣側（y > 350）をタップ → その位置にユニット配置
3. マナが足りない場合はスロットがグレーアウト、タップ不可
4. 配置済みユニットは自動で敵城へ進軍、途中で敵ユニットに遭遇したら交戦
5. 同じユニットは配置後クールダウン（3秒）で再配置可能

### 3.6 バトル結果画面 (`app/battle/result.tsx`)

```
┌──────────────────────────────────────┐
│                                      │
│         ⚔️ VICTORY! ⚔️              │  ← 勝利時: 金色フォント＋パーティクル
│         （または DEFEAT...）          │     敗北時: グレーフォント
│                                      │
│  ┌──────────────────────────────┐    │
│  │ 戦闘時間: 1:45                 │    │
│  │ 与ダメージ: 580                │    │
│  │ 被ダメージ: 210                │    │
│  │ 配置ユニット数: 8              │    │
│  │ 撃破ユニット数: 5              │    │
│  └──────────────────────────────┘    │
│                                      │
│  ── 報酬 ──                          │
│  🪙 +150コイン                       │
│  🎨 新色アンロック: ネオンピンク！     │  ← アンロック時のみ表示
│                                      │
│  ┌──────────────────────────────┐    │
│  │  📤 リプレイをシェア             │    │  ← GIF生成してシェア
│  └──────────────────────────────┘    │
│  ┌──────────────────────────────┐    │
│  │  🔄 もう一度                    │    │
│  └──────────────────────────────┘    │
│  ┌──────────────────────────────┐    │
│  │  🏠 ホームに戻る                │    │
│  └──────────────────────────────┘    │
│                                      │
│  [リワード広告で報酬2倍にする？]       │  ← 任意のリワード広告
└──────────────────────────────────────┘
```

### 3.7 ショップ画面 (`app/(tabs)/shop.tsx`)

```
┌──────────────────────────────────────┐
│  🛒 ショップ        🪙1,250  💎30    │
│                                      │
│  ── ジェムパック ──（課金）            │
│  ┌─────────┐┌─────────┐┌──────────┐│
│  │ 💎 80    ││ 💎 200   ││ 💎 500    ││
│  │ ¥160    ││ ¥370    ││ ¥860     ││
│  │         ││ ★人気    ││ +50ボーナス││
│  │ [購入]  ││ [購入]   ││ [購入]    ││
│  └─────────┘└─────────┘└──────────┘│
│                                      │
│  ── カラーパック ──（ジェム購入）      │
│  ┌──────────────────────────────┐    │
│  │ 🌈 レインボーパック              │    │
│  │ 虹色系5色セット  💎 50            │    │
│  │ [購入]                          │    │
│  └──────────────────────────────┘    │
│                                      │
│  ── コインで買えるもの ──             │
│  ユニット枠 +5: 🪙 500               │
│  デッキ枠 +1: 🪙 300                 │
│                                      │
│  ── 広告 ──                          │
│  📺 広告を見て💎5 GET（本日 2/5回）   │
│                                      │
│  [🏠ホーム] [🎨エディタ] [⚔️軍団] [🛒ショップ]  │
└──────────────────────────────────────┘
```

### 3.8 設定画面 (`app/settings.tsx`)

```
┌──────────────────────────────────────┐
│  ← 戻る          設定                │
│                                      │
│  サウンド          [ON ████ OFF]      │
│  振動フィードバック  [ON ████ OFF]      │
│  通知             [ON ████ OFF]      │
│  バトル速度        [1x] [1.5x] [2x]  │
│  言語             [日本語 ▼]         │
│                                      │
│  ── アカウント ──                     │
│  データバックアップ（Game Center連携） │
│  データリセット                       │
│                                      │
│  ── 情報 ──                          │
│  利用規約                             │
│  プライバシーポリシー                  │
│  ライセンス情報                       │
│  バージョン: 1.0.0                    │
└──────────────────────────────────────┘
```

---

## 4. ゲームロジック

### 4.1 RGB比率 → ステータス変換アルゴリズム (`src/engine/UnitFactory.ts`)

```typescript
/**
 * 3×3グリッドの全ピクセルのRGB値を集計し、比率からステータスを計算する。
 *
 * 手順:
 * 1. 全9セルのR,G,B,Y(=R+G-B)を合計
 * 2. 合計が0（全透明）の場合はデフォルトbalancedユニット
 * 3. 各チャネル比率を算出 → 兵種判定
 * 4. 比率をステータスにマッピング
 */

function calculateStats(grid: PixelGrid): { unitClass: UnitClass; stats: UnitStats } {
  // ステップ1: 塗られたセルのみ集計
  let totalR = 0, totalG = 0, totalB = 0;
  let filledCells = 0;

  for (const pixel of grid) {
    if (pixel.a === 0) continue; // 透明セルは無視
    totalR += pixel.r;
    totalG += pixel.g;
    totalB += pixel.b;
    filledCells++;
  }

  // 全透明 → デフォルト
  if (filledCells === 0) {
    return { unitClass: 'balanced', stats: DEFAULT_STATS };
  }

  // ステップ2: 正規化（0-1）
  const maxPossible = filledCells * 255;
  const rRatio = totalR / maxPossible; // 0.0-1.0
  const gRatio = totalG / maxPossible;
  const bRatio = totalB / maxPossible;

  // 黄色比率 = 赤＋緑が高く青が低い度合い
  const yRatio = Math.max(0, (rRatio + gRatio - bRatio) / 2);

  // ステップ3: 兵種判定
  const channels = { r: rRatio, g: gRatio, b: bRatio, y: yRatio };
  const maxChannel = Object.entries(channels)
    .sort(([,a], [,b]) => b - a)[0];

  // 最大チャネルと2番目の差が0.15未満 → balanced
  const sorted = Object.values(channels).sort((a, b) => b - a);
  const unitClass: UnitClass =
    (sorted[0] - sorted[1]) < 0.15 ? 'balanced' :
    maxChannel[0] === 'r' ? 'attacker' :
    maxChannel[0] === 'b' ? 'defender' :
    maxChannel[0] === 'g' ? 'healer' :
    'speedster'; // y

  // ステップ4: ステータスマッピング
  // セル数ボーナス: 塗ったセルが多いほどHPとコストが上がる
  const cellBonus = filledCells / 9; // 0.11-1.0

  const stats: UnitStats = {
    hp:          Math.round(lerp(50, 200, gRatio * 0.6 + bRatio * 0.3 + cellBonus * 0.1)),
    attack:      Math.round(lerp(5, 30,  rRatio * 0.8 + yRatio * 0.2)),
    defense:     Math.round(lerp(1, 20,  bRatio * 0.7 + gRatio * 0.3)),
    speed:       roundTo(lerp(1.0, 4.0,  yRatio * 0.5 + rRatio * 0.3 + (1 - bRatio) * 0.2), 1),
    attackSpeed: Math.round(lerp(60, 15, rRatio * 0.6 + yRatio * 0.4)), // 低い=速い
    range:       Math.round(lerp(20, 80, bRatio * 0.4 + gRatio * 0.4 + (1 - rRatio) * 0.2)),
    manaCost:    Math.round(lerp(2, 8,   cellBonus * 0.5 + (rRatio + bRatio + gRatio) / 3 * 0.5)),
  };

  return { unitClass, stats };
}

function lerp(min: number, max: number, t: number): number {
  return min + (max - min) * Math.max(0, Math.min(1, t));
}

function roundTo(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

// デフォルトステータス
const DEFAULT_STATS: UnitStats = {
  hp: 100, attack: 15, defense: 8, speed: 2.0,
  attackSpeed: 30, range: 30, manaCost: 4,
};
```

### 4.2 マナ管理・回復速度 (`src/engine/ManaSystem.ts`)

```typescript
/**
 * マナシステム仕様:
 * - 初期マナ: 5.0
 * - 最大マナ: 10.0
 * - 基本回復速度: 0.6/秒 (= 0.01/frame @60fps)
 * - オーバータイム回復: 残り60秒を切ったら回復速度1.5倍
 * - ユニット配置でmanaCostぶん消費
 * - マナ不足時は配置不可（UIグレーアウト）
 */

export class ManaSystem {
  private state: ManaState;
  private readonly BASE_REGEN = 0.01; // per frame (0.6/sec)
  private readonly OVERTIME_REGEN = 0.015; // per frame (0.9/sec)
  private readonly OVERTIME_THRESHOLD = 7200; // 残り60秒 = 10800 - 3600

  constructor() {
    this.state = {
      current: 5.0,
      max: 10.0,
      regenRate: this.BASE_REGEN,
    };
  }

  /** 毎フレーム呼ばれる */
  update(frameCount: number, maxFrames: number): void {
    const remainingFrames = maxFrames - frameCount;
    this.state.regenRate = remainingFrames < 3600
      ? this.OVERTIME_REGEN
      : this.BASE_REGEN;

    this.state.current = Math.min(
      this.state.max,
      this.state.current + this.state.regenRate
    );
  }

  /** ユニット配置時。成功=true、マナ不足=false */
  spend(cost: number): boolean {
    if (this.state.current < cost) return false;
    this.state.current -= cost;
    return true;
  }

  getState(): ManaState {
    return { ...this.state };
  }
}
```

### 4.3 ユニット移動・衝突判定・ダメージ計算 (`src/engine/PhysicsEngine.ts` + `CombatEngine.ts`)

```typescript
/**
 * PhysicsEngine: 移動と衝突検知
 *
 * フィールド座標系:
 *   原点(0,0) = 左上
 *   幅: 320px, 高: 568px
 *   プレイヤー城: (160, 536)  ← 下部中央
 *   敵城:       (160, 32)    ← 上部中央
 *
 * ユニット当たり判定: 円形、半径 = 8px
 * 城の当たり判定: 矩形 32×32px
 */

export class PhysicsEngine {
  private readonly UNIT_RADIUS = 8;
  private readonly FIELD_WIDTH = 320;
  private readonly FIELD_HEIGHT = 568;

  /** 全ユニットの移動処理。毎フレーム呼ばれる */
  updatePositions(units: BattleUnit[], playerCastle: Castle, enemyCastle: Castle): void {
    for (const unit of units) {
      if (unit.state === 'dead' || unit.state === 'dying') continue;

      // ターゲットがいればターゲットに向かう、いなければ敵城に向かう
      const targetPos = this.getTargetPosition(unit, units, playerCastle, enemyCastle);
      if (!targetPos) continue;

      const dx = targetPos.x - unit.position.x;
      const dy = targetPos.y - unit.position.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // 攻撃射程内ならば停止して攻撃モードへ
      if (dist <= unit.unitData.stats.range) {
        unit.state = 'attacking';
        continue;
      }

      // 移動
      unit.state = 'moving';
      const speed = unit.unitData.stats.speed;
      unit.position.x += (dx / dist) * speed;
      unit.position.y += (dy / dist) * speed;

      // フィールド外に出ないようクランプ
      unit.position.x = Math.max(this.UNIT_RADIUS, Math.min(this.FIELD_WIDTH - this.UNIT_RADIUS, unit.position.x));
      unit.position.y = Math.max(this.UNIT_RADIUS, Math.min(this.FIELD_HEIGHT - this.UNIT_RADIUS, unit.position.y));
    }

    // 味方同士の押し出し処理（重なり防止）
    this.resolveOverlaps(units);
  }

  /** ターゲット選定: 射程内の最も近い敵ユニット。いなければ敵城 */
  private getTargetPosition(
    unit: BattleUnit,
    allUnits: BattleUnit[],
    playerCastle: Castle,
    enemyCastle: Castle,
  ): Vec2 | null {
    const enemies = allUnits.filter(u =>
      u.owner !== unit.owner &&
      u.state !== 'dead' &&
      u.state !== 'dying'
    );

    // 最も近い敵を探す
    let closestDist = Infinity;
    let closestPos: Vec2 | null = null;
    let closestId: string | null = null;

    for (const enemy of enemies) {
      const d = this.distance(unit.position, enemy.position);
      if (d < closestDist) {
        closestDist = d;
        closestPos = enemy.position;
        closestId = enemy.instanceId;
      }
    }

    // 索敵範囲: 射程の3倍以内に敵がいればそちらに向かう
    if (closestDist <= unit.unitData.stats.range * 3 && closestPos) {
      unit.target = closestId;
      return closestPos;
    }

    // 敵城に向かう
    unit.target = null;
    const targetCastle = unit.owner === 'player' ? enemyCastle : playerCastle;
    return targetCastle.position;
  }

  /** 味方同士の重なり解消（簡易弾性衝突） */
  private resolveOverlaps(units: BattleUnit[]): void {
    const alive = units.filter(u => u.state !== 'dead' && u.state !== 'dying');
    for (let i = 0; i < alive.length; i++) {
      for (let j = i + 1; j < alive.length; j++) {
        if (alive[i].owner !== alive[j].owner) continue; // 敵同士は重なってもOK
        const d = this.distance(alive[i].position, alive[j].position);
        const minDist = this.UNIT_RADIUS * 2;
        if (d < minDist && d > 0) {
          const overlap = (minDist - d) / 2;
          const dx = (alive[j].position.x - alive[i].position.x) / d;
          const dy = (alive[j].position.y - alive[i].position.y) / d;
          alive[i].position.x -= dx * overlap;
          alive[i].position.y -= dy * overlap;
          alive[j].position.x += dx * overlap;
          alive[j].position.y += dy * overlap;
        }
      }
    }
  }

  private distance(a: Vec2, b: Vec2): number {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
  }
}
```

```typescript
/**
 * CombatEngine: ダメージ計算・死亡処理
 *
 * ダメージ公式:
 *   baseDamage = attacker.attack
 *   defense_reduction = defender.defense * 0.5
 *   finalDamage = max(1, baseDamage - defense_reduction) + random(-2, +2)
 *
 * 兵種相性ボーナス（ダメージ1.3倍）:
 *   attacker > healer（攻撃型は回復型に強い）
 *   healer > defender（回復型は防御型に強い: 長期戦で削る）
 *   defender > speedster（防御型は速攻型に強い: 硬い）
 *   speedster > attacker（速攻型は攻撃型に強い: 先手）
 *   balanced: 相性なし
 *
 * ヒーラー特殊能力:
 *   攻撃時、射程内の最もHPが低い味方を heal (= attack値の0.5倍) 回復
 *   敵への直接攻撃ダメージは attack * 0.3
 */

export class CombatEngine {
  private readonly TYPE_ADVANTAGE: Record<UnitClass, UnitClass> = {
    attacker: 'healer',
    healer: 'defender',
    defender: 'speedster',
    speedster: 'attacker',
    balanced: 'balanced', // 相性なし
  };

  /** 毎フレーム呼ばれる。攻撃中のユニットがクールダウン0になったらダメージ発生 */
  processCombat(
    units: BattleUnit[],
    playerCastle: Castle,
    enemyCastle: Castle,
    particleSystem: ParticleSystem,
  ): void {
    for (const unit of units) {
      if (unit.state !== 'attacking') continue;
      if (unit.attackCooldown > 0) {
        unit.attackCooldown--;
        continue;
      }

      // クールダウン完了 → 攻撃実行
      unit.attackCooldown = unit.unitData.stats.attackSpeed;

      // ヒーラーの味方回復
      if (unit.unitData.unitClass === 'healer') {
        this.healAlly(unit, units);
      }

      // ターゲットにダメージ
      if (unit.target) {
        const target = units.find(u => u.instanceId === unit.target);
        if (target && target.state !== 'dead') {
          const damage = this.calculateDamage(unit, target);
          target.currentHp -= damage;

          // パーティクル生成（被弾位置からドットが飛散）
          particleSystem.spawnHitParticles(target.position, target.unitData.grid, damage);

          if (target.currentHp <= 0) {
            target.state = 'dying';
            target.currentHp = 0;
            // 死亡パーティクル（ユニット全ドットが弾ける）
            particleSystem.spawnDeathParticles(target.position, target.unitData.grid);
          }
        }
      } else {
        // 城への攻撃
        const targetCastle = unit.owner === 'player' ? enemyCastle : playerCastle;
        const damage = Math.max(1, unit.unitData.stats.attack - 3); // 城は防御力3固定
        targetCastle.currentHp -= damage;
        particleSystem.spawnCastleHitParticles(targetCastle.position, damage);
      }
    }
  }

  private calculateDamage(attacker: BattleUnit, defender: BattleUnit): number {
    const atk = attacker.unitData.stats.attack;
    const def = defender.unitData.stats.defense;
    let baseDamage = Math.max(1, atk - def * 0.5);

    // 兵種相性チェック
    if (this.TYPE_ADVANTAGE[attacker.unitData.unitClass] === defender.unitData.unitClass) {
      baseDamage *= 1.3;
    }
    // 逆相性（被ダメ軽減はしない、攻撃側のみボーナス）

    // ヒーラーの攻撃力低下
    if (attacker.unitData.unitClass === 'healer') {
      baseDamage *= 0.3;
    }

    // ランダム揺れ
    const variance = Math.floor(Math.random() * 5) - 2; // -2 to +2
    return Math.max(1, Math.round(baseDamage + variance));
  }

  private healAlly(healer: BattleUnit, units: BattleUnit[]): void {
    const allies = units.filter(u =>
      u.owner === healer.owner &&
      u.instanceId !== healer.instanceId &&
      u.state !== 'dead' &&
      u.state !== 'dying'
    );
    if (allies.length === 0) return;

    // HPが最も低い味方を回復
    const target = allies.sort((a, b) =>
      (a.currentHp / a.unitData.stats.hp) - (b.currentHp / b.unitData.stats.hp)
    )[0];

    const healAmount = Math.round(healer.unitData.stats.attack * 0.5);
    target.currentHp = Math.min(target.unitData.stats.hp, target.currentHp + healAmount);
  }
}
```

### 4.4 パーティクルシステム (`src/engine/ParticleSystem.ts`)

```typescript
/**
 * ドット粒子エフェクト管理
 *
 * パーティクルタイプ:
 * 1. ヒットパーティクル: 被弾時に2-4個飛散。寿命15フレーム。色=被弾ユニットの色
 * 2. デスパーティクル: 死亡時に9個（全ドット）が弾ける。寿命30フレーム
 * 3. 城ヒットパーティクル: 城被弾時に灰色3個。寿命20フレーム
 * 4. 配置パーティクル: ユニット出現時にキラキラ5個。寿命10フレーム。色=白
 *
 * 最大同時パーティクル数: 200（超過時は古いものから削除）
 */

export class ParticleSystem {
  private particles: Particle[] = [];
  private readonly MAX_PARTICLES = 200;
  private nextId = 0;

  /** 被弾時パーティクル */
  spawnHitParticles(position: Vec2, grid: PixelGrid, damage: number): void {
    const count = Math.min(4, Math.max(2, Math.floor(damage / 5)));
    const colors = grid.filter(p => p.a > 0);
    for (let i = 0; i < count; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)] || { r: 255, g: 255, b: 255, a: 1 };
      this.spawn({
        position: { ...position },
        velocity: {
          x: (Math.random() - 0.5) * 6,
          y: (Math.random() - 0.5) * 6,
        },
        color,
        life: 15,
        size: 3 + Math.random() * 2,
      });
    }
  }

  /** 死亡時パーティクル（全9ドットが弾ける） */
  spawnDeathParticles(position: Vec2, grid: PixelGrid): void {
    for (let i = 0; i < 9; i++) {
      const pixel = grid[i];
      if (pixel.a === 0) continue;
      // グリッド位置に基づく飛散方向
      const gridX = (i % 3) - 1; // -1, 0, 1
      const gridY = Math.floor(i / 3) - 1;
      this.spawn({
        position: { ...position },
        velocity: {
          x: gridX * 3 + (Math.random() - 0.5) * 2,
          y: gridY * 3 + (Math.random() - 0.5) * 2,
        },
        color: pixel,
        life: 30,
        size: 5,
      });
    }
  }

  /** 城被弾パーティクル */
  spawnCastleHitParticles(position: Vec2, damage: number): void {
    for (let i = 0; i < 3; i++) {
      this.spawn({
        position: { ...position },
        velocity: {
          x: (Math.random() - 0.5) * 4,
          y: -Math.random() * 3,
        },
        color: { r: 180, g: 180, b: 180, a: 1 },
        life: 20,
        size: 4,
      });
    }
  }

  /** 配置時キラキラ */
  spawnDeployParticles(position: Vec2): void {
    for (let i = 0; i < 5; i++) {
      this.spawn({
        position: { ...position },
        velocity: {
          x: (Math.random() - 0.5) * 4,
          y: (Math.random() - 0.5) * 4,
        },
        color: { r: 255, g: 255, b: 255, a: 1 },
        life: 10,
        size: 2 + Math.random() * 2,
      });
    }
  }

  private spawn(params: {
    position: Vec2; velocity: Vec2; color: PixelColor; life: number; size: number;
  }): void {
    if (this.particles.length >= this.MAX_PARTICLES) {
      this.particles.shift(); // 最古のパーティクル削除
    }
    this.particles.push({
      id: `p_${this.nextId++}`,
      position: params.position,
      velocity: params.velocity,
      color: params.color,
      life: params.life,
      maxLife: params.life,
      size: params.size,
    });
  }

  /** 毎フレーム更新。重力+減衰+寿命管理 */
  update(): void {
    for (const p of this.particles) {
      p.position.x += p.velocity.x;
      p.position.y += p.velocity.y;
      p.velocity.y += 0.1; // 重力
      p.velocity.x *= 0.95; // 空気抵抗
      p.velocity.y *= 0.95;
      p.life--;
    }
    this.particles = this.particles.filter(p => p.life > 0);
  }

  getParticles(): Particle[] {
    return this.particles;
  }
}
```

### 4.5 AI対戦ロジック (`src/engine/AIController.ts`)

```typescript
/**
 * AI対戦コントローラー
 *
 * 3段階の難易度:
 *
 * ■ easy（ステージ1-5）
 *   - 配置間隔: 5-8秒（ランダム）
 *   - ユニット選択: 完全ランダム
 *   - 配置位置: フィールド上部中央付近にランダム
 *   - マナ管理: マナMAXまで待ってから使う（非効率）
 *
 * ■ normal（ステージ6-10）
 *   - 配置間隔: 3-5秒
 *   - ユニット選択: マナ効率を考慮（cost/attack比）
 *   - 配置位置: プレイヤーユニットが多い列に対向配置
 *   - マナ管理: コスト分溜まったら即配置
 *
 * ■ hard（ステージ11-15）
 *   - 配置間隔: 2-4秒
 *   - ユニット選択: 兵種相性を考慮（プレイヤーのデッキ分析）
 *   - 配置位置: 相性有利なユニットをプレイヤーユニットの進路上に配置
 *   - マナ管理: 最適コスト管理（残マナに応じて低コストユニットを複数配置）
 *   - 特殊行動: プレイヤー城HPが50%以下になったらラッシュ（最低コストユニット連打）
 */

export class AIController {
  private difficulty: 'easy' | 'normal' | 'hard';
  private nextDeployFrame: number;
  private deck: PixelUnit[];

  constructor(opponent: AIOpponent) {
    this.difficulty = opponent.difficulty;
    this.deck = opponent.deck;
    this.nextDeployFrame = this.getInitialDelay();
  }

  /** 毎フレーム呼ばれる。配置が必要ならBattleUnitを返す */
  update(
    frameCount: number,
    enemyMana: ManaState,
    battleUnits: BattleUnit[],
    playerCastle: Castle,
    enemyCastle: Castle,
  ): { unit: PixelUnit; position: Vec2 } | null {
    if (frameCount < this.nextDeployFrame) return null;

    // ユニット選択
    const selectedUnit = this.selectUnit(enemyMana, battleUnits);
    if (!selectedUnit) return null;
    if (enemyMana.current < selectedUnit.stats.manaCost) return null;

    // 配置位置決定
    const position = this.selectPosition(selectedUnit, battleUnits, playerCastle);

    // 次の配置タイミング設定
    this.nextDeployFrame = frameCount + this.getDeployInterval();

    return { unit: selectedUnit, position };
  }

  private selectUnit(mana: ManaState, battleUnits: BattleUnit[]): PixelUnit | null {
    const affordable = this.deck.filter(u => u.stats.manaCost <= mana.current);
    if (affordable.length === 0) return null;

    switch (this.difficulty) {
      case 'easy':
        // ランダム選択
        return affordable[Math.floor(Math.random() * affordable.length)];

      case 'normal':
        // マナ効率が良いユニットを優先（attack/cost比）
        return affordable.sort((a, b) =>
          (b.stats.attack / b.stats.manaCost) - (a.stats.attack / a.stats.manaCost)
        )[0];

      case 'hard': {
        // プレイヤーユニットの兵種を分析し、相性有利なユニットを選択
        const playerUnits = battleUnits.filter(u => u.owner === 'player' && u.state !== 'dead');
        if (playerUnits.length === 0) {
          // プレイヤーが出していなければ攻撃型を出す
          return affordable.find(u => u.unitClass === 'attacker') || affordable[0];
        }
        // 最も多い兵種に対して有利な兵種を選択
        const classCount: Record<UnitClass, number> = {
          attacker: 0, defender: 0, healer: 0, speedster: 0, balanced: 0,
        };
        playerUnits.forEach(u => classCount[u.unitData.unitClass]++);
        const dominantClass = Object.entries(classCount).sort(([,a],[,b]) => b-a)[0][0] as UnitClass;

        const counter: Record<UnitClass, UnitClass> = {
          attacker: 'speedster',
          speedster: 'defender',
          defender: 'healer',
          healer: 'attacker',
          balanced: 'attacker',
        };
        const preferredClass = counter[dominantClass];
        return affordable.find(u => u.unitClass === preferredClass) || affordable[0];
      }
    }
  }

  private selectPosition(unit: PixelUnit, battleUnits: BattleUnit[], playerCastle: Castle): Vec2 {
    const baseY = 60 + Math.random() * 40; // 敵城付近 y=60-100

    switch (this.difficulty) {
      case 'easy':
        return { x: 120 + Math.random() * 80, y: baseY }; // 中央付近ランダム

      case 'normal': {
        // プレイヤーユニットが多いx座標に寄せる
        const playerUnits = battleUnits.filter(u => u.owner === 'player' && u.state !== 'dead');
        if (playerUnits.length === 0) return { x: 160, y: baseY };
        const avgX = playerUnits.reduce((s, u) => s + u.position.x, 0) / playerUnits.length;
        return { x: avgX + (Math.random() - 0.5) * 40, y: baseY };
      }

      case 'hard': {
        // プレイヤーユニットの進路上に配置
        const playerUnits = battleUnits.filter(u => u.owner === 'player' && u.state !== 'dead');
        if (playerUnits.length === 0) return { x: 160, y: baseY };
        // 最もHPが高いプレイヤーユニットの前方に配置
        const strongest = playerUnits.sort((a, b) => b.currentHp - a.currentHp)[0];
        return {
          x: strongest.position.x + (Math.random() - 0.5) * 20,
          y: Math.max(50, strongest.position.y - 60),
        };
      }
    }
  }

  private getInitialDelay(): number {
    // 開戦直後のAI配置までの遅延（フレーム数）
    switch (this.difficulty) {
      case 'easy': return 180;   // 3秒
      case 'normal': return 120; // 2秒
      case 'hard': return 60;    // 1秒
    }
  }

  private getDeployInterval(): number {
    // 配置間隔（フレーム数）
    switch (this.difficulty) {
      case 'easy': return 300 + Math.floor(Math.random() * 180);   // 5-8秒
      case 'normal': return 180 + Math.floor(Math.random() * 120); // 3-5秒
      case 'hard': return 120 + Math.floor(Math.random() * 120);   // 2-4秒
    }
  }
}
```

### 4.6 メインゲームループ (`src/engine/GameEngine.ts`)

```typescript
/**
 * GameEngine: 60fpsのメインループ。全エンジンを統合。
 *
 * ループ処理順序（1フレームあたり）:
 * 1. マナ回復（プレイヤー＋AI）
 * 2. AI思考→ユニット配置
 * 3. ユニット移動（PhysicsEngine）
 * 4. 戦闘処理（CombatEngine）
 * 5. dying状態のユニットを15フレーム後にdead化
 * 6. パーティクル更新（ParticleSystem）
 * 7. リプレイフレーム記録（12フレームごと = 5fps）
 * 8. 勝敗判定
 * 9. 描画リクエスト（React stateを更新→Canvas再描画）
 */

export class GameEngine {
  private state: BattleState;
  private physics: PhysicsEngine;
  private combat: CombatEngine;
  private particles: ParticleSystem;
  private playerMana: ManaSystem;
  private enemyMana: ManaSystem;
  private ai: AIController;
  private replayFrames: ReplayFrame[] = [];
  private onStateChange: (state: BattleState) => void;
  private animFrameId: number | null = null;

  constructor(
    playerDeck: PixelUnit[],
    opponent: AIOpponent,
    onStateChange: (state: BattleState) => void,
  ) {
    this.physics = new PhysicsEngine();
    this.combat = new CombatEngine();
    this.particles = new ParticleSystem();
    this.playerMana = new ManaSystem();
    this.enemyMana = new ManaSystem();
    this.ai = new AIController(opponent);
    this.onStateChange = onStateChange;

    this.state = {
      phase: 'preparing',
      frameCount: 0,
      maxFrames: 10800, // 3分
      playerCastle: {
        owner: 'player', position: { x: 160, y: 536 },
        maxHp: 500, currentHp: 500, width: 32, height: 32,
      },
      enemyCastle: {
        owner: 'enemy', position: { x: 160, y: 32 },
        maxHp: opponent.castleHp, currentHp: opponent.castleHp, width: 32, height: 32,
      },
      playerMana: this.playerMana.getState(),
      enemyMana: this.enemyMana.getState(),
      units: [],
      particles: [],
      playerDeck,
      enemyDeck: opponent.deck,
      winner: null,
    };
  }

  start(): void {
    this.state.phase = 'battling';
    this.loop();
  }

  private loop = (): void => {
    if (this.state.phase !== 'battling') return;

    this.state.frameCount++;

    // 1. マナ回復
    this.playerMana.update(this.state.frameCount, this.state.maxFrames);
    this.enemyMana.update(this.state.frameCount, this.state.maxFrames);

    // 2. AI配置
    const aiAction = this.ai.update(
      this.state.frameCount,
      this.enemyMana.getState(),
      this.state.units,
      this.state.playerCastle,
      this.state.enemyCastle,
    );
    if (aiAction && this.enemyMana.spend(aiAction.unit.stats.manaCost)) {
      this.spawnUnit(aiAction.unit, 'enemy', aiAction.position);
    }

    // 3. 移動
    this.physics.updatePositions(this.state.units, this.state.playerCastle, this.state.enemyCastle);

    // 4. 戦闘
    this.combat.processCombat(
      this.state.units, this.state.playerCastle, this.state.enemyCastle, this.particles,
    );

    // 5. dying → dead（15フレーム後）
    for (const unit of this.state.units) {
      if (unit.state === 'dying') {
        const deathDuration = this.state.frameCount - (unit.spawnFrame + 999999);
        // spawnFrameではなく、dying開始フレームをトラックする必要あり
        // 簡易: currentHp <= 0 になった次の15フレーム後にdead
        // 実装: dyingFrameプロパティを追加して管理
      }
    }
    this.state.units = this.state.units.filter(u => u.state !== 'dead');

    // 6. パーティクル更新
    this.particles.update();

    // 7. リプレイ記録（12フレームごと = 5fps）
    if (this.state.frameCount % 12 === 0) {
      this.replayFrames.push(this.captureReplayFrame());
    }

    // 8. 勝敗判定
    if (this.state.enemyCastle.currentHp <= 0) {
      this.state.winner = 'player';
      this.state.phase = 'finished';
    } else if (this.state.playerCastle.currentHp <= 0) {
      this.state.winner = 'enemy';
      this.state.phase = 'finished';
    } else if (this.state.frameCount >= this.state.maxFrames) {
      // タイムアップ: 残HP比率で判定
      const playerRatio = this.state.playerCastle.currentHp / this.state.playerCastle.maxHp;
      const enemyRatio = this.state.enemyCastle.currentHp / this.state.enemyCastle.maxHp;
      this.state.winner = playerRatio > enemyRatio ? 'player' : enemyRatio > playerRatio ? 'enemy' : 'draw';
      this.state.phase = 'finished';
    }

    // 9. state更新
    this.state.playerMana = this.playerMana.getState();
    this.state.enemyMana = this.enemyMana.getState();
    this.state.particles = this.particles.getParticles();
    this.onStateChange({ ...this.state });

    if (this.state.phase === 'battling') {
      this.animFrameId = requestAnimationFrame(this.loop);
    }
  };

  /** プレイヤーがユニットを配置 */
  deployPlayerUnit(unitIndex: number, position: Vec2): boolean {
    const unit = this.state.playerDeck[unitIndex];
    if (!unit) return false;
    if (!this.playerMana.spend(unit.stats.manaCost)) return false;
    // 配置はy > 350（自陣側）のみ許可
    if (position.y < 350) return false;
    this.spawnUnit(unit, 'player', position);
    return true;
  }

  private spawnUnit(unitData: PixelUnit, owner: 'player' | 'enemy', position: Vec2): void {
    const battleUnit: BattleUnit = {
      instanceId: `bu_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      unitData,
      owner,
      position: { ...position },
      currentHp: unitData.stats.hp,
      state: 'moving',
      target: null,
      attackCooldown: 0,
      facing: owner === 'player' ? 'up' : 'down',
      spawnFrame: this.state.frameCount,
    };
    this.state.units.push(battleUnit);
    this.particles.spawnDeployParticles(position);
  }

  private captureReplayFrame(): ReplayFrame {
    return {
      frame: this.state.frameCount,
      units: this.state.units
        .filter(u => u.state !== 'dead')
        .map(u => ({
          instanceId: u.instanceId,
          x: Math.round(u.position.x),
          y: Math.round(u.position.y),
          hp: u.currentHp,
          state: u.state,
        })),
      playerCastleHp: this.state.playerCastle.currentHp,
      enemyCastleHp: this.state.enemyCastle.currentHp,
      particles: this.particles.getParticles().map(p => ({
        x: Math.round(p.position.x),
        y: Math.round(p.position.y),
        color: `rgba(${p.color.r},${p.color.g},${p.color.b},${p.life / p.maxLife})`,
      })),
    };
  }

  stop(): void {
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    this.state.phase = 'finished';
  }

  getReplayFrames(): ReplayFrame[] {
    return this.replayFrames;
  }
}
```

---

## 5. ドット絵エディタ仕様

### 5.1 3x3グリッドUI (`src/components/PixelGrid.tsx`)

**レイアウト**:
- グリッド全体サイズ: 240×240px（各セル80×80px）
- セル間の境界線: 1px の `#333333`
- 空セル: 市松模様（透明を示す標準パターン、明灰`#E0E0E0` + 暗灰`#C0C0C0`の8×8チェッカー）
- 塗られたセル: 対応色でベタ塗り
- 選択中のセルにはタップ後0.1秒の白フラッシュフィードバック

**操作**:
- タップ: 選択中の色でセルを塗る（既に同色なら透明に戻す=消しゴムと同動作）
- ドラッグ: 連続塗り（指を滑らせて複数セルを一気に塗る）
- ツールバー:
  - 消しゴムボタン: 選択中の色を「透明」に切り替え（a=0）
  - 全消去ボタン: 確認ダイアログ後に全セルを透明化
  - ランダムボタン: アンロック済み色からランダムに9セルを塗る

### 5.2 色パレット (`src/components/ColorPalette.tsx`)

**レイアウト**:
- 横スクロールの1行リスト
- 各色: 40×40px の正方形、角丸4px
- 選択中の色: 白ボーダー3px + scale(1.2)アニメーション
- ロック中の色: グレーオーバーレイ + 鍵アイコン。タップ時「ステージXをクリアで解放」のツールチップ

### 5.3 初期色パレット (6色)

| ID | 名前 | HEX | RGB | 用途 |
|---|---|---|---|---|
| `red-basic` | レッド | #FF0000 | 255,0,0 | 攻撃型の基本色 |
| `blue-basic` | ブルー | #0066FF | 0,102,255 | 防御型の基本色 |
| `green-basic` | グリーン | #00CC00 | 0,204,0 | 回復型の基本色 |
| `yellow-basic` | イエロー | #FFCC00 | 255,204,0 | 速攻型の基本色 |
| `white-basic` | ホワイト | #FFFFFF | 255,255,255 | バランス型/装飾 |
| `black-basic` | ブラック | #333333 | 51,51,51 | バランス型/装飾 |

### 5.4 アンロック色 (15色、ステージクリア報酬)

| ID | 名前 | HEX | 解放条件 | レアリティ |
|---|---|---|---|---|
| `lime-green` | ライムグリーン | #66FF00 | ステージ1クリア | common |
| `crimson` | クリムゾン | #DC143C | ステージ2クリア | common |
| `sky-blue` | スカイブルー | #00BFFF | ステージ3クリア | common |
| `orange` | オレンジ | #FF8800 | ステージ4クリア | common |
| `purple` | パープル | #9900FF | ステージ5クリア | uncommon |
| `pink` | ピンク | #FF66B2 | ステージ6クリア | uncommon |
| `teal` | ティール | #008080 | ステージ7クリア | uncommon |
| `gold` | ゴールド | #FFD700 | ステージ8クリア | uncommon |
| `neon-green` | ネオングリーン | #39FF14 | ステージ9クリア | rare |
| `neon-pink` | ネオンピンク | #FF1493 | ステージ10クリア | rare |
| `ice-blue` | アイスブルー | #7DF9FF | ステージ11クリア | rare |
| `blood-red` | ブラッドレッド | #8B0000 | ステージ12クリア | rare |
| `royal-purple` | ロイヤルパープル | #4B0082 | ステージ13クリア | legendary |
| `chromatic` | クロマティック | (虹色アニメ) | ステージ14クリア | legendary |
| `void-black` | ヴォイドブラック | #0A0A0A (微細パーティクル付) | ステージ15クリア | legendary |

### 5.5 プリセットユニット5体 (`src/constants/presets.ts`)

最初から所持。エディタの参考例としても表示。

#### 1. レッドファイター（赤鬼）
```
Grid:
  [RED,  RED,  RED ]
  [RED,  RED,  RED ]
  [BLK,  RED,  BLK ]
→ rRatio≈0.87, bRatio≈0.0 → attacker
Stats: HP=80, ATK=24, DEF=3, SPD=2.5, ASPD=20, RANGE=20, COST=5
```

#### 2. ブルーシールド（盾兵）
```
Grid:
  [BLU,  BLU,  BLU ]
  [BLU,  WHT,  BLU ]
  [BLU,  BLU,  BLU ]
→ bRatio≈0.83 → defender
Stats: HP=160, ATK=8, DEF=18, SPD=1.2, ASPD=45, RANGE=20, COST=4
```

#### 3. グリーンクロス（回復僧）
```
Grid:
  [___,  GRN,  ___ ]
  [GRN,  GRN,  GRN ]
  [___,  GRN,  ___ ]
→ gRatio≈1.0 → healer
Stats: HP=120, ATK=10(heal5), DEF=10, SPD=1.5, ASPD=40, RANGE=60, COST=5
```

#### 4. イエローボルト（疾風）
```
Grid:
  [___,  YLW,  ___ ]
  [YLW,  YLW,  YLW ]
  [YLW,  ___,  YLW ]
→ yRatio高 → speedster
Stats: HP=70, ATK=15, DEF=4, SPD=3.8, ASPD=18, RANGE=20, COST=3
```

#### 5. グレーソルジャー（万能兵）
```
Grid:
  [WHT,  BLK,  WHT ]
  [BLK,  WHT,  BLK ]
  [WHT,  BLK,  WHT ]
→ 均等 → balanced
Stats: HP=100, ATK=15, DEF=8, SPD=2.0, ASPD=30, RANGE=30, COST=4
```

---

## 6. 収益化設計

### 6.1 AdMob広告

| 広告タイプ | 配置箇所 | 表示タイミング | 広告ユニットID接頭辞 |
|---|---|---|---|
| バナー (320×50) | ホーム画面下部 | 常時表示 | `ca-app-pub-xxx/banner_home` |
| インタースティシャル | バトル結果画面 | 3戦に1回（敗北時のみ） | `ca-app-pub-xxx/interstitial_result` |
| リワード動画 | バトル結果画面「報酬2倍」ボタン | プレイヤーが任意タップ | `ca-app-pub-xxx/reward_double` |
| リワード動画 | ショップ「広告でジェム獲得」 | プレイヤーが任意タップ（1日5回） | `ca-app-pub-xxx/reward_gem` |

**広告ポリシー**:
- 広告非表示課金（¥480買い切り）購入者にはバナー＋インタースティシャルを非表示
- リワード広告は広告非表示購入者でも利用可能（メリットがあるため）
- 初回チュートリアル中は一切広告を表示しない
- インタースティシャル表示間隔: 最低90秒空ける

### 6.2 アプリ内課金（IAP）

| 商品ID | 名前 | 価格 | 内容 | タイプ |
|---|---|---|---|---|
| `gems_80` | ジェム80個 | ¥160 | 💎80 | 消耗品 |
| `gems_200` | ジェム200個 | ¥370 | 💎200 (+20ボーナス) | 消耗品 |
| `gems_500` | ジェム500個 | ¥860 | 💎500 (+50ボーナス) | 消耗品 |
| `gems_1200` | ジェム1200個 | ¥1,840 | 💎1200 (+200ボーナス) | 消耗品 |
| `remove_ads` | 広告非表示 | ¥480 | バナー＋インタースティシャル非表示 | 非消耗品 |
| `starter_pack` | スターターパック | ¥320 | 💎100 + ネオンピンク色 + ユニット枠+10 | 非消耗品 |

### 6.3 ゲーム内経済

| 通貨 | 入手手段 | 消費先 |
|---|---|---|
| コイン | バトル勝利(100-200), デイリーログイン(50), 実績達成 | ユニット枠拡張(500), デッキ枠拡張(300), カラーパック(コイン版) |
| ジェム | 課金, リワード広告(5/回), 実績達成(レア) | プレミアムカラーパック(50-100), スキン(将来), 即時マナ回復(バトル中・3ジェム) |

**バランス方針**:
- 無課金でも全ステージクリア可能（全色アンロック可能）
- 課金メリットはカラーパックの早期入手＋広告非表示のQoL向上
- Pay-to-Win要素なし（課金で強くならない。色が変わるだけでステータスは同じ計算式）

---

## 7. アプリ特有機能

### 7.1 ハプティクスフィードバック (`src/hooks/useHaptics.ts`)

```typescript
import * as Haptics from 'expo-haptics';

export const HAPTIC_PATTERNS = {
  /** ユニット配置時: 軽い「ポン」 */
  deploy: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),

  /** ヒット時: 軽い衝撃 */
  hit: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),

  /** ユニット撃破時: やや強い衝撃 */
  unitDestroy: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),

  /** 城被弾時: 連続振動 */
  castleHit: async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    await new Promise(r => setTimeout(r, 50));
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  },

  /** 勝利時: 成功通知 */
  victory: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),

  /** 敗北時: エラー通知 */
  defeat: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),

  /** 色塗り時: 選択フィードバック */
  paint: () => Haptics.selectionAsync(),

  /** 新色アンロック時: 成功通知 */
  unlock: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
};
```

### 7.2 プッシュ通知

| 通知タイプ | タイミング | テキスト例 | 条件 |
|---|---|---|---|
| デイリーリマインダー | 毎日19:00 | "今日のチャレンジが待ってるよ！🎮" | 24時間未プレイ |
| 連勝中リマインダー | 翌日12:00 | "3連勝中！記録を伸ばそう⚔️" | 連勝中かつ未プレイ |
| 新ステージ解放 | ステージクリア直後 | "新ステージ解放！次の敵はもっと手強い..." | ステージクリア時 |

通知設定は `settings.tsx` でON/OFF可能。初回起動3日後に初めて通知許可ダイアログを表示（即表示しない）。

### 7.3 Game Center / Google Play Games

| 機能 | 実装内容 |
|---|---|
| リーダーボード | 「通算勝利数」「最大連勝」「総ユニット作成数」の3つ |
| 実績 | Achievement一覧（後述）を同期 |
| 保存データ同期 | Game Center経由でiCloudバックアップ（将来実装） |

### 7.4 サウンド管理 (`src/hooks/useSound.ts`)

```typescript
import { Audio } from 'expo-av';

/** サウンドアセットのプリロード（ホーム画面マウント時に一括ロード） */
const SOUNDS = {
  deploy: require('../../assets/sounds/deploy.mp3'),
  hit: require('../../assets/sounds/hit.mp3'),
  destroy: require('../../assets/sounds/destroy.mp3'),
  victory: require('../../assets/sounds/victory.mp3'),
  defeat: require('../../assets/sounds/defeat.mp3'),
  manaReady: require('../../assets/sounds/mana-ready.mp3'),
  unlock: require('../../assets/sounds/unlock.mp3'),
};

/**
 * 使い方:
 * const { play } = useSound();
 * play('hit'); // ヒット音を再生
 *
 * バトル中は頻繁に呼ばれるため、同じサウンドの同時再生は最大3つまで
 * （4つ目の再生リクエストは無視）
 */
```

---

## 8. データ永続化

### 8.1 AsyncStorageキー設計

| キー | 型 | 説明 | サイズ目安 |
|---|---|---|---|
| `@pixel_siege/player_data` | `PlayerData` (JSON) | プレイヤー全データ | ~50KB |
| `@pixel_siege/replay_latest` | `ReplayFrame[]` (JSON) | 直近1戦のリプレイ | ~100KB |
| `@pixel_siege/settings` | `GameSettings` (JSON) | 設定（高速アクセス用に分離） | ~200B |
| `@pixel_siege/schema_version` | `number` | データスキーマバージョン | 4B |
| `@pixel_siege/tutorial_step` | `number` | チュートリアル進行度 (0=未開始, 5=完了) | 4B |
| `@pixel_siege/daily_challenge` | `{ date: string, completed: boolean, reward_claimed: boolean }` | 日替わりチャレンジ状態 | ~100B |
| `@pixel_siege/iap_purchases` | `string[]` | 購入済み商品IDリスト（復元用） | ~200B |
| `@pixel_siege/ad_state` | `{ watchedToday: number, lastDate: string, removeAdsPurchased: boolean }` | 広告状態 | ~100B |

### 8.2 データマイグレーション

```typescript
/**
 * スキーマバージョン管理:
 *   v1: 初期リリース
 *   v2: (将来) ユニットにスキンフィールド追加
 *
 * アプリ起動時にschema_versionを確認し、
 * 現在のバージョンより古ければマイグレーション関数を順次実行。
 */
const CURRENT_SCHEMA = 1;

async function migrateIfNeeded(): Promise<void> {
  const stored = await AsyncStorage.getItem('@pixel_siege/schema_version');
  const version = stored ? parseInt(stored, 10) : 0;

  if (version < 1) {
    // v0 → v1: 初回起動。デフォルトデータを生成
    await initializeDefaultPlayerData();
  }
  // if (version < 2) { migrate_v1_to_v2(); }

  await AsyncStorage.setItem('@pixel_siege/schema_version', String(CURRENT_SCHEMA));
}
```

### 8.3 保存タイミング

| イベント | 保存対象 |
|---|---|
| ユニット作成/削除 | `player_data` (inventory.units) |
| デッキ変更 | `player_data` (inventory.decks) |
| バトル終了 | `player_data` (progress, stats, inventory.coins), `replay_latest` |
| 設定変更 | `settings` |
| 課金完了 | `iap_purchases`, `player_data` (inventory.gems) |
| アプリバックグラウンド移行 | `player_data` (全体) |

---

## 9. シェア機能

### 9.1 ドット絵シェア

**トリガー**: ユニット詳細画面の「シェア」ボタン

**生成画像仕様**:
- サイズ: 1080×1080px（Instagram最適）
- 背景: ダークグレー `#1A1A2E` にドット絵風グリッドパターン
- 中央: ユニットの3×3を拡大描画（各ピクセル200×200px → 600×600px）
- 下部: ユニット名 + 兵種 + ステータスバー
- 右下: アプリロゴ + "PIXEL SIEGE" テキスト

**実装**:
```typescript
// expo-image-manipulator でCanvas描画 → PNG生成 → expo-sharing
import * as ImageManipulator from 'expo-image-manipulator';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

async function shareUnitImage(unit: PixelUnit): Promise<void> {
  // 1. Canvas APIで1080×1080の画像をオフスクリーン描画
  // 2. toDataURL() → base64
  // 3. FileSystem.writeAsStringAsync() で一時ファイルに保存
  // 4. Sharing.shareAsync(fileUri)
  const uri = `${FileSystem.cacheDirectory}unit_${unit.id}.png`;
  // ... Canvas描画処理 ...
  await Sharing.shareAsync(uri, {
    mimeType: 'image/png',
    dialogTitle: 'ユニットをシェア',
    UTI: 'public.png',
  });
}
```

### 9.2 対戦リプレイGIF

**トリガー**: バトル結果画面の「リプレイをシェア」ボタン

**GIF仕様**:
- サイズ: 320×320px（正方形にクロップ。フィールド中央部分）
- フレームレート: 10fps
- 最大長さ: 10秒（ラスト10秒をキャプチャ）
- 色数: 128色（GIF制約）
- ファイルサイズ目安: 1-3MB

**実装**:
```typescript
import { GIFEncoder, quantize, applyPalette } from 'gifenc';

async function generateReplayGif(frames: ReplayFrame[]): Promise<string> {
  // 1. 直近600フレーム（10秒@60fps）を取得
  // 2. 6フレームごとにサンプリング（=10fps）→ 100フレーム
  // 3. 各フレームを320×320のピクセルデータに描画
  //    - 背景色ベタ
  //    - ユニット位置に3×3ドット絵を拡大描画（各セル4×4px）
  //    - パーティクルを描画
  //    - 城HPバーを上下に描画
  // 4. gifencでエンコード
  // 5. FileSystem.writeAsStringAsync() で一時ファイルに保存
  const uri = `${FileSystem.cacheDirectory}replay_${Date.now()}.gif`;
  // ... GIF生成処理 ...
  return uri;
}
```

### 9.3 勝利スクリーンショット

**トリガー**: バトル結果画面（勝利時のみ自動生成）

**画像仕様**:
- サイズ: 1200×630px（OGP最適）
- 内容: 「VICTORY!」テキスト + 使用ユニット3体の拡大表示 + 戦績要約
- テンプレート: ダークブルー背景 + ゴールドアクセント

---

## 10. 初期コンテンツ

### 10.1 AI対戦相手15体 (`src/constants/ai-opponents.ts`)

#### ステージ1-5: 初陣の荒野（Easy）

| # | 名前 | 兵種構成 | 城HP | 報酬色 | 説明 |
|---|---|---|---|---|---|
| 1 | ドットスライム | balanced×3 | 300 | lime-green | のんびり進軍。チュートリアル相手 |
| 2 | レッドナイト | attacker×2 + balanced×1 | 350 | crimson | 攻撃偏重。防御で耐えれば勝てる |
| 3 | ブルーウォール | defender×3 | 400 | sky-blue | 硬いが攻撃力がない。時間切れ注意 |
| 4 | グリーンモンク | healer×2 + defender×1 | 350 | orange | 回復持ち。集中攻撃で倒せ |
| 5 | イエローラッシュ | speedster×3 | 300 | purple | 高速で次々来る。壁役が重要 |

#### ステージ6-10: 戦場の峡谷（Normal）

| # | 名前 | 兵種構成 | 城HP | 報酬色 | 説明 |
|---|---|---|---|---|---|
| 6 | ファイアロード | attacker×2 + speedster×1 | 450 | pink | 火力と速度の両立。回復で対抗 |
| 7 | アイスガード | defender×2 + healer×1 | 500 | teal | 鉄壁＋回復。長期戦は不利 |
| 8 | サンダーストーム | speedster×2 + attacker×1 | 400 | gold | 開幕ラッシュ。序盤を凌げば勝ち |
| 9 | ダークプリースト | healer×2 + attacker×1 | 500 | neon-green | 回復しながら攻め。相性有利で押せ |
| 10 | カオスナイト | attacker+defender+speedster | 550 | neon-pink | バランス型。読みが重要 |

#### ステージ11-15: 深淵の要塞（Hard）

| # | 名前 | 兵種構成 | 城HP | 報酬色 | 説明 |
|---|---|---|---|---|---|
| 11 | ブラッドキング | attacker×3（高ステータス） | 600 | ice-blue | 超火力。防御型で受けきれ |
| 12 | フロストエンペラー | defender×2 + healer×1（高ステータス） | 700 | blood-red | 鉄壁中の鉄壁。速攻型で殴り合え |
| 13 | ストームロード | speedster×3（高ステータス） | 550 | royal-purple | 超高速ラッシュ。壁3体で凌げ |
| 14 | エターナルセイジ | healer×3（高ステータス） | 650 | chromatic | 回復地獄。火力集中で削り切れ |
| 15 | ピクセルゴッド | 全兵種1+balanced×1（最高ステータス） | 800 | void-black | 最終ボス。デッキ構成と配置タイミングが全て |

### 10.2 実績30個 (`src/constants/achievements.ts`)

#### 戦闘系 (10個)

| ID | 名前 | 条件 | 報酬 |
|---|---|---|---|
| `first_blood` | ファーストブラッド | 初めてバトルに勝利 | 🪙100 |
| `win_10` | 十戦錬磨 | 累計10勝 | 🪙300 |
| `win_50` | 半百の勇者 | 累計50勝 | 💎20 |
| `win_100` | 百戦百勝...？ | 累計100勝 | 💎50 |
| `streak_3` | トリプルキル | 3連勝 | 🪙200 |
| `streak_10` | アンストッパブル | 10連勝 | 💎30 |
| `no_damage_win` | パーフェクトゲーム | 城ノーダメージで勝利 | 💎10 |
| `clutch_win` | 逆転勝利 | 城HP10%以下から勝利 | 💎15 |
| `speed_win` | 電光石火 | 30秒以内に勝利 | 💎10 |
| `all_stages` | 全制覇 | 全15ステージクリア | 💎100 |

#### 制作系 (10個)

| ID | 名前 | 条件 | 報酬 |
|---|---|---|---|
| `first_unit` | はじめてのユニット | ユニットを1体作成 | 🪙50 |
| `create_5` | ドットアーティスト | ユニットを5体作成 | 🪙200 |
| `create_20` | ピクセルマスター | ユニットを20体作成 | 💎15 |
| `all_red` | 赤の信念 | 全セル赤のユニットを作成 | 🪙100 |
| `all_blue` | 青の誓い | 全セル青のユニットを作成 | 🪙100 |
| `rainbow_unit` | レインボー | 1体に6色以上使用 | 🪙150 |
| `monochrome` | モノクローム | 白と黒だけのユニットを作成 | 🪙100 |
| `full_grid` | ノー・スペース | 9セル全て塗ったユニットを作成 | 🪙100 |
| `minimalist` | ミニマリスト | 1セルだけ塗ったユニットで勝利 | 💎20 |
| `all_classes` | 全兵種コンプ | 全5兵種のユニットを各1体以上所持 | 💎25 |

#### コレクション系 (10個)

| ID | 名前 | 条件 | 報酬 |
|---|---|---|---|
| `unlock_5_colors` | カラーコレクター | 色を5色アンロック | 🪙200 |
| `unlock_10_colors` | パレットマスター | 色を10色アンロック | 💎15 |
| `unlock_all_colors` | フルスペクトラム | 全21色アンロック | 💎50 |
| `earn_1000_coins` | 千金の将 | コイン累計1,000枚獲得 | 🪙100 |
| `earn_10000_coins` | 万金の覇者 | コイン累計10,000枚獲得 | 💎20 |
| `50_battles` | ベテラン | 累計50戦 | 🪙300 |
| `100_particles` | パーティクルマニア | 累計パーティクル1,000個生成 | 🪙100 |
| `share_first` | ソーシャルウォリアー | 初めてシェア | 💎5 |
| `daily_5` | 毎日が戦場 | デイリーチャレンジ5回達成 | 💎10 |
| `daily_30` | 皆勤賞 | デイリーチャレンジ30回達成 | 💎50 |

### 10.3 チュートリアルフロー

```
ステップ0: スプラッシュ → ロゴアニメーション（1.5秒）
ステップ1: 名前入力画面（スキップ不可）
ステップ2: エディタ画面に遷移。ハイライト表示で誘導:
  「好きな色を選んで、マスを塗ってみよう！」
  → パレットの赤をハイライト → グリッド中央をハイライト
  → 3セル以上塗ったら「保存」ボタンをハイライト
ステップ3: 「ユニットが完成！さっそく戦ってみよう」
  → プリセットユニット2体 + 自作ユニット1体でデッキ自動編成
  → ステージ1（ドットスライム）に自動遷移
ステップ4: バトル画面で操作説明:
  「下のユニットをタップ → フィールドをタップで配置！」
  → マナゲージの説明
  → 勝利まで誘導（ドットスライムは非常に弱いので確実に勝てる）
ステップ5: 勝利画面:
  「おめでとう！新しい色を手に入れた！もっと強いユニットを作ろう」
  → tutorial_step = 5 に設定 → 以降通常プレイ
```

### 10.4 デイリーチャレンジ

```typescript
/**
 * 日替わりの特殊ルールバトル。毎日0:00 JSTにリセット。
 *
 * ルール種類（日付のハッシュで決定）:
 * 1. マナ2倍: 回復速度2倍
 * 2. ガラスキャノン: 全ユニットATK2倍・HP半分
 * 3. 亀モード: 全ユニットDEF2倍・SPD半分
 * 4. カオスモード: ユニット配置がランダム位置
 * 5. エコノミー: マナコスト半分（端数切上げ）
 * 6. ミラーマッチ: 敵が自分と同じデッキを使用
 * 7. ボスラッシュ: 敵城HP1000、自城HP300
 *
 * 報酬: 勝利で🪙200 + ランダムアンロック色（未解放があれば）
 * 敗北でも🪙50
 */

function getDailyChallengeType(dateString: string): number {
  // 日付文字列のハッシュから1-7を決定
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    hash = ((hash << 5) - hash) + dateString.charCodeAt(i);
    hash |= 0;
  }
  return (Math.abs(hash) % 7) + 1;
}
```

### 10.5 ゲームバランス数値まとめ (`src/constants/balance.ts`)

```typescript
export const BALANCE = {
  // フィールド
  FIELD_WIDTH: 320,
  FIELD_HEIGHT: 568,

  // マナ
  INITIAL_MANA: 5.0,
  MAX_MANA: 10.0,
  MANA_REGEN_PER_SECOND: 0.6,
  OVERTIME_MANA_REGEN_PER_SECOND: 0.9,
  OVERTIME_THRESHOLD_SECONDS: 60,

  // バトル
  BATTLE_DURATION_SECONDS: 180,
  FPS: 60,
  DEPLOY_COOLDOWN_FRAMES: 180, // 同じユニットの再配置クールダウン（3秒）
  DEPLOY_ZONE_MIN_Y: 350,     // プレイヤー配置可能エリアの上端

  // ユニット
  UNIT_RADIUS: 8,
  UNIT_DETECTION_RANGE_MULTIPLIER: 3, // 射程の3倍以内で索敵

  // 城
  PLAYER_CASTLE_HP: 500,
  CASTLE_DEFENSE: 3,
  CASTLE_WIDTH: 32,
  CASTLE_HEIGHT: 32,

  // パーティクル
  MAX_PARTICLES: 200,
  HIT_PARTICLE_LIFE: 15,
  DEATH_PARTICLE_LIFE: 30,
  CASTLE_HIT_PARTICLE_LIFE: 20,
  DEPLOY_PARTICLE_LIFE: 10,

  // ステータス範囲
  STATS: {
    HP: { min: 50, max: 200 },
    ATTACK: { min: 5, max: 30 },
    DEFENSE: { min: 1, max: 20 },
    SPEED: { min: 1.0, max: 4.0 },
    ATTACK_SPEED: { min: 15, max: 60 },
    RANGE: { min: 20, max: 80 },
    MANA_COST: { min: 2, max: 8 },
  },

  // 兵種相性ダメージ倍率
  TYPE_ADVANTAGE_MULTIPLIER: 1.3,

  // ヒーラー
  HEALER_HEAL_RATIO: 0.5,    // ATK値のX倍を回復
  HEALER_DAMAGE_RATIO: 0.3,  // ATK値のX倍のダメージ

  // 経済
  WIN_COINS: { min: 100, max: 200 },
  LOSS_COINS: 30,
  DAILY_CHALLENGE_WIN_COINS: 200,
  DAILY_CHALLENGE_LOSS_COINS: 50,
  UNIT_SLOT_COST: 500,
  DECK_SLOT_COST: 300,

  // 制限
  MAX_UNITS_IN_INVENTORY: 50,
  MAX_DECKS: 5,
  MAX_ADS_PER_DAY: 5,
  UNIT_NAME_MAX_LENGTH: 8,
  PLAYER_NAME_MAX_LENGTH: 8,

  // リプレイ
  REPLAY_SAMPLE_INTERVAL: 12,  // 12フレームごと = 5fps
  REPLAY_GIF_FPS: 10,
  REPLAY_GIF_DURATION_SECONDS: 10,
  REPLAY_GIF_SIZE: 320,

  // 広告
  INTERSTITIAL_MIN_INTERVAL_SECONDS: 90,
  INTERSTITIAL_SHOW_EVERY_N_LOSSES: 3,
};
```

---

## 付録A: 描画仕様（BattleCanvas）

### Canvas描画レイヤー（下から順に描画）

1. **背景**: `battle-bg.png`（ドット絵風草原テクスチャ 320×568）
2. **グリッド線**: 32px間隔の薄灰色ライン（α=0.1）。戦場の奥行き感を出す
3. **城**: `castle-player.png` / `castle-enemy.png`（各32×32px）。被弾時は0.1秒間赤フラッシュ
4. **ユニット**: 3×3ピクセルを拡大描画。各セル4×4px → ユニット全体12×12px。facing=upなら通常、downなら上下反転
5. **HPバー**: ユニットの上に2px高の緑→黄→赤のグラデーションバー（HPに応じて色変化）
6. **パーティクル**: 各パーティクルをsize×sizeの正方形で描画。α = life/maxLife（フェードアウト）
7. **UI オーバーレイ**: HPバー（城）、マナバー、残り時間。React Nativeの `<View>` で重ねて描画（Canvasではない）

### 描画パフォーマンス目標

- 60fps維持（最低30fps保証）
- 同時ユニット数上限: 30体（15 vs 15）
- パーティクル上限: 200個
- expo-gl (WebGL) でバッチ描画。1フレームのdraw call上限: 50

---

## 付録B: エラーハンドリング

| 状況 | 対処 |
|---|---|
| AsyncStorage読み込み失敗 | デフォルトデータで初期化。トースト「データの読み込みに失敗しました」 |
| AsyncStorage書き込み失敗 | 3回リトライ（500ms間隔）。失敗時はメモリに保持し次回起動時に再保存試行 |
| AdMob読み込み失敗 | 広告枠を非表示にする（エラーUIは出さない） |
| IAP購入処理エラー | アラート表示「購入処理に問題が発生しました。時間をおいて再度お試しください」 |
| Game Center接続失敗 | サイレントフェイル（ゲーム自体に影響なし） |
| フレームレート低下 (<30fps) | パーティクル上限を100に自動削減、グリッド線描画をスキップ |

---

## 付録C: 将来拡張メモ（v2.0以降）

- **オンライン対戦**: WebSocket / Firebase Realtime Database
- **ユニットスキン**: 3×3の枠自体を変更（丸型、ダイヤ型）
- **5×5グリッド拡張**: 上位ユニットは5×5で作成可能（コスト高）
- **クラン機能**: クランバトル（3vs3チーム戦）
- **シーズン制**: 月間ランキング＋シーズン報酬
- **カスタムBGM**: ステージごとにBGM変更

---

*このドキュメントに記載された仕様に従って実装すれば、追加の質問なしに完全なゲームが構築可能です。*
