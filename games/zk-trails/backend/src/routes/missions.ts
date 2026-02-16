import { Router } from 'express';
import Mission from '../models/Mission';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const missions = await Mission.find();
    res.json(missions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch missions' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);
    if (!mission) return res.status(404).json({ error: 'Not found' });
    res.json(mission);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch mission' });
  }
});

export default router;
