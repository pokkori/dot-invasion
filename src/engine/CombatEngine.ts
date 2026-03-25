import { BattleUnit, Castle } from '../types/battle';
import { UnitClass } from '../types/unit';
import { ParticleSystem } from './ParticleSystem';

export class CombatEngine {
  private readonly TYPE_ADVANTAGE: Record<UnitClass, UnitClass> = {
    attacker: 'healer',
    healer: 'defender',
    defender: 'speedster',
    speedster: 'attacker',
    balanced: 'balanced',
  };

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

      unit.attackCooldown = unit.unitData.stats.attackSpeed;

      if (unit.unitData.unitClass === 'healer') {
        this.healAlly(unit, units);
      }

      if (unit.target) {
        const target = units.find(u => u.instanceId === unit.target);
        if (target && target.state !== 'dead') {
          const damage = this.calculateDamage(unit, target);
          target.currentHp -= damage;

          particleSystem.spawnHitParticles(target.position, target.unitData.grid, damage);

          if (target.currentHp <= 0) {
            target.state = 'dying';
            target.currentHp = 0;
            particleSystem.spawnDeathParticles(target.position, target.unitData.grid);
          }
        }
      } else {
        const targetCastle = unit.owner === 'player' ? enemyCastle : playerCastle;
        const damage = Math.max(1, unit.unitData.stats.attack - 3);
        targetCastle.currentHp -= damage;
        particleSystem.spawnCastleHitParticles(targetCastle.position, damage);
      }
    }
  }

  private calculateDamage(attacker: BattleUnit, defender: BattleUnit): number {
    const atk = attacker.unitData.stats.attack;
    const def = defender.unitData.stats.defense;
    let baseDamage = Math.max(1, atk - def * 0.5);

    if (this.TYPE_ADVANTAGE[attacker.unitData.unitClass] === defender.unitData.unitClass) {
      baseDamage *= 1.3;
    }

    if (attacker.unitData.unitClass === 'healer') {
      baseDamage *= 0.3;
    }

    const variance = Math.floor(Math.random() * 5) - 2;
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

    const target = allies.sort((a, b) =>
      (a.currentHp / a.unitData.stats.hp) - (b.currentHp / b.unitData.stats.hp)
    )[0];

    const healAmount = Math.round(healer.unitData.stats.attack * 0.5);
    target.currentHp = Math.min(target.unitData.stats.hp, target.currentHp + healAmount);
  }
}
