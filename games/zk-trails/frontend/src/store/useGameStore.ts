import { create } from 'zustand';
import type { AppMode } from '../types';

interface GameState {
  mode: AppMode;
  selectedMissionId: string | null;
  camera: { x: number; y: number; zoom: number };
  
  setMode: (mode: AppMode) => void;
  selectMission: (id: string | null) => void;
  moveCamera: (delta: { x?: number; y?: number; zoom?: number }) => void;
  resetCamera: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  mode: 'HOME',
  selectedMissionId: null,
  camera: { x: 0, y: 0, zoom: 1 },
  
  setMode: (mode) => set({ mode }),
  
  selectMission: (id) => set({ 
    selectedMissionId: id,
    mode: id ? 'BRIEFING' : 'EXPLORATION'
  }),
  
  moveCamera: (delta) => set((state) => ({
    camera: {
      x: state.camera.x + (delta.x || 0),
      y: state.camera.y + (delta.y || 0),
      zoom: Math.max(0.5, Math.min(2, state.camera.zoom + (delta.zoom || 0))),
    }
  })),
  
  resetCamera: () => set({ camera: { x: 0, y: 0, zoom: 1 } }),
}));
