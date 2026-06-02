import { create } from 'zustand';
import { 
  isFreighterInstalled, 
  requestWalletAccess, 
  getConnectedPublicKey, 
  getConnectedNetwork 
} from '../stellar/freighter';
import { fetchAccountBalance } from '../stellar/horizon';
import { toast } from 'react-hot-toast';

export const useWalletStore = create((set, get) => ({
  publicKey: localStorage.getItem('wallet_public_key') || null,
  balance: localStorage.getItem('wallet_balance') || null,
  isConnected: localStorage.getItem('wallet_is_connected') === 'true',
  isConnecting: false,
  network: null,

  connect: async () => {
    if (get().isConnecting) return;
    set({ isConnecting: true });
    
    try {
      // Check if Freighter is installed/connected
      const hasFreighter = await isFreighterInstalled();
      console.log('[WalletStore] Freighter installed/connected:', hasFreighter);
      if (!hasFreighter) {
        toast.error('Please install Freighter wallet extension');
        set({ isConnecting: false });
        return;
      }

      // Request account access — v6 returns { address: string }
      const accessObj = await requestWalletAccess();
      console.log('[WalletStore] requestWalletAccess result:', accessObj);
      if (!accessObj || accessObj.error) {
        toast.error('Wallet connection rejected');
        set({ isConnecting: false });
        return;
      }

      // Get public key/address — v6 getAddress() returns { address: string }
      const pubKey = await getConnectedPublicKey();
      console.log('[WalletStore] Resolved public key:', pubKey);
      if (!pubKey) {
        toast.error('Failed to retrieve wallet public key');
        set({ isConnecting: false });
        return;
      }

      // Get network — v6 getNetwork() returns { network: string, networkPassphrase: string }
      // getConnectedNetwork() extracts and returns the network string
      let currentNetwork = 'UNKNOWN';
      try {
        currentNetwork = await getConnectedNetwork();
      } catch (err) {
        console.warn('[WalletStore] Failed to retrieve network:', err);
      }

      const expected = 'TESTNET';
      console.log('[WalletStore] Connected address:', pubKey);
      console.log('[WalletStore] Current network (from Freighter):', JSON.stringify(currentNetwork));
      console.log('[WalletStore] Expected network:', expected);
      console.log('[WalletStore] Network match:', currentNetwork === expected);

      if (currentNetwork !== expected) {
        toast.error(`Switch Freighter to Stellar Testnet (got: ${currentNetwork})`);
        set({ isConnecting: false, network: currentNetwork });
        return;
      }

      set({ 
        publicKey: pubKey, 
        isConnected: true, 
        isConnecting: false, 
        network: currentNetwork 
      });

      localStorage.setItem('wallet_public_key', pubKey);
      localStorage.setItem('wallet_is_connected', 'true');

      // Fetch balance
      await get().refreshBalance();
      
      toast.success('Wallet connected successfully!');
    } catch (error) {
      console.error('Freighter connection error:', error);
      toast.error('Failed to connect to Freighter: ' + (error.message || error));
      set({ isConnecting: false });
    }
  },

  disconnect: () => {
    set({ 
      publicKey: null, 
      balance: null, 
      isConnected: false, 
      isConnecting: false, 
      network: null 
    });
    localStorage.removeItem('wallet_public_key');
    localStorage.removeItem('wallet_is_connected');
    localStorage.removeItem('wallet_balance');
    toast.success('Wallet disconnected');
  },

  refreshBalance: async () => {
    const pubKey = get().publicKey;
    if (!pubKey) return;
    try {
      const balance = await fetchAccountBalance(pubKey);
      set({ balance });
      localStorage.setItem('wallet_balance', balance);
    } catch (error) {
      console.error('Error refreshing balance:', error);
      // If account doesn't exist on testnet yet
      if (error.status === 404) {
        set({ balance: '0.0000000' });
        localStorage.setItem('wallet_balance', '0.0000000');
        toast.error('Account not active. Send some testnet XLM using Friendbot.');
      } else {
        toast.error('Failed to refresh balance');
      }
    }
  }
}));
