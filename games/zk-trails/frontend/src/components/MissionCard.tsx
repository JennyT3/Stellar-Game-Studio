import { Mission } from '@/hooks/use-missions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, MapPin, Globe, ExternalLink, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { API_URL } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface MissionCardProps {
  mission: Mission;
  publicKey: string | null;
  isCompleted: boolean;
  onCompleted?: (missionId: string) => void;
}

const difficultyColors: Record<string, string> = {
  easy: 'border-green-500/30 text-green-400 bg-green-500/10',
  medium: 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10',
  hard: 'border-red-500/30 text-red-400 bg-red-500/10',
};

type Step = 'idle' | 'started' | 'verifying' | 'success' | 'error';

export function MissionCard({ mission, publicKey, isCompleted, onCompleted }: MissionCardProps) {
  const { toast } = useToast();
  const [step, setStep] = useState<Step>('idle');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [txHash, setTxHash] = useState('');
  const [verifyResult, setVerifyResult] = useState<string>('');

  // ── STEP 1: START MISSION ─────────────────────────────────────────────────
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
        setSessionId(data.sessionId);
        setStep('started');
        toast({
          title: '🚀 Mission Started!',
          description: `Session ${data.sessionId}${data.gameHubStarted ? ' · Game Hub ✅' : ''}`,
        });
        // Open the action URL for online missions
        if ((mission as any).type === 'online' && (mission as any).actionUrl) {
          window.open((mission as any).actionUrl, '_blank');
        }
      }
    } catch {
      toast({ title: 'Error starting mission', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  // ── STEP 2: VERIFY TRANSACTION (online missions) ──────────────────────────
  const handleVerifyTx = async () => {
    if (!txHash.trim()) {
      toast({ title: 'Paste your transaction hash first', variant: 'destructive' });
      return;
    }
    if (!publicKey) return;
    setLoading(true);
    setStep('verifying');
    try {
      const res = await fetch(`${API_URL}/zk/missions/${mission.id}/verify-transaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ txHash: txHash.trim(), walletAddress: publicKey })
      });
      const data = await res.json();
      if (data.verified) {
        await handleComplete();
      } else {
        setVerifyResult(data.reason || 'Verification failed');
        setStep('error');
      }
    } catch {
      setVerifyResult('Could not connect to backend');
      setStep('error');
    } finally {
      setLoading(false);
    }
  };

  // ── STEP 3: COMPLETE MISSION ──────────────────────────────────────────────
  const handleComplete = async () => {
    if (!publicKey) return;
    try {
      const res = await fetch(`${API_URL}/zk/complete-mission`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          missionId: mission.id,
          walletAddress: publicKey,
          sessionId
        })
      });
      const data = await res.json();
      if (data.success) {
        setStep('success');
        toast({
          title: '🎉 Mission Complete!',
          description: `+${mission.reward} XP earned${data.gameHubEnded ? ' · end_game ✅' : ''}`,
        });
        onCompleted?.(mission.id);
      }
    } catch {
      setVerifyResult('Error completing mission');
      setStep('error');
    }
  };

  // ── STEP 2b: VERIFY LOCATION (physical missions) ──────────────────────────
  const handleVerifyLocation = async () => {
    if (!publicKey) return;
    setLoading(true);
    setStep('verifying');
    try {
      if (!navigator.geolocation) {
        setVerifyResult('Geolocation not available in this browser');
        setStep('error');
        return;
      }
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        const res = await fetch(`${API_URL}/zk/missions/${mission.id}/verify-location`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lat: latitude, lon: longitude, walletAddress: publicKey })
        });
        const data = await res.json();
        if (data.verified) {
          await handleComplete();
        } else {
          setVerifyResult(data.message || 'Not in mission zone');
          setStep('error');
        }
        setLoading(false);
      }, () => {
        setVerifyResult('Location access denied — allow location in your browser');
        setStep('error');
        setLoading(false);
      });
    } catch {
      setVerifyResult('Location verification error');
      setStep('error');
      setLoading(false);
    }
  };

  // ── RENDER ─────────────────────────────────────────────────────────────────

  const isOnline = (mission as any).type === 'online';
  const questAddress = (mission as any).questAddress;
  const requiredMemo = (mission as any).requiredMemo;
  const actionUrl = (mission as any).actionUrl;
  const actionLabel = (mission as any).actionLabel;
  const locationHint = (mission as any).locationHint;

  if (step === 'success' || isCompleted) {
    return (
      <Card className="border-[#00ff80]/40 bg-black/50 backdrop-blur-sm opacity-80">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-white font-display text-lg">{mission.title}</CardTitle>
            <CheckCircle2 className="h-5 w-5 text-[#00ff80]" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-[#00ff80] font-mono text-sm">✅ COMPLETED — +{mission.reward} XP</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-[#00ff80]/20 bg-black/50 backdrop-blur-sm hover:border-[#00ff80]/40 transition-all">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-white font-display text-lg">
            {(mission as any).badge} {mission.title}
          </CardTitle>
          <div className="flex gap-2 items-center">
            {isOnline
              ? <Globe className="h-4 w-4 text-[#6c1b9e]" />
              : <MapPin className="h-4 w-4 text-[#00ff80]" />
            }
            <Badge className={difficultyColors[mission.difficulty] || difficultyColors.easy}>
              {mission.difficulty?.toUpperCase()}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-gray-400 text-sm">{mission.description}</p>

        {/* Location hint for physical missions */}
        {!isOnline && locationHint && step === 'idle' && (
          <p className="text-[#00ff80]/60 font-mono text-xs">📍 {locationHint}</p>
        )}

        {/* Stellar Quest special info */}
        {questAddress && step !== 'idle' && (
          <div className="bg-[#00ff80]/5 border border-[#00ff80]/20 rounded p-3 space-y-1">
            <p className="text-xs text-gray-400 font-mono">Send XLM to:</p>
            <p className="text-xs text-[#00ff80] font-mono break-all">{questAddress}</p>
            <p className="text-xs text-gray-400 font-mono mt-2">With memo:</p>
            <p className="text-sm text-white font-mono font-bold">{requiredMemo}</p>
          </div>
        )}

        {/* TX hash input — shown after start for online missions */}
        {isOnline && step === 'started' && (
          <div className="space-y-2">
            {actionUrl && (
              <a
                href={actionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#6c1b9e] hover:text-[#9b4dcf] text-sm font-mono transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
                {actionLabel || 'Open App'}
              </a>
            )}
            <p className="text-gray-400 text-xs font-mono">
              Complete the action, then paste your transaction hash below:
            </p>
            <Input
              placeholder="Transaction hash (e.g. abc123...)"
              value={txHash}
              onChange={e => setTxHash(e.target.value)}
              className="bg-black/50 border-[#00ff80]/30 text-white font-mono text-sm"
            />
          </div>
        )}

        {/* Error message */}
        {step === 'error' && (
          <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded p-3">
            <XCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
            <p className="text-red-400 text-xs font-mono">{verifyResult}</p>
          </div>
        )}

        {/* Reward + action button */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-[#00ff80]">
            <Zap className="h-4 w-4" />
            <span className="font-bold">{mission.reward} XP</span>
          </div>

          {step === 'idle' && (
            <Button
              onClick={handleStart}
              disabled={!publicKey || loading}
              className="bg-[#00ff80] hover:bg-[#00cc66] text-black font-bold"
            >
              {loading ? 'STARTING...' : 'START'}
            </Button>
          )}

          {step === 'started' && isOnline && (
            <Button
              onClick={handleVerifyTx}
              disabled={loading || !txHash.trim()}
              className="bg-[#6c1b9e] hover:bg-[#9b4dcf] text-white font-bold"
            >
              {loading ? 'VERIFYING...' : 'VERIFY TX'}
            </Button>
          )}

          {step === 'started' && !isOnline && (
            <Button
              onClick={handleVerifyLocation}
              disabled={loading}
              className="bg-[#00ff80] hover:bg-[#00cc66] text-black font-bold"
            >
              {loading ? 'CHECKING...' : 'VERIFY LOCATION'}
            </Button>
          )}

          {step === 'error' && (
            <Button
              onClick={() => { setStep('started'); setVerifyResult(''); }}
              variant="outline"
              className="border-[#00ff80]/30 text-[#00ff80] hover:bg-[#00ff80]/10"
            >
              TRY AGAIN
            </Button>
          )}

          {step === 'verifying' && (
            <Button disabled className="bg-gray-800 text-gray-400">
              VERIFYING...
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
