import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Loader2, CheckCircle2 } from 'lucide-react';

interface LocationMissionProps {
  targetLocation: { lat: number; lon: number };
  onComplete: (location: { lat: number; lon: number }, proof: string) => void;
}

export function LocationMission({ targetLocation, onComplete }: LocationMissionProps) {
  const [location, setLocation] = useState<{lat: number; lon: number} | null>(null);
  const [proof, setProof] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getLocation = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
        setLoading(false);
      },
      (error) => {
        console.error('Location error:', error);
        setLoading(false);
      }
    );
  };

  const generateProof = async () => {
    if (!location) return;
    setLoading(true);
    // TODO: Generate actual ZK proof with location
    await new Promise(resolve => setTimeout(resolve, 2000));
    const mockProof = "0x" + Array(64).fill(0).map(() => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    setProof(mockProof);
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="bg-black/40 p-4 rounded border border-[#00ff80]/20">
        <p className="text-sm text-gray-400 mb-2">Target Area:</p>
        <p className="font-mono text-xs text-[#00ff80]">
          {targetLocation.lat.toFixed(4)}°N, {Math.abs(targetLocation.lon).toFixed(4)}°W
        </p>
        <p className="text-xs text-gray-500 mt-1">Radius: 500m</p>
      </div>

      {!location ? (
        <Button 
          onClick={getLocation} 
          disabled={loading}
          className="w-full bg-[#00ff80] hover:bg-[#00cc66] text-black"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Getting Location...
            </>
          ) : (
            <>
              <MapPin className="h-4 w-4 mr-2" />
              Get My Location
            </>
          )}
        </Button>
      ) : !proof ? (
        <>
          <div className="flex items-center gap-2 text-[#00ff80]">
            <CheckCircle2 className="h-5 w-5" />
            <span className="text-sm">Location Obtained</span>
          </div>
          <Button 
            onClick={generateProof} 
            disabled={loading}
            className="w-full bg-[#00ff80] hover:bg-[#00cc66] text-black"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating ZK Proof...
              </>
            ) : (
              'Generate Proof'
            )}
          </Button>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2 text-[#00ff80]">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-mono text-xs">Proof Ready</span>
          </div>
          <Button 
            onClick={() => onComplete(location, proof)} 
            className="w-full bg-[#00ff80] hover:bg-[#00cc66] text-black"
          >
            Submit Mission
          </Button>
        </>
      )}
    </div>
  );
}
