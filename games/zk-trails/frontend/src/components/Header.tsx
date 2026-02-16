import { useWallet } from '@/hooks/use-wallet';
import { Button } from '@/components/ui/button';
import { Rocket, Wallet, LogOut, Trophy } from 'lucide-react';
import { Link } from 'wouter';

export function Header() {
  const { address, isLoading, isConnected, connect, disconnect } = useWallet();

  const formatAddress = (addr: string | null) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#6c1b9e]/30 bg-[#0a0a0a]/90 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative">
            <div className="absolute inset-0 rounded-lg bg-[#00ff80] blur-lg opacity-50" />
            <Rocket className="relative h-8 w-8 text-[#00ff80]" />
          </div>
          <span className="text-xl font-bold font-display text-white">
            ZK<span className="text-[#00ff80]">TRAILS</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {isConnected && address ? (
            <>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#6c1b9e]/20 border border-[#6c1b9e]/50">
                <Trophy className="h-4 w-4 text-[#00ff80]" />
                <span className="text-sm text-white font-mono">{formatAddress(address)}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={disconnect}
                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Disconnect
              </Button>
            </>
          ) : (
            <Button
              onClick={connect}
              disabled={isLoading}
              className="bg-[#00ff80] hover:bg-[#00cc66] text-black font-bold border-0"
            >
              <Wallet className="h-4 w-4 mr-2" />
              {isLoading ? 'Connecting...' : 'Connect Wallet'}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
