# ZK-Trails Backend

Node.js API for ZK-Trails game.

## Setup

```bash
cp .env.example .env
bun install
```

Edit `.env` with your MongoDB URI.

## Run

```bash
bun run dev
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| PORT | Server port |
| MONGODB_URI | MongoDB connection string |
| STELLAR_NETWORK | testnet or mainnet |
