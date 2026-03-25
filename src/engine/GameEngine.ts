import { BattleState, BattleUnit, ReplayFrame, AIOpponent, Vec2 } from '../types/battle';
import { PixelUnit } from '../types/unit';
import { PhysicsEngine } from './PhysicsEngine';
import { CombatEngine } from './CombatEngine';
import { ParticleSystem } from './ParticleSystem';
import { ManaSystem } from './ManaSystem';
import { AIController } from './AIController';

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
  private speedMultiplier: number = 1;
  private totalDamageDealt: number = 0;
  private totalDamageReceived: number = 0;
  private unitsDeployed: number = 0;
  private unitsLost: number = 0;

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
      maxFrames: 10800,
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

  setSpeed(multiplier: number): void {
    this.speedMultiplier = multiplier;
  }

  private loop = (): void => {
    if (this.state.phase !== 'battling') return;

    const steps = Math.round(this.speedMultiplier);
    for (let s = 0; s < steps; s++) {
      this.tick();
      if (this.state.phase !== 'battling') break;
    }

    this.state.playerMana = this.playerMana.getState();
    this.state.enemyMana = this.enemyMana.getState();
    this.state.particles = this.particles.getParticles();
    this.onStateChange({ ...this.state });

    if (this.state.phase === 'battling') {
      this.animFrameId = requestAnimationFrame(this.loop);
    }
  };

  private tick(): void {
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

    // Track castle HP before combat for damage tracking
    const prevPlayerCastleHp = this.state.playerCastle.currentHp;
    const prevEnemyCastleHp = this.state.enemyCastle.currentHp;

    // 4. 戦闘
    this.combat.processCombat(
      this.state.units, this.state.playerCastle, this.state.enemyCastle, this.particles,
    );

    // Track damage
    if (this.state.enemyCastle.currentHp < prevEnemyCastleHp) {
      this.totalDamageDealt += prevEnemyCastleHp - this.state.enemyCastle.currentHp;
    }
    if (this.state.playerCastle.currentHp < prevPlayerCastleHp) {
      this.totalDamageReceived += prevPlayerCastleHp - this.state.playerCastle.currentHp;
    }

    // 5. dying -> dead (15フレーム後)
    for (const unit of this.state.units) {
      if (unit.state === 'dying') {
        if (!unit.dyingFrame) {
          unit.dyingFrame = this.state.frameCount;
        }
        if (this.state.frameCount - unit.dyingFrame >= 15) {
          unit.state = 'dead';
          if (unit.owner === 'player') {
            this.unitsLost++;
          }
        }
      }
    }
    this.state.units = this.state.units.filter(u => u.state !== 'dead');

    // 6. パーティクル更新
    this.particles.update();

    // 7. リプレイ記録
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
      const playerRatio = this.state.playerCastle.currentHp / this.state.playerCastle.maxHp;
      const enemyRatio = this.state.enemyCastle.currentHp / this.state.enemyCastle.maxHp;
      this.state.winner = playerRatio > enemyRatio ? 'player' : enemyRatio > playerRatio ? 'enemy' : 'draw';
      this.state.phase = 'finished';
    }
  }

  deployPlayerUnit(unitIndex: number, position: Vec2): boolean {
    const unit = this.state.playerDeck[unitIndex];
    if (!unit) return false;
    if (!this.playerMana.spend(unit.stats.manaCost)) return false;
    if (position.y < 350) return false;
    this.spawnUnit(unit, 'player', position);
    this.unitsDeployed++;
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

  getState(): BattleState {
    return this.state;
  }

  getBattleStats() {
    return {
      totalDamageDealt: this.totalDamageDealt,
      totalDamageReceived: this.totalDamageReceived,
      unitsDeployed: this.unitsDeployed,
      unitsLost: this.unitsLost,
    };
  }
}
