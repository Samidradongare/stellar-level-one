import { useEffect } from 'react';
import { useWalletStore } from '../store/walletStore';

export function useBalance() {
  const { balance, refreshBalance, isConnected, publicKey } = useWalletStore();

  useEffect(() => {
    if (isConnected && publicKey) {
      refreshBalance();
    }
  }, [isConnected, publicKey, refreshBalance]);

  return { balance, refreshBalance };
}
export default useBalance;
