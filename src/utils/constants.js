export const HORIZON_URL = import.meta.env.VITE_HORIZON_URL || 'https://horizon-testnet.stellar.org';
export const NETWORK_PASSPHRASE = import.meta.env.VITE_NETWORK_PASSPHRASE || 'Test SDF Network ; September 2015';
export const VAULT_PUBLIC_KEY = import.meta.env.VITE_VAULT_PUBLIC_KEY;
export const VAULT_SECRET_KEY = import.meta.env.VITE_VAULT_SECRET_KEY;

export const DURATIONS = [
  { label: '25 Min', value: 25 },
  { label: '45 Min', value: 45 },
  { label: '60 Min', value: 60 },
];

export const MIN_STAKE = 1.0; // Min 1 XLM
export const STELLAR_EXPERT_TX_URL = 'https://stellar.expert/explorer/testnet/tx';
export const STELLAR_EXPERT_ACCOUNT_URL = 'https://stellar.expert/explorer/testnet/account';
