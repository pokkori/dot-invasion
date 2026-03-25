import { BattleUnit, Castle, Vec2 } from '../types/battle';

export class PhysicsEngine {
  private readonly UNIT_RADIUS = 8;
  private readonly FIELD_WIDTH = 320;
  private readonly FIELD_HEIGHT = 568;

  updatePositions(units: BattleUnit[], playerCastle: Castle, enemyCastle: Castle): void {
    for (const unit of units) {
      if (unit.state === 'dead' || unit.state === 'dying') continue;

      const targetPos = this.getTargetPosition(unit, units, playerCastle, enemyCastle);
      if (!targetPos) continue;

      const dx = targetPos.x - unit.position.x;
      const dy = targetPos.y - unit.position.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= unit.unitData.stats.range) {
        unit.state = 'attacking';
        continue;
      }

      unit.state = 'moving';
      const speed = unit.unitData.stats.speed;
      unit.position.x += (dx / dist) * speed;
      unit.position.y += (dy / dist) * speed;

      unit.position.x = Math.max(this.UNIT_RADIUS, Math.min(this.FIELD_WIDTH - this.UNIT_RADIUS, unit.position.x));
      unit.position.y = Math.max(this.UNIT_RADIUS, Math.min(this.FIELD_HEIGHT - this.UNIT_RADIUS, unit.position.y));
    }

    this.resolveOverlaps(units);
  }

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

    if (closestDist <= unit.unitData.stats.range * 3 && closestPos) {
      unit.target = closestId;
      return closestPos;
    }

    unit.target = null;
    const targetCastle = unit.owner === 'player' ? enemyCastle : playerCastle;
    return targetCastle.position;
  }

  private resolveOverlaps(units: BattleUnit[]): void {
    const alive = units.filter(u => u.state !== 'dead' && u.state !== 'dying');
    for (let i = 0; i < alive.length; i++) {
      for (let j = i + 1; j < alive.length; j++) {
        if (alive[i].owner !== alive[j].owner) continue;
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
