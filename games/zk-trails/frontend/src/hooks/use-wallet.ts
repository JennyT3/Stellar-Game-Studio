import { useState, useCallback } from 'react';
import {
  WalletNetwork,
  allowAllModules,
  StellarWalletsKit,
  ISupportedWallet,
} from '@creit.tech/stellar-wallets-kit';

const kit = new StellarWalletsKit({
  network: WalletNetwork.TESTNET,
  selectedWalletId: undefined,
  modules: allowAllModules(),
});

export function useWallet() {
  const [address, setAddress] = useState<string | null>(() => {
    return localStorage.getItem('stellar-wallet');
  });
  const [isConnected, setIsConnected] = useState(() => {
    return !!localStorage.getItem('stellar-wallet');
  });
  const [isLoading, setIsLoading] = useState(false);

  const connect = useCallback(async () => {
    setIsLoading(true);
    try {
      await kit.openModal({
        onWalletSelected: async (option: ISupportedWallet) => {
          kit.setWallet(option.id);
          const { address: addr } = await kit.getAddress();
          setAddress(addr);
          setIsConnected(true);
          localStorage.setItem('stellar-wallet', addr);
        },
      });
    } catch (error) {
      console.error("Connection error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    localStorage.removeItem('stellar-wallet');
    setAddress(null);
    setIsConnected(false);
    window.location.reload();
  }, []);

  return { address, isConnected, isLoading, connect, disconnect, kit };
}
