import React from 'react';
import { motion } from 'framer-motion';
import { Hexagon, Lock, Globe, Zap } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';

export function Home() {
  const { setMode } = useGameStore();

  const connectWallet = () => {
    // TODO: Integrate with Stellar wallet kit
    localStorage.setItem('token', 'demo-token');
    setMode('EXPLORATION');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center p-6 text-center"
    >
      <div className="max-w-2xl w-full space-y-12 relative px-4">
        <div className="absolute -inset-40 bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
        
        <motion.div 
          initial={{ scale: 0.9, y: 20 }} 
          animate={{ scale: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="w-24 h-24 mx-auto bg-purple-600 rounded-[2rem] flex items-center justify-center shadow-[0_0_60px_rgba(168,85,247,0.4)] mb-8">
            <Hexagon size={48} className="fill-white" />
          </div>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tighter italic uppercase leading-none">
            ZK-TRAILS
          </h1>
          <p className="text-sm sm:text-base font-medium text-white/60 max-w-lg mx-auto leading-relaxed">
            The first tactical network built for privacy. Complete physical and remote missions using Zero-Knowledge proofs on Stellar.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400">
            <span className="flex items-center gap-2"><Lock size={12}/> Privacy-First</span>
            <span className="flex items-center gap-2"><Globe size={12}/> Global Ops</span>
            <span className="flex items-center gap-2"><Zap size={12}/> Soroban Powered</span>
          </div>
        </motion.div>

        <div className="space-y-4">
          <button 
            onClick={connectWallet}
            className="w-full max-w-sm py-6 bg-white text-black font-black uppercase tracking-[0.3em] rounded-[1.5rem] shadow-2xl hover:scale-105 transition-all active:scale-95"
          >
            Launch Terminal
          </button>
          <div className="flex justify-center gap-8 opacity-40 text-[9px] font-bold uppercase tracking-widest pt-4">
            <span className="hover:text-white transition-colors cursor-pointer">Documentation</span>
            <span className="hover:text-white transition-colors cursor-pointer">Stellar Network</span>
            <span className="hover:text-white transition-colors cursor-pointer">Noir Prover</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
