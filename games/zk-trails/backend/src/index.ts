import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import zkRouter from './routes/zk';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    stellar: 'testnet'
  });
});

app.use('/api/zk', zkRouter);

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  console.log(`📡 Stellar Testnet Mode`);
  console.log(`🎮 ZK-Trails API Ready`);
});
