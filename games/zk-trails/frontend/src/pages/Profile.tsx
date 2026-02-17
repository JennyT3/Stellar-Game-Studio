import { useUser } from '@/hooks/use-user';
import { useWallet } from '@/hooks/use-wallet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, 
  Zap, 
  Wallet, 
  Target, 
  Clock, 
  Award,
  Loader2,
  Copy
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface PlayerStats {
  address: string;
  xp: number;
  missionsCompleted: number;
  rank: number;
  totalRewards: number;
}

export default function Profile() {
  const { address, isConnected, connect, isLoading: walletLoading } = useWallet();
  const { data: player, isLoading: playerLoading } = useUser(address);
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (address) {
      fetch(`http://localhost:3001/api/zk/players/${address}/stats`)
        .then(res => res.json())
        .then(data => setStats(data))
        .catch(console.error);
    }
  }, [address]);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00ff80]/10 rounded-full blur-[128px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#6c1b9e]/10 rounded-full blur-[128px] animate-pulse delay-1000" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#00ff80] to-[#6c1b9e] flex items-center justify-center shadow-[0_0_40px_rgba(0,255,128,0.5)]">
            <Wallet className="h-12 w-12 text-black" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4 font-display">ACCESS DENIED</h1>
          <p className="text-[#00ff80]/70 mb-8 font-mono">Connect wallet to view profile</p>
          <Button 
            onClick={connect}
            disabled={walletLoading}
            className="bg-[#00ff80] hover:bg-[#00cc66] text-black font-bold px-8 py-6 text-lg font-display tracking-wider shadow-[0_0_20px_rgba(0,255,128,0.3)]"
          >
            {walletLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Wallet className="h-5 w-5 mr-2" />}
            CONNECT WALLET
          </Button>
        </motion.div>
      </div>
    );
  }

  if (playerLoading || !stats) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-[#00ff80]" />
          <span className="text-[#00ff80] font-mono text-sm animate-pulse">LOADING PROFILE...</span>
        </div>
      </div>
    );
  }

  const tierProgress = {
    ROOKIE: { next: 'ADVENTURER', max: 500 },
    ADVENTURER: { next: 'EXPLORER', max: 2000 },
    EXPLORER: { next: 'LEGEND', max: 5000 },
    LEGEND: { next: 'MAX', max: 10000 },
  };

  const currentTier = player?.tier || 'ROOKIE';
  const progress = tierProgress[currentTier as keyof typeof tierProgress];
  const currentScore = player?.xp || 0;
  const progressPercent = Math.min((currentScore / progress.max) * 100, 100);

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00ff80]/5 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#6c1b9e]/5 rounded-full blur-[128px]" />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2 font-display">OPERATIVE PROFILE</h1>
          <p className="text-[#00ff80]/70 font-mono">Classified personnel data</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <Card className="border-[#00ff80]/30 bg-black/80 backdrop-blur-xl overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-[#00ff80]/20 to-[#6c1b9e]/20 relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30" />
              </div>
              <CardContent className="relative -mt-16">
                <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-[#00ff80] to-[#6c1b9e] p-1 shadow-[0_0_30px_rgba(0,255,128,0.5)]">
                  <div className="w-full h-full rounded-full bg-[#0a0a0a] flex items-center justify-center">
                    <Trophy className="h-12 w-12 text-[#00ff80]" />
                  </div>
                </div>
                
                <div className="text-center mt-4">
                  <Badge className="bg-[#00ff80]/20 text-[#00ff80] border-[#00ff80]/50 font-mono mb-2">
                    {currentTier}
                  </Badge>
                  <h2 className="text-xl font-bold text-white font-display">OPERATIVE</h2>
                  
                  <div className="flex items-center justify-center gap-2 mt-2 text-sm text-gray-400 font-mono">
                    <span>{address?.slice(0, 6)}...{address?.slice(-4)}</span>
                    <button 
                      onClick={copyAddress}
                      className="hover:text-[#00ff80] transition-colors"
                    >
                      {copied ? <span className="text-[#00ff80]">COPIED!</span> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-[#00ff80]/20">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400 font-mono">PROGRESS TO {progress.next}</span>
                    <span className="text-sm text-[#00ff80] font-bold">{Math.round(progressPercent)}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-[#00ff80] to-[#6c1b9e] h-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2 font-mono">
                    {progress.max - currentScore} XP remaining
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="border-[#00ff80]/20 bg-black/50 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-[#00ff80]/70 font-mono">TOTAL XP</CardTitle>
                    <Zap className="h-4 w-4 text-[#00ff80]" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white font-display">
                      {stats.xp.toLocaleString()} <span className="text-[#00ff80] text-lg">XP</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card className="border-[#6c1b9e]/20 bg-black/50 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-[#6c1b9e]/70 font-mono">GLOBAL RANK</CardTitle>
                    <Award className="h-4 w-4 text-[#6c1b9e]" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white font-display">
                      #{stats.rank}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card className="border-[#00ff80]/20 bg-black/50 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-[#00ff80]/70 font-mono">MISSIONS</CardTitle>
                    <Target className="h-4 w-4 text-[#00ff80]" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white font-display">
                      {stats.missionsCompleted}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <Card className="border-[#6c1b9e]/20 bg-black/50 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-[#6c1b9e]/70 font-mono">REWARDS</CardTitle>
                    <Trophy className="h-4 w-4 text-[#6c1b9e]" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white font-display">
                      {stats.totalRewards} <span className="text-[#00ff80] text-lg">XLM</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Card className="border-[#00ff80]/20 bg-black/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white font-display flex items-center gap-2">
                    <Clock className="h-5 w-5 text-[#00ff80]" />
                    RECENT ACTIVITY
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 text-center py-8 font-mono">Activity tracking coming soon</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
