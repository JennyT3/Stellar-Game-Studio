import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Navigation, Droplets, Terminal, Zap, Vote, 
  BookOpen, Briefcase, Activity, Lock, Hexagon 
} from 'lucide-react';
import { useMissionsMap } from '../hooks/useMissions';
import { useGameStore } from '../store/useGameStore';
import type { Mission, MissionCategory, MissionStatus } from '../types';

const COLORS = {
  green: '#22c55e',
  amber: '#fbbf24',
  purple: '#a855f7',
  slate: '#334155',
};

function CategoryIcon({ category, size = 18 }: { category: MissionCategory; size?: number }) {
  switch (category) {
    case 'Location': return <Navigation size={size} />;
    case 'DeFi': return <Droplets size={size} />;
    case 'Technical': return <Terminal size={size} />;
    case 'Balance': return <Zap size={size} />;
    case 'Governance': return <Vote size={size} />;
    case 'Education': return <BookOpen size={size} />;
    case 'Lending': return <Briefcase size={size} />;
    default: return <Activity size={size} />;
  }
}

function getStatusColor(status: MissionStatus): string {
  switch (status) {
    case 'COMPLETED': return COLORS.green;
    case 'IN_PROGRESS': return COLORS.amber;
    case 'LOCKED': return COLORS.slate;
    case 'AVAILABLE': return COLORS.purple;
  }
}

export function ExplorationMap() {
  const { data: missions, isLoading, error } = useMissionsMap();
  const { selectMission, camera, moveCamera } = useGameStore();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-cyan-400 font-mono text-sm animate-pulse">Loading tactical map...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-red-400 font-mono text-sm">Map sync failed. Retry?</div>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative overflow-hidden">
      {/* Grid background */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ 
          backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', 
          backgroundSize: '100px 100px',
          transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.zoom})`
        }} 
      />

      {/* Mission nodes */}
      <div 
        className="absolute inset-0"
        style={{ 
          transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.zoom})` 
        }}
      >
        {missions?.map((mission, idx) => {
          const isHovered = hoveredId === mission.id;
          const statusColor = getStatusColor(mission.status);
          const canInteract = mission.status !== 'LOCKED';

          return (
            <div 
              key={mission.id} 
              className="absolute"
              style={{ 
                left: `${mission.coords.x}%`, 
                top: `${mission.coords.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <motion.button
                onMouseEnter={() => setHoveredId(mission.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => canInteract && selectMission(mission.id)}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                className={`flex flex-col items-center ${!canInteract ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'}`}
              >
                <motion.div 
                  animate={{ 
                    scale: isHovered ? 1.3 : 1,
                    boxShadow: isHovered ? `0 0 30px ${statusColor}44` : 'none'
                  }}
                  className="w-12 h-12 rounded-xl rotate-45 border-2 flex items-center justify-center transition-all bg-[#0a0a15]"
                  style={{ borderColor: isHovered ? statusColor : `${statusColor}22`, color: statusColor }}
                >
                  <div className="-rotate-45">
                    {mission.status === 'LOCKED' 
                      ? <Lock size={16} /> 
                      : <CategoryIcon category={mission.category} size={20} />
                    }
                  </div>
                </motion.div>

                {/* Tooltip */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-14 z-50 pointer-events-none"
                    >
                      <div className="bg-black/80 backdrop-blur-md border border-white/10 p-4 rounded-xl min-w-[200px]">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-black uppercase text-white tracking-widest">
                            {mission.title}
                          </span>
                          <span className={`text-[8px] px-1.5 py-0.5 rounded ${
                            mission.type === 'PHYSICAL' 
                              ? 'bg-amber-500/20 text-amber-500' 
                              : 'bg-cyan-500/20 text-cyan-400'
                          }`}>
                            {mission.type}
                          </span>
                        </div>
                        <p className="text-[9px] text-white/50 leading-relaxed line-clamp-2 mb-2">
                          {mission.description}
                        </p>
                        <div className="flex justify-between text-[8px] font-mono">
                          <span className="text-purple-400">+{mission.points} RP</span>
                          <span className="text-white/30 uppercase">{mission.difficulty}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          );
        })}
      </div>

      {/* Camera controls */}
      <div className="absolute bottom-8 right-8 flex flex-col gap-2">
        <button 
          onClick={() => moveCamera({ zoom: 0.2 })}
          className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center hover:bg-white/10"
        >+</button>
        <button 
          onClick={() => moveCamera({ zoom: -0.2 })}
          className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center hover:bg-white/10"
        >-</button>
        <button 
          onClick={() => moveCamera({ x: 0, y: 0, zoom: 1 })}
          className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center hover:bg-white/10 text-[10px]"
        >⌖</button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-8 left-8 flex gap-4">
        <div className="flex items-center gap-2 text-[9px] font-bold uppercase text-white/30">
          <div className="w-2 h-2 rounded-full bg-purple-500" /> Available
        </div>
        <div className="flex items-center gap-2 text-[9px] font-bold uppercase text-white/30">
          <div className="w-2 h-2 rounded-full bg-green-500" /> Completed
        </div>
        <div className="flex items-center gap-2 text-[9px] font-bold uppercase text-white/30">
          <div className="w-2 h-2 rounded-full bg-amber-500" /> Active
        </div>
      </div>

      {/* Header overlay */}
      <div className="absolute top-0 left-0 right-0 h-20 px-8 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <Hexagon size={16} className="fill-white" />
          </div>
          <span className="font-black text-sm tracking-tighter uppercase">ZK-TRAILS</span>
        </div>
        <nav className="flex items-center gap-2 pointer-events-auto">
          <button className="px-4 py-2 rounded-lg bg-purple-600/20 border border-purple-500/30 text-[10px] font-black uppercase">
            Map
          </button>
          <button className="px-4 py-2 rounded-lg text-white/40 hover:text-white text-[10px] font-black uppercase">
            Profile
          </button>
        </nav>
      </div>
    </div>
  );
}
