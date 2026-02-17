import { Router } from 'express';
import { MISSIONS, MISSION_ZONES } from '../config/missions';
import { generateLocationProof } from '../services/zkProof';

const router = Router();

// GET /api/zk/missions - Returns available missions
router.get('/missions', (req, res) => {
  const missions = MISSIONS.map(m => ({
    id: m.id,
    name: m.name,
    type: m.type,
    description: m.description,
    reward: m.reward,
    xp: m.xp,
    boundaries: m.type === 'physical' ? {
      latMin: (m.latMin || 0) / 1000000,
      latMax: (m.latMax || 0) / 1000000,
      lonMin: (m.lonMin || 0) / 1000000,
      lonMax: (m.lonMax || 0) / 1000000
    } : undefined,
    requirements: m.type === 'online' ? {
      contract: m.contractAddress,
      minAmount: m.minAmount,
      tokenIn: m.tokenIn,
      tokenOut: m.tokenOut
    } : undefined
  }));

  res.json({ missions });
});

// POST /api/zk/generate-proof - Generate ZK proof for physical missions
router.post('/generate-proof', async (req, res) => {
  try {
    const { lat, lon, missionId, walletAddress } = req.body;
    
    console.log(`[ZK API] Mission: ${missionId}`);
    console.log(`[ZK API] User: ${lat}, ${lon}`);
    console.log(`[ZK API] Wallet: ${walletAddress}`);

    // Validate inputs
    if (!lat || !lon || !missionId || !walletAddress) {
      return res.status(400).json({ 
        error: 'Missing required fields: lat, lon, missionId, walletAddress' 
      });
    }

    // Get mission zone
    const zone = MISSION_ZONES[missionId];
    if (!zone) {
      return res.status(404).json({ error: 'Mission not found' });
    }

    // Check if mission is physical
    const mission = MISSIONS.find(m => m.id === missionId);
    if (!mission || mission.type !== 'physical') {
      return res.status(400).json({ error: 'Invalid mission type for this endpoint' });
    }

    // Current timestamp
    const currentTime = Math.floor(Date.now() / 1000);
    const userTime = currentTime - 60; // 1 minute ago (simulated)

    // Generate proof
    const result = await generateLocationProof({
      userLat: lat,
      userLon: lon,
      userTime,
      zoneLatMin: zone.latMin / 1000000,
      zoneLatMax: zone.latMax / 1000000,
      zoneLonMin: zone.lonMin / 1000000,
      zoneLonMax: zone.lonMax / 1000000,
      currentTime,
      maxAge: zone.maxAge
    }, missionId);

    res.json({
      success: true,
      proof: result.proof,
      publicInputs: result.publicInputs,
      missionId,
      walletAddress,
      timestamp: currentTime
    });

  } catch (error: any) {
    console.error('[ZK API Error]:', error);
    res.status(500).json({
      error: 'Proof generation failed',
      details: error.message
    });
  }
});

// GET /api/zk/status - Check ZK engine status
router.get('/status', async (req, res) => {
  try {
    const { exec } = require('child_process');
    const { promisify } = require('util');
    const execAsync = promisify(exec);
    
    let nargoVersion = 'unknown';
    let bbVersion = 'unknown';
    
    try {
      const { stdout: nargoOut } = await execAsync('nargo --version');
      nargoVersion = nargoOut.trim();
    } catch (e) {
      nargoVersion = 'not installed';
    }
    
    try {
      const { stdout: bbOut } = await execAsync('/Users/jennytejedor/.bb/bin/bb --version');
      bbVersion = bbOut.trim();
    } catch (e) {
      bbVersion = 'not installed';
    }
    
    res.json({
      status: 'operational',
      engine: 'UltraHonk via Barretenberg',
      nargo: nargoVersion,
      barretenberg: bbVersion,
      circuits: ['location_proof'],
      missionsAvailable: MISSIONS.length
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
