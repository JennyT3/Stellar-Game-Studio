import React from 'react';
import { motion } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { useMissionDetail, useStartMission } from '../hooks/useMissions';

export function BriefingModal() {
  const { selectedMissionId, setMode, selectMission } = useGameStore();
  const { data: mission, isLoading } = useMissionDetail(selectedMissionId);
  const startMutation = useStartMission();

  const handleClose = () => selectMission(null);
  
  const handleStart = async () => {
    if (!selectedMissionId) return;
    await startMutation.mutateAsync(selectedMissionId);
    setMode('ACTIVE');
  };

  if (isLoading || !mission) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm flex items-center justify-center"
      >
        <div className="text-cyan-400 font-mono">Loading briefing...</div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <motion.div 
        className="w-full max-w-2xl bg-[#0a0a10] border border-white/10 p-8 rounded-[2rem] relative"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-purple-600" />
        
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/5 rounded-full"
        >
          <X size={24} className="text-white/40" />
        </button>

        <div className="space-y-6">
          <div className="flex items-center gap-2 text-amber-500 font-black uppercase tracking-widest text-[10px]">
            <AlertTriangle size={14} /> Mission Briefing
          </div>
          
          <h2 className="text-3xl font-black italic uppercase">{mission.title}</h2>
          
          <p className="text-white/60 leading-relaxed">{mission.description}</p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded-xl">
              <div className="text-[10px] uppercase text-white/30 mb-1">Reward</div>
              <div className="text-lg font-black text-purple-400">+{mission.points} RP</div>
            </div>
            <div className="bg-white/5 p-4 rounded-xl">
              <div className="text-[10px] uppercase text-white/30 mb-1">Badge</div>
              <div className="text-lg font-black text-cyan-400">{mission.reward}</div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              onClick={handleClose}
              className="flex-1 py-4 border border-white/10 rounded-xl font-black uppercase text-[11px] hover:bg-white/5"
            >
              Cancel
            </button>
            <button 
              onClick={handleStart}
              disabled={startMutation.isPending}
              className="flex-[2] py-4 bg-white text-black font-black uppercase text-[11px] rounded-xl hover:scale-[1.02] disabled:opacity-50"
            >
              {startMutation.isPending ? 'Starting...' : 'Execute Mission'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
