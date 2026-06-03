import * as StellarSdk from '@stellar/stellar-sdk';
import { HORIZON_URL } from '../utils/constants';

/**
 * Fetches the native (XLM) balance for a given Stellar public key.
 * If the account does not exist, returns '0.0000000'.
 */
export async function fetchAccountBalance(publicKey) {
  if (!publicKey) return '0.0000000';
  if (publicKey.startsWith('GBMOCK')) {
    return '12345.6789000';
  }
  const server = new StellarSdk.Horizon.Server(HORIZON_URL);
  try {
    const account = await server.loadAccount(publicKey);
    const nativeBalance = account.balances.find(b => b.asset_type === 'native');
    return nativeBalance ? nativeBalance.balance : '0.0000000';
  } catch (error) {
    // 404 means the account has not been created yet on the ledger
    if (error.response && error.response.status === 404) {
      return '0.0000000';
    }
    // Check standard javascript status
    if (error.status === 404) {
      return '0.0000000';
    }
    throw error;
  }
}

/**
 * Checks if an account exists on Testnet, and if not, attempts to fund it using Friendbot.
 */
export async function checkOrCreateAccount(publicKey) {
  const balance = await fetchAccountBalance(publicKey);
  if (balance === '0.0000000') {
    try {
      const url = `https://friendbot.stellar.org/?addr=${publicKey}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Friendbot HTTP error! status: ${response.status}`);
      }
      // Wait for ledger consolidation
      await new Promise(resolve => setTimeout(resolve, 2000));
      return await fetchAccountBalance(publicKey);
    } catch (err) {
      console.error(`Failed to auto-fund account ${publicKey}:`, err);
      return '0.0000000';
    }
  }
  return balance;
}
