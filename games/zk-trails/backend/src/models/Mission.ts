import mongoose from 'mongoose';

const MissionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  reward: { type: Number, default: 0 },
  zkProofRequired: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Mission', MissionSchema);
