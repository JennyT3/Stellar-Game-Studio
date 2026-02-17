import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { Home } from './Home';
import { ExplorationMap } from './ExplorationMap';
import { BriefingModal } from './BriefingModal';
import { ActiveHUD } from './ActiveHUD';
import { SuccessScreen } from './SuccessScreen';
import { Profile } from './Profile';

export function GameShell() {
  const { mode } = useGameStore();

  return (
    <div className="fixed inset-0 bg-[#000000] text-white font-sans overflow-hidden select-none">
      {/* Background - always present */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_#0a0a1a_0%,_#000000_100%)]" />
      
      {/* Mode routing */}
      {mode === 'HOME' && <Home />}
      {(mode === 'EXPLORATION' || mode === 'BRIEFING') && <ExplorationMap />}
      {mode === 'BRIEFING' && <BriefingModal />}
      {mode === 'ACTIVE' && <ActiveHUD />}
      {mode === 'SUCCESS' && <SuccessScreen />}
      {mode === 'PROFILE' && <Profile />}
    </div>
  );
}
