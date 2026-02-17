import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import { useUser } from '../hooks/useMissions';

export function Profile() {
  const { setMode } = useGameStore();
  const { data: user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center">
        <div className="text-cyan-400 font-mono">Loading operative data...</div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center p-8"
    >
      <h2 className="text-3xl font-black italic uppercase mb-8">Operative Profile</h2>
      <div className="bg-white/5 p-8 rounded-2xl border border-white/10 max-w-md w-full">
        <pre className="text-xs font-mono text-white/60 overflow-auto">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
      <button 
        onClick={() => setMode('EXPLORATION')}
        className="mt-8 px-8 py-4 bg-purple-600 rounded-xl font-black uppercase"
      >
        Back to Map
      </button>
    </motion.div>
  );
}
