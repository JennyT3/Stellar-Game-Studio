import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import missionsRouter from './routes/missions';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware CRÍTICO - debe ir antes de las rutas
app.use(cors());
app.use(express.json()); // ← ESTO ES LO QUE FALTABA

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    stellar: 'testnet',
    contracts: {
      missionManager: process.env.MISSION_MANAGER_CONTRACT || 'CAVJDRD...',
      zkVerifier: process.env.ZK_VERIFIER_CONTRACT || 'CCU3OVH...'
    }
  });
});

// Routes
app.use('/api/missions', missionsRouter);

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  console.log(`📡 Stellar Testnet Mode`);
  console.log(`🎮 ZK-Trails API Ready`);
});

process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('💥 Unhandled Rejection:', err);
});
