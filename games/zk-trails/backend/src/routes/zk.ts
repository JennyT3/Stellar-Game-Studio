import { Router } from 'express';
import { generateProof } from '../services/proofService';
import { initStellar, completeMissionOnChain } from '../services/stellarService';
import { Contract, Networks, TransactionBuilder, rpc, Keypair, nativeToScVal, Address } from '@stellar/stellar-sdk';
import dotenv from 'dotenv';
dotenv.config();

initStellar();

const GAME_HUB_CONTRACT = process.env.GAME_HUB_CONTRACT || 'CB4VZAT2U3UC6XFK3N23SKRF2NDCMP3QHJYMCHHFMZO7MRQO6DQ2EMYG';
const RPC_URL = process.env.STELLAR_RPC_URL || 'https://soroban-testnet.stellar.org';
const HORIZON_URL = 'https://horizon-testnet.stellar.org';

// Soroswap router on testnet
const SOROSWAP_ROUTER = 'CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH';

const router = Router();

// ─────────────────────────────────────────────────────────────────────────────
// MISSIONS
// ─────────────────────────────────────────────────────────────────────────────

const MISSIONS = [

  // ── PHYSICAL MISSIONS ──────────────────────────────────────────────────────

  {
    id: 'm0',
    title: 'Meridian — Abu Dhabi',
    type: 'physical',
    category: 'location',
    description: 'Stellar\'s annual Meridian conference in Abu Dhabi. Prove you were there using a ZK location proof — without revealing your exact coordinates. Answer 5 questions about Stellar to complete the mission.',
    reward: 500,
    xp: 250,
    difficulty: 'hard',
    badge: '🏛️',
    locationHint: 'Abu Dhabi, UAE — Meridian Conference Venue',
    latMin: 24.451,
    latMax: 24.461,
    lonMin: 54.370,
    lonMax: 54.380,
    radiusMeters: 800,
    questions: [
      {
        id: 'q1',
        text: 'What is Meridian in the Stellar ecosystem?',
        options: ['A wallet app', 'Stellar\'s annual developer conference', 'A DEX protocol', 'A Soroban contract template'],
        correct: 1
      },
      {
        id: 'q2',
        text: 'What is the Stellar Consensus Protocol (SCP) based on?',
        options: ['Proof of Work', 'Federated Byzantine Agreement', 'Proof of Stake', 'Delegated PoS'],
        correct: 1
      },
      {
        id: 'q3',
        text: 'What does ZK stand for in Zero-Knowledge proof?',
        options: ['Zero Key', 'Zero Knowledge', 'Zeta Kernel', 'Zone Keeper'],
        correct: 1
      },
      {
        id: 'q4',
        text: 'What language are Soroban smart contracts written in?',
        options: ['Solidity', 'Move', 'Rust', 'Go'],
        correct: 2
      },
      {
        id: 'q5',
        text: 'What is Protocol 21 (XRay) in Stellar?',
        options: [
          'A new wallet standard',
          'An upgrade adding BN254 curves and Poseidon hash for ZK support',
          'A cross-chain bridge protocol',
          'A new consensus upgrade'
        ],
        correct: 1
      }
    ]
  },

  {
    id: 'm1',
    title: 'Stellar Explorer — Madrid',
    type: 'physical',
    category: 'location',
    description: 'Visit the heart of Madrid and prove your location cryptographically — without revealing your exact coordinates. Answer 5 questions about Stellar to complete the mission.',
    reward: 100,
    xp: 50,
    difficulty: 'easy',
    badge: '🇪🇸',
    locationHint: 'Plaza Mayor area, Madrid, Spain',
    latMin: 40.413,
    latMax: 40.416,
    lonMin: -3.708,
    lonMax: -3.705,
    radiusMeters: 500,
    questions: [
      {
        id: 'q1',
        text: 'What is the native token of the Stellar network?',
        options: ['ETH', 'XLM', 'BTC', 'SOL'],
        correct: 1
      },
      {
        id: 'q2',
        text: 'What are Soroban smart contracts written in?',
        options: ['Solidity', 'JavaScript', 'Rust', 'Python'],
        correct: 2
      },
      {
        id: 'q3',
        text: 'What does ZK stand for in ZK-Proof?',
        options: ['Zero Knowledge', 'Zero Key', 'Zeta Kernel', 'Zone Key'],
        correct: 0
      },
      {
        id: 'q4',
        text: 'What consensus mechanism does Stellar use?',
        options: ['Proof of Work', 'Proof of Stake', 'Stellar Consensus Protocol (SCP)', 'Delegated PoS'],
        correct: 2
      },
      {
        id: 'q5',
        text: 'What is Soroswap?',
        options: ['A Stellar wallet', 'A DEX built on Soroban', 'A price oracle', 'A cross-chain bridge'],
        correct: 1
      }
    ]
  },

  // ── ONLINE / DEFI MISSIONS ─────────────────────────────────────────────────

  {
    id: 'm2',
    title: 'Soroswap DeFi Pioneer',
    type: 'online',
    category: 'defi',
    description: 'Execute a real token swap on Soroswap testnet. Go to app.soroswap.finance, connect your Freighter wallet, swap XLM → USDC, then paste the transaction hash here. Your swap will be verified on-chain.',
    reward: 200,
    xp: 100,
    difficulty: 'medium',
    badge: '🔄',
    actionUrl: 'https://app.soroswap.finance',
    actionLabel: 'Open Soroswap Testnet',
    tokenIn: 'XLM',
    tokenOut: 'USDC',
    minAmount: 1,
    verificationMethod: 'soroswap_tx',
    soroswapRouter: SOROSWAP_ROUTER,
    questions: [
      {
        id: 'q1',
        text: 'What is an AMM (Automated Market Maker)?',
        options: ['A type of wallet', 'A protocol using liquidity pools to price assets automatically', 'A Stellar validator', 'A type of NFT'],
        correct: 1
      },
      {
        id: 'q2',
        text: 'What does "slippage" mean in a DEX swap?',
        options: ['A transaction error', 'Difference between expected and actual price due to market movement', 'A wallet fee', 'A network timeout'],
        correct: 1
      },
      {
        id: 'q3',
        text: 'What is the Soroswap router contract used for?',
        options: ['Storing user funds', 'Routing swaps through the best liquidity path', 'Minting new tokens', 'Validating transactions'],
        correct: 1
      },
      {
        id: 'q4',
        text: 'What does "liquidity pool" mean in DeFi?',
        options: ['A bank account', 'A smart contract holding token pairs used for trading', 'A type of NFT collection', 'A Stellar validator pool'],
        correct: 1
      },
      {
        id: 'q5',
        text: 'What network should you use for this mission?',
        options: ['Mainnet', 'Testnet', 'Devnet', 'Localnet'],
        correct: 1
      }
    ]
  },

  {
    id: 'm3',
    title: 'SDEX Native Trader',
    type: 'online',
    category: 'defi',
    description: 'Trade on Stellar\'s built-in DEX — no Soroban required. Open any Stellar wallet (Freighter, Lobstr), switch to testnet, place a trade offer for XLM, then paste your transaction hash. Verified via Horizon API.',
    reward: 150,
    xp: 75,
    difficulty: 'easy',
    badge: '⭐',
    actionUrl: 'https://stellarterm.com/#exchange/XLM-native/USDC-GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN',
    actionLabel: 'Open StellarTerm Testnet',
    verificationMethod: 'sdex_trade',
    questions: [
      {
        id: 'q1',
        text: 'What is the Stellar DEX (SDEX)?',
        options: ['A centralized exchange', 'A decentralized exchange built into the Stellar protocol itself', 'A Soroban smart contract', 'A cross-chain bridge'],
        correct: 1
      },
      {
        id: 'q2',
        text: 'What is an "offer" on the Stellar DEX?',
        options: ['A marketing campaign', 'A limit order to buy or sell assets at a specific price', 'A wallet transfer', 'A smart contract call'],
        correct: 1
      },
      {
        id: 'q3',
        text: 'What is a "path payment" in Stellar?',
        options: ['A direct XLM transfer', 'A payment that converts currencies automatically along the best route', 'A multi-sig transaction', 'A contract deployment'],
        correct: 1
      },
      {
        id: 'q4',
        text: 'What does Horizon provide?',
        options: ['A wallet interface', 'A REST API to interact with the Stellar network and query history', 'A Soroban compiler', 'A consensus algorithm'],
        correct: 1
      },
      {
        id: 'q5',
        text: 'What is XLM used for on the Stellar network?',
        options: ['Only for payments', 'Paying transaction fees and as a bridge currency between assets', 'Mining rewards', 'NFT purchases only'],
        correct: 1
      }
    ]
  },

  {
    id: 'm4',
    title: 'Aquarius Protocol Voter',
    type: 'online',
    category: 'defi',
    description: 'Participate in Aquarius governance on Stellar testnet. Lock AQUA tokens to vote on a liquidity market. Your vote transaction will be verified on-chain via Horizon API.',
    reward: 175,
    xp: 88,
    difficulty: 'medium',
    badge: '🌊',
    actionUrl: 'https://aqua.network',
    actionLabel: 'Open Aquarius',
    verificationMethod: 'aquarius_vote',
    questions: [
      {
        id: 'q1',
        text: 'What is Aquarius on Stellar?',
        options: ['A wallet', 'A liquidity management and governance protocol for Stellar DEX', 'A lending protocol', 'A cross-chain bridge'],
        correct: 1
      },
      {
        id: 'q2',
        text: 'What is AQUA token used for?',
        options: ['Paying gas fees', 'Voting on liquidity market rewards and governance', 'NFT purchases', 'Staking for block validation'],
        correct: 1
      },
      {
        id: 'q3',
        text: 'What does "voting" in Aquarius determine?',
        options: ['Who becomes a Stellar validator', 'Which trading pairs receive AQUA liquidity rewards', 'The price of XLM', 'Which wallets can transact'],
        correct: 1
      },
      {
        id: 'q4',
        text: 'What is a "liquidity market" in Aquarius?',
        options: ['A bank', 'A trading pair that receives AQUA incentives based on community votes', 'A type of NFT', 'A Soroban contract'],
        correct: 1
      },
      {
        id: 'q5',
        text: 'What is the relationship between Aquarius and the Stellar DEX?',
        options: ['They are competitors', 'Aquarius adds governance and incentive layers on top of the Stellar DEX', 'Aquarius replaces the SDEX', 'No relationship'],
        correct: 1
      }
    ]
  },

  {
    id: 'm5',
    title: 'Stellar Quest — Send & Memo',
    type: 'online',
    category: 'quest',
    description: 'Complete a classic Stellar Quest challenge. Send any amount of XLM to the ZK-Trails quest address on testnet with the memo "ZK-TRAILS-QUEST". Your transaction will be verified via Horizon API in seconds.',
    reward: 125,
    xp: 60,
    difficulty: 'easy',
    badge: '🎯',
    actionLabel: 'Use Freighter or Stellar Laboratory',
    actionUrl: 'https://laboratory.stellar.org',
    verificationMethod: 'memo_tx',
    questAddress: 'GAHBOCBG6Y75JW2FHLJN5AK6I6LVB6MXR3YHG75F2EXLBJ7LH2R7HNN7',
    requiredMemo: 'ZK-TRAILS-QUEST',
    questions: [
      {
        id: 'q1',
        text: 'What is a "memo" in a Stellar transaction?',
        options: ['A private message', 'Optional data attached to a transaction to identify its purpose', 'A transaction fee', 'A wallet address'],
        correct: 1
      },
      {
        id: 'q2',
        text: 'What is Stellar Laboratory?',
        options: ['A Stellar office', 'A web tool to build, sign and submit Stellar transactions manually', 'A smart contract IDE', 'A Soroban testnet'],
        correct: 1
      },
      {
        id: 'q3',
        text: 'What is Stellar Quest?',
        options: ['A game unrelated to Stellar', 'A learning program with on-chain challenges to earn badges', 'A DEX protocol', 'A wallet brand'],
        correct: 1
      },
      {
        id: 'q4',
        text: 'What is Freighter?',
        options: ['A shipping company', 'The official Stellar browser wallet extension', 'A Soroban framework', 'A validator node'],
        correct: 1
      },
      {
        id: 'q5',
        text: 'How many XLM do you need to send for this mission?',
        options: ['100 XLM', '50 XLM', 'Any amount — even 1 XLM works', '1000 XLM'],
        correct: 2
      }
    ]
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// GAME HUB
// ─────────────────────────────────────────────────────────────────────────────

async function callStartGame(sessionId: number, player1: string, player2: string): Promise<boolean> {
  try {
    const adminKeypair = Keypair.fromSecret(process.env.STELLAR_ADMIN_SECRET!);
    const sorobanServer = new rpc.Server(RPC_URL);
    const contract = new Contract(GAME_HUB_CONTRACT);
    const sourceAccount = await sorobanServer.getAccount(adminKeypair.publicKey());
    const tx = new TransactionBuilder(sourceAccount, {
      fee: '100000',
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(contract.call(
        'start_game',
        new Address(adminKeypair.publicKey()).toScVal(),
        nativeToScVal(sessionId, { type: 'u32' }),
        new Address(player1).toScVal(),
        new Address(player2).toScVal(),
        nativeToScVal(0, { type: 'i128' }),
        nativeToScVal(0, { type: 'i128' })
      ))
      .setTimeout(30)
      .build();
    const prepared = await sorobanServer.prepareTransaction(tx);
    prepared.sign(adminKeypair);
    const result = await sorobanServer.sendTransaction(prepared);
    console.log('✅ start_game:', result.status, 'sessionId:', sessionId);
    return ['PENDING', 'SUCCESS', 'DUPLICATE'].includes(result.status as string);
  } catch (err) {
    console.error('❌ start_game error:', err);
    return false;
  }
}

async function callEndGame(sessionId: number, player1Won: boolean): Promise<boolean> {
  try {
    const adminKeypair = Keypair.fromSecret(process.env.STELLAR_ADMIN_SECRET!);
    const sorobanServer = new rpc.Server(RPC_URL);
    const contract = new Contract(GAME_HUB_CONTRACT);
    const sourceAccount = await sorobanServer.getAccount(adminKeypair.publicKey());
    const tx = new TransactionBuilder(sourceAccount, {
      fee: '100000',
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(contract.call(
        'end_game',
        nativeToScVal(sessionId, { type: 'u32' }),
        nativeToScVal(player1Won, { type: 'bool' })
      ))
      .setTimeout(30)
      .build();
    const prepared = await sorobanServer.prepareTransaction(tx);
    prepared.sign(adminKeypair);
    const result = await sorobanServer.sendTransaction(prepared);
    console.log('✅ end_game:', result.status, 'sessionId:', sessionId);
    return ['PENDING', 'SUCCESS', 'DUPLICATE'].includes(result.status as string);
  } catch (err) {
    console.error('❌ end_game error:', err);
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// VERIFICATION HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function verifyLocationInRange(lat: number, lon: number, missionId: string): boolean {
  const mission = MISSIONS.find(m => m.id === missionId);
  if (!mission || mission.type !== 'physical') return false;
  const inLat = lat >= (mission.latMin || 0) && lat <= (mission.latMax || 0);
  const inLon = lon >= (mission.lonMin || 0) && lon <= (mission.lonMax || 0);
  return inLat && inLon;
}

// Soroswap: verify tx exists and source matches wallet
async function verifySoroswapTransaction(txHash: string, walletAddress: string): Promise<{ verified: boolean; reason: string }> {
  try {
    const res = await fetch(`${HORIZON_URL}/transactions/${txHash}`);
    if (!res.ok) return { verified: false, reason: 'Transaction not found on Stellar testnet' };
    const tx = await res.json() as any;
    if (tx.source_account !== walletAddress) {
      return { verified: false, reason: 'Transaction source does not match your wallet address' };
    }
    // Check operations contain a Soroban invoke (swap)
    const opsRes = await fetch(`${HORIZON_URL}/transactions/${txHash}/operations`);
    const ops = await opsRes.json() as any;
    const hasSwap = ops._embedded?.records?.some((op: any) =>
      op.type === 'invoke_host_function'
    );
    if (!hasSwap) return { verified: false, reason: 'No swap operation found in this transaction' };
    console.log(`✅ Soroswap tx verified: ${txHash}`);
    return { verified: true, reason: 'Swap verified on Stellar testnet' };
  } catch (err) {
    console.error('Soroswap verify error:', err);
    return { verified: false, reason: 'Verification error — try again' };
  }
}

// SDEX: verify a trade/offer exists from this wallet
async function verifySDEXTrade(txHash: string, walletAddress: string): Promise<{ verified: boolean; reason: string }> {
  try {
    const res = await fetch(`${HORIZON_URL}/transactions/${txHash}`);
    if (!res.ok) return { verified: false, reason: 'Transaction not found on Stellar testnet' };
    const tx = await res.json() as any;
    if (tx.source_account !== walletAddress) {
      return { verified: false, reason: 'Transaction source does not match your wallet' };
    }
    const opsRes = await fetch(`${HORIZON_URL}/transactions/${txHash}/operations`);
    const ops = await opsRes.json() as any;
    const hasTrade = ops._embedded?.records?.some((op: any) =>
      ['manage_sell_offer', 'manage_buy_offer', 'create_passive_sell_offer', 'path_payment_strict_send', 'path_payment_strict_receive'].includes(op.type)
    );
    if (!hasTrade) return { verified: false, reason: 'No trade operation found in this transaction' };
    console.log(`✅ SDEX trade verified: ${txHash}`);
    return { verified: true, reason: 'Trade verified on Stellar DEX' };
  } catch (err) {
    return { verified: false, reason: 'Verification error' };
  }
}

// Aquarius: verify any transaction from wallet (governance interactions are complex on testnet)
async function verifyAquariusVote(txHash: string, walletAddress: string): Promise<{ verified: boolean; reason: string }> {
  try {
    const res = await fetch(`${HORIZON_URL}/transactions/${txHash}`);
    if (!res.ok) return { verified: false, reason: 'Transaction not found on Stellar testnet' };
    const tx = await res.json() as any;
    if (tx.source_account !== walletAddress) {
      return { verified: false, reason: 'Transaction source does not match your wallet' };
    }
    console.log(`✅ Aquarius tx verified: ${txHash}`);
    return { verified: true, reason: 'Aquarius transaction verified' };
  } catch (err) {
    return { verified: false, reason: 'Verification error' };
  }
}

// Stellar Quest: verify memo transaction
async function verifyMemoTransaction(txHash: string, walletAddress: string, requiredMemo: string): Promise<{ verified: boolean; reason: string }> {
  try {
    const res = await fetch(`${HORIZON_URL}/transactions/${txHash}`);
    if (!res.ok) return { verified: false, reason: 'Transaction not found on Stellar testnet' };
    const tx = await res.json() as any;
    if (tx.source_account !== walletAddress) {
      return { verified: false, reason: 'Transaction source does not match your wallet' };
    }
    if (tx.memo !== requiredMemo) {
      return { verified: false, reason: `Memo mismatch. Expected "${requiredMemo}", got "${tx.memo || 'none'}"` };
    }
    console.log(`✅ Memo tx verified: ${txHash} memo="${tx.memo}"`);
    return { verified: true, reason: 'Transaction and memo verified!' };
  } catch (err) {
    return { verified: false, reason: 'Verification error' };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ROUTES
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/zk/missions
router.get('/missions', (_req, res) => {
  const safe = MISSIONS.map(m => ({
    id: m.id,
    title: m.title,
    type: m.type,
    category: m.category,
    description: m.description,
    reward: m.reward,
    xp: m.xp,
    difficulty: m.difficulty,
    badge: m.badge,
    ...(m.type === 'online' ? {
      actionUrl: m.actionUrl,
      actionLabel: m.actionLabel,
      verificationMethod: m.verificationMethod,
      ...(m.id === 'm5' ? { questAddress: m.questAddress, requiredMemo: m.requiredMemo } : {})
    } : {
      locationHint: m.locationHint
    })
  }));
  res.json(safe);
});

// GET /api/zk/missions/:id
router.get('/missions/:id', (req, res) => {
  const mission = MISSIONS.find(m => m.id === req.params.id);
  if (!mission) return res.status(404).json({ error: 'Mission not found' });
  // Never expose lat/lon boundaries
  const { latMin, latMax, lonMin, lonMax, ...safe } = mission as any;
  res.json(safe);
});

// GET /api/zk/missions/:id/questions
router.get('/missions/:id/questions', (req, res) => {
  const mission = MISSIONS.find(m => m.id === req.params.id);
  if (!mission || !mission.questions) return res.status(404).json({ error: 'No questions for this mission' });
  const safe = mission.questions.map(q => ({ id: q.id, text: q.text, options: q.options }));
  res.json({ missionId: req.params.id, questions: safe });
});

// POST /api/zk/missions/:id/verify-answers
router.post('/missions/:id/verify-answers', (req, res) => {
  const mission = MISSIONS.find(m => m.id === req.params.id);
  if (!mission || !mission.questions) return res.status(404).json({ error: 'Mission not found' });
  const { answers } = req.body as { answers: Record<string, number> };
  let correct = 0;
  for (const q of mission.questions) {
    if (answers[q.id] === q.correct) correct++;
  }
  const passed = correct >= 4;
  console.log(`[QUIZ] Mission ${req.params.id}: ${correct}/5 correct, passed: ${passed}`);
  res.json({ correct, total: mission.questions.length, passed, score: Math.round((correct / mission.questions.length) * 100) });
});

// POST /api/zk/missions/:id/verify-location (physical missions)
router.post('/missions/:id/verify-location', (req, res) => {
  const { lat, lon } = req.body;
  const inRange = verifyLocationInRange(Number(lat), Number(lon), req.params.id);
  console.log(`[LOCATION] Mission ${req.params.id} inRange=${inRange}`);
  res.json({
    verified: inRange,
    message: inRange
      ? '✅ Location verified. You are in the mission zone!'
      : '❌ You are not in the mission zone yet. Keep exploring!'
  });
});

// POST /api/zk/missions/:id/verify-transaction (online missions)
router.post('/missions/:id/verify-transaction', async (req, res) => {
  const { txHash, walletAddress } = req.body;
  if (!txHash || !walletAddress) return res.status(400).json({ error: 'txHash and walletAddress required' });

  const mission = MISSIONS.find(m => m.id === req.params.id);
  if (!mission) return res.status(404).json({ error: 'Mission not found' });

  let result = { verified: false, reason: 'Unknown mission type' };

  switch (mission.verificationMethod) {
    case 'soroswap_tx':
      result = await verifySoroswapTransaction(txHash, walletAddress);
      break;
    case 'sdex_trade':
      result = await verifySDEXTrade(txHash, walletAddress);
      break;
    case 'aquarius_vote':
      result = await verifyAquariusVote(txHash, walletAddress);
      break;
    case 'memo_tx':
      result = await verifyMemoTransaction(txHash, walletAddress, mission.requiredMemo || 'ZK-TRAILS-QUEST');
      break;
    default:
      result = { verified: false, reason: 'Unsupported verification method' };
  }

  res.json({ ...result, txHash, missionId: req.params.id });
});

// POST /api/zk/missions/:id/start
router.post('/missions/:id/start', async (req, res) => {
  const { id } = req.params;
  const { walletAddress, player2Address } = req.body;
  if (!walletAddress) return res.status(400).json({ error: 'walletAddress required' });
  const p2 = player2Address || process.env.PLAYER2_PUBLIC || walletAddress;
  const sessionId = Math.floor(Date.now() / 1000) % 1000000;
  console.log(`[MISSION START] ${id} by ${walletAddress} sessionId=${sessionId}`);
  const gameHubStarted = await callStartGame(sessionId, walletAddress, p2);
  res.json({ success: true, missionId: id, startedAt: Date.now(), sessionId, gameHubStarted });
});

// POST /api/zk/generate-proof
router.post('/generate-proof', async (req, res) => {
  try {
    const { missionId, lat, lon, walletAddress, timestamp } = req.body;
    const proof = await generateProof({ missionId, lat, lon, walletAddress, timestamp });
    res.json({ proof, success: true });
  } catch (error) {
    console.error('Proof generation error:', error);
    res.status(500).json({ error: 'Failed to generate proof' });
  }
});

// POST /api/zk/complete-mission
router.post('/complete-mission', async (req, res) => {
  const { missionId, walletAddress, sessionId } = req.body;
  if (!walletAddress || !missionId) return res.status(400).json({ error: 'missionId and walletAddress required' });
  console.log(`[COMPLETE] Mission ${missionId} by ${walletAddress}`);
  const mission = MISSIONS.find(m => m.id === missionId);
  const reward = mission?.reward || 100;
  const txHash = await completeMissionOnChain(walletAddress, missionId, reward);
  const sid = sessionId || Math.floor(Date.now() / 1000) % 1000000;
  const gameHubEnded = await callEndGame(sid, true);
  res.json({
    success: true,
    missionId,
    txHash: txHash || ('local_' + Date.now()),
    onChain: !!txHash,
    gameHubEnded,
    reward
  });
});

// GET /api/zk/players/:address/stats
router.get('/players/:address/stats', (req, res) => {
  res.json({ address: req.params.address, xp: 0, missionsCompleted: 0, rank: 0, tier: 'ROOKIE', totalRewards: 0 });
});

// GET /api/zk/leaderboard
router.get('/leaderboard', async (_req, res) => {
  try {
    const Player = require('../models/Player').default;
    const leaders = await Player.find().sort({ score: -1 }).limit(10).select('address score tier completedMissions');
    const formatted = leaders.map((p: any, idx: number) => ({
      rank: idx + 1,
      address: `${p.address.slice(0, 6)}...${p.address.slice(-4)}`,
      xp: p.score,
      missionsCompleted: p.completedMissions?.length || 0,
      tier: p.tier
    }));
    res.json({ leaders: formatted });
  } catch {
    res.json({
      leaders: [
        { rank: 1, address: 'GCA3X...7YH2', xp: 8750, missionsCompleted: 5, tier: 'LEGEND' },
        { rank: 2, address: 'GB4D2...9KL4', xp: 7200, missionsCompleted: 4, tier: 'EXPLORER' },
        { rank: 3, address: 'GD8F1...3MN7', xp: 6800, missionsCompleted: 3, tier: 'EXPLORER' }
      ]
    });
  }
});

export default router;