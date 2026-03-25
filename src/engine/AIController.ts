import { BattleUnit, Castle, ManaState, Vec2, AIOpponent } from '../types/battle';
import { PixelUnit, UnitClass } from '../types/unit';

export class AIController {
  private difficulty: 'easy' | 'normal' | 'hard';
  private nextDeployFrame: number;
  private deck: PixelUnit[];

  constructor(opponent: AIOpponent) {
    this.difficulty = opponent.difficulty;
    this.deck = opponent.deck;
    this.nextDeployFrame = this.getInitialDelay();
  }

  update(
    frameCount: number,
    enemyMana: ManaState,
    battleUnits: BattleUnit[],
    playerCastle: Castle,
    _enemyCastle: Castle,
  ): { unit: PixelUnit; position: Vec2 } | null {
    if (frameCount < this.nextDeployFrame) return null;

    const selectedUnit = this.selectUnit(enemyMana, battleUnits);
    if (!selectedUnit) return null;
    if (enemyMana.current < selectedUnit.stats.manaCost) return null;

    const position = this.selectPosition(selectedUnit, battleUnits, playerCastle);
    this.nextDeployFrame = frameCount + this.getDeployInterval();

    return { unit: selectedUnit, position };
  }

  private selectUnit(mana: ManaState, battleUnits: BattleUnit[]): PixelUnit | null {
    const affordable = this.deck.filter(u => u.stats.manaCost <= mana.current);
    if (affordable.length === 0) return null;

    switch (this.difficulty) {
      case 'easy':
        return affordable[Math.floor(Math.random() * affordable.length)];

      case 'normal':
        return affordable.sort((a, b) =>
          (b.stats.attack / b.stats.manaCost) - (a.stats.attack / a.stats.manaCost)
        )[0];

      case 'hard': {
        const playerUnits = battleUnits.filter(u => u.owner === 'player' && u.state !== 'dead');
        if (playerUnits.length === 0) {
          return affordable.find(u => u.unitClass === 'attacker') || affordable[0];
        }
        const classCount: Record<UnitClass, number> = {
          attacker: 0, defender: 0, healer: 0, speedster: 0, balanced: 0,
        };
        playerUnits.forEach(u => classCount[u.unitData.unitClass]++);
        const dominantClass = (Object.entries(classCount).sort(([, a], [, b]) => b - a)[0][0]) as UnitClass;

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
    const baseY = 60 + Math.random() * 40;

    switch (this.difficulty) {
      case 'easy':
        return { x: 120 + Math.random() * 80, y: baseY };

      case 'normal': {
        const playerUnits = battleUnits.filter(u => u.owner === 'player' && u.state !== 'dead');
        if (playerUnits.length === 0) return { x: 160, y: baseY };
        const avgX = playerUnits.reduce((s, u) => s + u.position.x, 0) / playerUnits.length;
        return { x: avgX + (Math.random() - 0.5) * 40, y: baseY };
      }

      case 'hard': {
        const playerUnits = battleUnits.filter(u => u.owner === 'player' && u.state !== 'dead');
        if (playerUnits.length === 0) return { x: 160, y: baseY };
        const strongest = playerUnits.sort((a, b) => b.currentHp - a.currentHp)[0];
        return {
          x: strongest.position.x + (Math.random() - 0.5) * 20,
          y: Math.max(50, strongest.position.y - 60),
        };
      }
    }
  }

  private getInitialDelay(): number {
    switch (this.difficulty) {
      case 'easy': return 180;
      case 'normal': return 120;
      case 'hard': return 60;
    }
  }

  private getDeployInterval(): number {
    switch (this.difficulty) {
      case 'easy': return 300 + Math.floor(Math.random() * 180);
      case 'normal': return 180 + Math.floor(Math.random() * 120);
      case 'hard': return 120 + Math.floor(Math.random() * 120);
    }
  }
}
