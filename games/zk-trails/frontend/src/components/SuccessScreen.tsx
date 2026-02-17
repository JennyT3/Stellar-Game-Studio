import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';

export function SuccessScreen() {
  const { setMode } = useGameStore();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-[500] bg-black flex flex-col items-center justify-center"
    >
      <CheckCircle2 size={64} className="text-green-500 mb-6" />
      <h2 className="text-4xl font-black italic uppercase mb-4">Mission Complete</h2>
      <button 
        onClick={() => setMode('EXPLORATION')}
        className="px-8 py-4 bg-white text-black rounded-xl font-black uppercase"
      >
        Return to Map
      </button>
    </motion.div>
  );
}
