import { useWalletStore } from '../store/walletStore';

export function useWallet() {
  const store = useWalletStore();
  return {
    publicKey: store.publicKey,
    balance: store.balance,
    isConnected: store.isConnected,
    isConnecting: store.isConnecting,
    network: store.network,
    connect: store.connect,
    disconnect: store.disconnect,
    refreshBalance: store.refreshBalance,
  };
}
export default useWallet;
