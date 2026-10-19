import { create } from 'zustand';
import type { BenefitId } from '@/data/portfolio';

// Shared between the homepage islands (3D stage ↔ interactive scene panels). Islands share this module instance.
export type BatteryScenario = 'health' | 'charging' | 'thermal' | 'cells' | 'power';

type StoryState = {
  scene: number;
  battery: BatteryScenario;
  gen: 1 | 2 | 3;
  pmgStep: number; // 0..5
  benefit: BenefitId;
  online: boolean;
  set: (p: Partial<Omit<StoryState, 'set'>>) => void;
};

export const useStory = create<StoryState>((set) => ({
  scene: 0,
  battery: 'health',
  gen: 1,
  pmgStep: 0,
  benefit: 'battery',
  online: true,
  set: (p) => set(p),
}));
