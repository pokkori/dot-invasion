export type StageZone = {
  name: string;
  stages: number[];
  difficulty: 'easy' | 'normal' | 'hard';
};

export const STAGE_ZONES: StageZone[] = [
  { name: '初陣の荒野', stages: [1, 2, 3, 4, 5], difficulty: 'easy' },
  { name: '戦場の峡谷', stages: [6, 7, 8, 9, 10], difficulty: 'normal' },
  { name: '深淵の要塞', stages: [11, 12, 13, 14, 15], difficulty: 'hard' },
];
