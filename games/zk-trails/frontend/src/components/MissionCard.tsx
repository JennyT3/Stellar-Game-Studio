import { useState } from 'react';
import { Mission } from '@/hooks/use-missions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Zap, CheckCircle2, Lock, Terminal, X } from 'lucide-react';
import { useCompleteMission, useStartMission } from '@/hooks/use-missions';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { ConnectWalletMission } from './ConnectWalletMission';
import { ZKProofMission } from './ZKProofMission';
import { LocationMission } from './LocationMission';

interface MissionCardProps {
  mission: Mission;
  publicKey: string | null;
  isCompleted: boolean;
}

const difficultyColors = {
  EASY: 'border-green-500/30 text-green-400 bg-green-500/10',
  MEDIUM: 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10',
  HARD: 'border-red-500/30 text-red-400 bg-red-500/10',
};

const difficultyLabels = {
  EASY: 'EASY',
  MEDIUM: 'MEDIUM',
  HARD: 'HARD',
};

export function MissionCard({ mission, publicKey, isCompleted }: MissionCardProps) {
  const [isActive, setIsActive] = useState(false);
  const completeMutation = useCompleteMission();
  const startMutation = useStartMission();
  const { toast } = useToast();

  const handleStart = async () => {
    if (!publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    try {
      await startMutation.mutateAsync({
        missionId: mission.id,
        playerAddress: publicKey,
      });
      setIsActive(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start mission",
        variant: "destructive",
      });
    }
  };

  const handleComplete = async (extraData?: any) => {
    if (!publicKey) return;

    try {
      const payload: any = {
        missionId: mission.id,
        playerAddress: publicKey,
      };

      // Add mission-specific data
      if (mission.id === 'location_verify' && extraData?.location) {
        payload.userLocation = extraData.location;
        payload.userTime = Math.floor(Date.now() / 1000);
      }

      if (mission.zkRequired && extraData?.proof) {
        payload.proof = extraData.proof;
      }

      const result = await completeMutation.mutateAsync(payload);
      
      toast({
        title: "MISSION COMPLETED! 🎉",
        description: `You earned ${mission.points} XP! Total: ${result.player.score}`,
      });
      
      setIsActive(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to complete mission",
        variant: "destructive",
      });
    }
  };

  const renderMissionContent = () => {
    if (mission.id === 'connect_wallet') {
      return (
        <ConnectWalletMission 
          isConnected={!!publicKey}
          onComplete={() => handleComplete()}
        />
      );
    }

    if (mission.id === 'zk_proof_101') {
      return (
        <ZKProofMission 
          onComplete={(proof) => handleComplete({ proof })}
        />
      );
    }

    if (mission.id === 'location_verify') {
      return (
        <LocationMission 
          targetLocation={{ lat: 38.67, lon: -9.13 }}
          onComplete={(location, proof) => handleComplete({ location, proof })}
        />
      );
    }

    return null;
  };

  return (
    <>
      <Card className={`relative overflow-hidden border-[#00ff80]/20 bg-black/60 backdrop-blur-sm transition-all duration-300 hover:border-[#00ff80]/50 hover:shadow-[0_0_30px_rgba(0,255,128,0.1)] ${isCompleted ? 'opacity-75' : ''}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#00ff80]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {isCompleted && (
          <div className="absolute top-4 right-4 z-10">
            <div className="bg-[#00ff80]/20 border border-[#00ff80]/50 rounded-full p-1">
              <CheckCircle2 className="h-5 w-5 text-[#00ff80]" />
            </div>
          </div>
        )}
        
        <CardHeader className="relative z-10">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <Terminal className="h-5 w-5 text-[#00ff80]" />
              <span className="text-xs font-mono text-[#00ff80]/70">ID: {mission.id}</span>
            </div>
            <Badge variant="outline" className={`${difficultyColors[mission.difficulty as keyof typeof difficultyColors]} font-mono text-xs`}>
              {difficultyLabels[mission.difficulty as keyof typeof difficultyLabels]}
            </Badge>
          </div>
          <CardTitle className="text-xl text-white font-display mb-2 group-hover:text-[#00ff80] transition-colors">
            {mission.title}
          </CardTitle>
          <CardDescription className="text-gray-400 font-body">
            {mission.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-[#00ff80]">
                <Zap className="h-4 w-4" />
                <span className="font-bold font-display">{mission.points} XP</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500 font-mono text-xs">
                <Target className="h-4 w-4" />
                <span>{mission.category}</span>
              </div>
            </div>
            
            <Button
              onClick={handleStart}
              disabled={isCompleted || isActive || !publicKey}
              className={`${
                isCompleted 
                  ? 'bg-[#00ff80]/20 text-[#00ff80] border border-[#00ff80]/50' 
                  : 'bg-[#00ff80] hover:bg-[#00cc66] text-black shadow-[0_0_20px_rgba(0,255,128,0.3)] hover:shadow-[0_0_30px_rgba(0,255,128,0.5)]'
              } font-bold font-display tracking-wider transition-all`}
            >
              {isCompleted ? (
                'COMPLETED'
              ) : !publicKey ? (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  LOCKED
                </>
              ) : isActive ? (
                'IN PROGRESS'
              ) : (
                'EXECUTE'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mission Modal */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsActive(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-black border border-[#00ff80]/30 rounded-lg p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-display text-white">{mission.title}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsActive(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <p className="text-gray-400 text-sm mb-6">{mission.description}</p>

              {renderMissionContent()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
