import { Particle, Vec2 } from '../types/battle';
import { PixelColor, PixelGrid } from '../types/unit';

export class ParticleSystem {
  private particles: Particle[] = [];
  private readonly MAX_PARTICLES = 200;
  private nextId = 0;

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

  spawnDeathParticles(position: Vec2, grid: PixelGrid): void {
    for (let i = 0; i < 9; i++) {
      const pixel = grid[i];
      if (pixel.a === 0) continue;
      const gridX = (i % 3) - 1;
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

  spawnCastleHitParticles(position: Vec2, _damage: number): void {
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
      this.particles.shift();
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

  update(): void {
    for (const p of this.particles) {
      p.position.x += p.velocity.x;
      p.position.y += p.velocity.y;
      p.velocity.y += 0.1;
      p.velocity.x *= 0.95;
      p.velocity.y *= 0.95;
      p.life--;
    }
    this.particles = this.particles.filter(p => p.life > 0);
  }

  getParticles(): Particle[] {
    return this.particles;
  }
}
