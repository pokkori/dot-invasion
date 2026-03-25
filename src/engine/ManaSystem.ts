import { ManaState } from '../types/battle';

export class ManaSystem {
  private state: ManaState;
  private readonly BASE_REGEN = 0.01;
  private readonly OVERTIME_REGEN = 0.015;

  constructor() {
    this.state = {
      current: 5.0,
      max: 10.0,
      regenRate: this.BASE_REGEN,
    };
  }

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

  spend(cost: number): boolean {
    if (this.state.current < cost) return false;
    this.state.current -= cost;
    return true;
  }

  getState(): ManaState {
    return { ...this.state };
  }
}
