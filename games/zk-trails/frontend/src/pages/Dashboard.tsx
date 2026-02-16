import { useMissions } from '@/hooks/use-missions';
import { useUser } from '@/hooks/use-user';
import { useWallet } from '@/hooks/use-wallet';
import { MissionCard } from '@/components/MissionCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Rocket, Trophy, Zap, Wallet, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const tierProgress = {
  ROOKIE: { next: 'ADVENTURER', max: 500 },
  ADVENTURER: { next: 'EXPLORER', max: 2000 },
  EXPLORER: { next: 'LEGEND', max: 5000 },
  LEGEND: { next: 'MAX', max: 10000 },
};

export default function Dashboard() {
  const { address, isLoading: isConnecting, connect, isConnected } = useWallet();
  const { data: missions, isLoading: missionsLoading } = useMissions();
  const { data: player, isLoading: playerLoading } = useUser(address);
  const { toast } = useToast();

  const handleConnect = async () => {
    try {
      await connect();
      toast({
        title: "Wallet Connected!",
        description: "Welcome to ZK-Trails",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00ff80]/10 rounded-full blur-[128px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#6c1b9e]/10 rounded-full blur-[128px] animate-pulse delay-1000" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-md"
        >
          <Card className="border-[#00ff80]/30 bg-black/80 backdrop-blur-xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-[#00ff80] to-[#6c1b9e] flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(0,255,128,0.5)]">
                <Rocket className="h-8 w-8 text-black" />
              </div>
              <CardTitle className="text-2xl text-white font-display">SYSTEM ACCESS</CardTitle>
              <p className="text-[#00ff80]/70 mt-2 font-mono text-sm">Connect wallet to initialize terminal</p>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleConnect}
                disabled={isConnecting}
                className="w-full bg-[#00ff80] hover:bg-[#00cc66] text-black font-bold h-12 text-lg font-display tracking-wider shadow-[0_0_20px_rgba(0,255,128,0.3)] hover:shadow-[0_0_30px_rgba(0,255,128,0.5)] transition-all"
              >
                {isConnecting ? (
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                ) : (
                  <Wallet className="h-5 w-5 mr-2" />
                )}
                {isConnecting ? 'INITIALIZING...' : 'CONNECT WALLET'}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (missionsLoading || playerLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-[#00ff80]" />
          <span className="text-[#00ff80] font-mono text-sm animate-pulse">LOADING MISSIONS...</span>
        </div>
      </div>
    );
  }

  const currentTier = player?.tier || 'ROOKIE';
  const progress = tierProgress[currentTier as keyof typeof tierProgress];
  const currentScore = player?.score || 0;
  const progressPercent = Math.min((currentScore / progress.max) * 100, 100);

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00ff80]/5 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#6c1b9e]/5 rounded-full blur-[128px]" />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-[#00ff80]/20 bg-black/50 backdrop-blur-sm hover:border-[#00ff80]/40 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[#00ff80]/70 font-mono">TOTAL SCORE</CardTitle>
                <Zap className="h-4 w-4 text-[#00ff80]" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white font-display">{currentScore.toLocaleString()} <span className="text-[#00ff80] text-lg">XP</span></div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-[#6c1b9e]/20 bg-black/50 backdrop-blur-sm hover:border-[#6c1b9e]/40 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[#6c1b9e]/70 font-mono">CURRENT TIER</CardTitle>
                <Trophy className="h-4 w-4 text-[#6c1b9e]" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white font-display mb-2">{currentTier}</div>
                <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-[#00ff80] to-[#6c1b9e] h-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2 font-mono">
                  {progress.next !== 'MAX' ? `${progress.max - currentScore} XP TO ${progress.next}` : 'MAX TIER REACHED'}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-[#00ff80]/20 bg-black/50 backdrop-blur-sm hover:border-[#00ff80]/40 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[#00ff80]/70 font-mono">MISSIONS COMPLETED</CardTitle>
                <Rocket className="h-4 w-4 text-[#00ff80]" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white font-display">
                  {player?.completedMissions?.length || 0} <span className="text-gray-500 text-lg">/ {missions?.length || 0}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Missions Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-2 font-display">AVAILABLE MISSIONS</h2>
          <p className="text-gray-400 font-mono text-sm">Complete missions to earn XP and climb the ranks</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {missions?.map((mission, idx) => (
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <MissionCard
                mission={mission}
                publicKey={address}
                isCompleted={player?.completedMissions?.includes(mission.id) || false}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
