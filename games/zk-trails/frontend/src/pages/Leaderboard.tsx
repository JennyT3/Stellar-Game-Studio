import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Target, Zap, Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';

interface LeaderboardEntry {
  rank: number;
  address: string;
  xp: number;
  missionsCompleted: number;
  tier: string;
}

export default function Leaderboard() {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/api/zk/leaderboard')
      .then(res => res.json())
      .then(data => {
        setLeaders(data.leaders || mockLeaders);
        setLoading(false);
      })
      .catch(() => {
        setLeaders(mockLeaders);
        setLoading(false);
      });
  }, []);

  const mockLeaders: LeaderboardEntry[] = [
    { rank: 1, address: 'GCA3X...7YH2', xp: 8750, missionsCompleted: 12, tier: 'LEGEND' },
    { rank: 2, address: 'GB4D2...9KL4', xp: 7200, missionsCompleted: 10, tier: 'EXPLORER' },
    { rank: 3, address: 'GD8F1...3MN7', xp: 6800, missionsCompleted: 9, tier: 'EXPLORER' },
    { rank: 4, address: 'GJ2K5...8PQ1', xp: 5400, missionsCompleted: 7, tier: 'ADVENTURER' },
    { rank: 5, address: 'GM7N3...2RS6', xp: 4200, missionsCompleted: 6, tier: 'ADVENTURER' },
  ];

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-6 w-6 text-yellow-400" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Medal className="h-6 w-6 text-amber-600" />;
    return <span className="text-2xl font-bold text-[#00ff80]/50 font-display">#{rank}</span>;
  };

  const getRankStyle = (rank: number) => {
    if (rank === 1) return 'border-yellow-400/50 bg-yellow-400/10';
    if (rank === 2) return 'border-gray-400/50 bg-gray-400/10';
    if (rank === 3) return 'border-amber-600/50 bg-amber-600/10';
    return 'border-[#00ff80]/20 bg-black/50';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#00ff80]/20 border-t-[#00ff80] rounded-full animate-spin" />
          <span className="text-[#00ff80] font-mono text-sm animate-pulse">LOADING LEADERBOARD...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-[#00ff80]/5 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-[#6c1b9e]/5 rounded-full blur-[128px]" />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00ff80]/30 bg-[#00ff80]/10 mb-4">
            <Trophy className="h-5 w-5 text-[#00ff80]" />
            <span className="text-[#00ff80] font-mono text-sm">GLOBAL RANKINGS</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 font-display">
            ELITE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff80] to-[#6c1b9e]">OPERATIVES</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto font-mono">
            Top performers in the ZK-Trails network. Compete in missions to climb the ranks.
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row justify-center items-end gap-4 mb-12 max-w-4xl mx-auto">
          {leaders.slice(0, 3).map((player, idx) => (
            <motion.div
              key={player.rank}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`w-full md:w-1/3 ${idx === 0 ? 'md:order-2' : idx === 1 ? 'md:order-1' : 'md:order-3'}`}
            >
              <div className={`relative p-6 rounded-2xl border-2 ${getRankStyle(player.rank)} backdrop-blur-sm`}>
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="w-8 h-8 rounded-full bg-[#0a0a0a] border-2 border-current flex items-center justify-center text-2xl">
                    {getRankIcon(player.rank)}
                  </div>
                </div>
                <div className="pt-4 text-center">
                  <p className="text-white font-mono text-sm mb-1">{player.address}</p>
                  <p className="text-3xl font-bold text-white font-display mb-1">{player.xp.toLocaleString()}</p>
                  <p className="text-[#00ff80] text-xs font-mono">XP</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-[#00ff80]/20 bg-black/50 backdrop-blur-sm overflow-hidden">
            <CardHeader className="border-b border-[#00ff80]/20 bg-[#00ff80]/5">
              <CardTitle className="text-white font-display flex items-center gap-2">
                <Target className="h-5 w-5 text-[#00ff80]" />
                ALL OPERATIVES
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-[#00ff80]/10">
                {leaders.map((player, idx) => (
                  <motion.div
                    key={player.rank}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + idx * 0.05 }}
                    className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 text-center font-bold text-xl font-display text-[#00ff80]/50 group-hover:text-[#00ff80] transition-colors">
                        #{player.rank}
                      </div>
                      <div>
                        <p className="text-white font-mono font-medium">{player.address}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={`text-xs ${
                            player.tier === 'LEGEND' ? 'bg-purple-500/20 text-purple-400' :
                            player.tier === 'EXPLORER' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {player.tier}
                          </Badge>
                          <span className="text-xs text-gray-500 font-mono">{player.missionsCompleted} missions</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-[#00ff80]" />
                      <span className="text-xl font-bold text-white font-display">{player.xp.toLocaleString()}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <Link href="/dashboard">
            <button className="px-8 py-4 bg-[#00ff80] hover:bg-[#00cc66] text-black font-bold font-display tracking-wider rounded-lg shadow-[0_0_30px_rgba(0,255,128,0.3)] hover:shadow-[0_0_40px_rgba(0,255,128,0.5)] transition-all">
              START YOUR MISSION
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
