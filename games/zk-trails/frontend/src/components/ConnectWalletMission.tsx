import { Button } from '@/components/ui/button';
import { Wallet, CheckCircle2 } from 'lucide-react';

interface ConnectWalletMissionProps {
  isConnected: boolean;
  onComplete: () => void;
}

export function ConnectWalletMission({ isConnected, onComplete }: ConnectWalletMissionProps) {
  return (
    <div className="space-y-4">
      {isConnected ? (
        <>
          <div className="flex items-center gap-2 text-[#00ff80]">
            <CheckCircle2 className="h-5 w-5" />
            <span>Wallet Connected!</span>
          </div>
          <Button onClick={onComplete} className="w-full bg-[#00ff80] hover:bg-[#00cc66] text-black">
            Complete Mission
          </Button>
        </>
      ) : (
        <div className="text-gray-400">
          Connect your wallet to complete this mission
        </div>
      )}
    </div>
  );
}
