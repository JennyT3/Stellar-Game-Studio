import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';

export function ActiveHUD() {
  const { setMode } = useGameStore();

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="fixed inset-0 z-[400] bg-black flex flex-col items-center justify-center"
    >
      <div className="text-cyan-400 font-mono mb-8">Mission Active - HUD Placeholder</div>
      <button 
        onClick={() => setMode('SUCCESS')}
        className="px-8 py-4 bg-purple-600 rounded-xl font-black uppercase"
      >
        Complete Mission (Demo)
      </button>
    </motion.div>
  );
}
