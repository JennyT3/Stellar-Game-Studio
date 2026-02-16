import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2 } from 'lucide-react';

interface ZKProofMissionProps {
  onComplete: (proof: string) => void;
}

export function ZKProofMission({ onComplete }: ZKProofMissionProps) {
  const [proof, setProof] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const generateProof = async () => {
    setGenerating(true);
    // TODO: Implement actual ZK proof generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    const mockProof = "0x" + Array(64).fill(0).map(() => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    setProof(mockProof);
    setGenerating(false);
  };

  return (
    <div className="space-y-4">
      {!proof ? (
        <Button 
          onClick={generateProof} 
          disabled={generating}
          className="w-full bg-[#00ff80] hover:bg-[#00cc66] text-black"
        >
          {generating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating Proof...
            </>
          ) : (
            'Generate ZK Proof'
          )}
        </Button>
      ) : (
        <>
          <div className="flex items-center gap-2 text-[#00ff80]">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-mono text-xs">Proof Generated</span>
          </div>
          <div className="bg-black/40 p-3 rounded border border-[#00ff80]/20">
            <p className="font-mono text-xs text-gray-400 break-all">{proof.slice(0, 32)}...</p>
          </div>
          <Button 
            onClick={() => onComplete(proof)} 
            className="w-full bg-[#00ff80] hover:bg-[#00cc66] text-black"
          >
            Submit Proof
          </Button>
        </>
      )}
    </div>
  );
}
