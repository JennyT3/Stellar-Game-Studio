import { Router } from 'express';
const router = Router();

router.get('/:address', (req, res) => {
  const { address } = req.params;
  res.json({
    address,
    xp: 0,
    missionsCompleted: 0,
    rank: 0,
    tier: 'ROOKIE',
    totalRewards: 0
  });
});

export default router;
