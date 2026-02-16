import express from 'express';
import Player from '../models/Player';

const router = express.Router();

// GET /api/players/:address - Get player
router.get('/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const player = await Player.findOne({ address });

    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    res.json({
      id: player._id,
      address: player.address,
      score: player.score,
      tier: player.tier,
      completedMissions: player.completedMissions,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch player' });
  }
});

// POST /api/players - Register new player
router.post('/', async (req, res) => {
  try {
    const { address } = req.body;

    const player = await Player.findOneAndUpdate(
      { address },
      { address },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      player: {
        id: player._id,
        address: player.address,
        score: player.score,
        tier: player.tier,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register player' });
  }
});

export default router;
