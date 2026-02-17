import { Mission } from '@/hooks/use-missions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, MapPin, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { API_URL } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface MissionCardProps {
  mission: Mission;
  publicKey: string | null;
  isCompleted: boolean;
}

const difficultyColors: Record<string, string> = {
  easy: 'border-green-500/30 text-green-400 bg-green-500/10',
  medium: 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10',
  hard: 'border-red-500/30 text-red-400 bg-red-500/10',
};

export function MissionCard({ mission, publicKey, isCompleted }: MissionCardProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    if (!publicKey) {
      toast({ title: 'Connect your wallet first', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/zk/missions/${mission.id}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: publicKey })
      });
      const data = await res.json();
      if (data.success) {
        toast({
          title: '🚀 Mission Started!',
          description: `Session ${data.sessionId} registered on Stellar${data.gameHubStarted ? ' ✅ Game Hub active' : ''}`,
        });
        if (mission.type === 'online' && (mission as any).soroswapUrl) {
          window.open((mission as any).soroswapUrl, '_blank');
        }
      }
    } catch (err) {
      toast({ title: 'Error starting mission', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={`border-[#00ff80]/20 bg-black/50 backdrop-blur-sm hover:border-[#00ff80]/40 transition-all ${isCompleted ? 'opacity-60' : ''}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-white font-display text-lg">{mission.title}</CardTitle>
          <div className="flex gap-2 items-center">
            {mission.type === 'physical'
              ? <MapPin className="h-4 w-4 text-[#00ff80]" />
              : <Globe className="h-4 w-4 text-[#6c1b9e]" />
            }
            <Badge className={difficultyColors[mission.difficulty] || difficultyColors.easy}>
              {mission.difficulty?.toUpperCase()}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400 text-sm mb-4">{mission.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#00ff80]">
            <Zap className="h-4 w-4" />
            <span className="font-bold">{mission.reward} XP</span>
          </div>
          <Button
            onClick={handleStart}
            disabled={isCompleted || !publicKey || loading}
            className="bg-[#00ff80] hover:bg-[#00cc66] text-black font-bold"
          >
            {loading ? 'STARTING...' : isCompleted ? 'COMPLETED' : 'START'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
