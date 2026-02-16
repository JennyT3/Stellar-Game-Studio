import mongoose from 'mongoose';

const PlayerSchema = new mongoose.Schema({
  address: { type: String, required: true, unique: true },
  score: { type: Number, default: 0 },
  tier: { type: String, enum: ['ROOKIE', 'ADVENTURER', 'EXPLORER', 'LEGEND'], default: 'ROOKIE' },
  completedMissions: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Player', PlayerSchema);
