import { create } from 'zustand';
import type Lenis from 'lenis';

// Shared between the homepage islands (3D stage ↔ interactive scene panels). Islands share this module instance.
export type BatteryScenario = 'health' | 'charging' | 'thermal' | 'cells' | 'power';

type StoryState = {
  scene: number;
  battery: BatteryScenario;
  gen: 1 | 2 | 3;
  pmgStep: number; // 0..5
  online: boolean;
  /** Smooth scrolling, when active. Programmatic scrolls go through it so they never fight the native scroll. */
  lenis: Lenis | null;
  set: (p: Partial<Omit<StoryState, 'set'>>) => void;
};

export const useStory = create<StoryState>((set) => ({
  scene: 0,
  battery: 'health',
  gen: 1,
  pmgStep: 0,
  online: true,
  lenis: null,
  set: (p) => set(p),
}));
