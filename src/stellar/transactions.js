import * as StellarSdk from "@stellar/stellar-sdk";
import { signTxWithFreighter } from "./freighter";
import { HORIZON_URL, NETWORK_PASSPHRASE, VAULT_PUBLIC_KEY } from "../utils/constants";

/**
 * Builds, requests Freighter signature, and submits a stake transaction.
 * Sends XLM from user's account to the Vault public key.
 * 
 * @param {object} params
 * @param {string} params.fromKey - User's Stellar public key
 * @param {string} params.amount - Amount of XLM to stake
 * @param {string} params.sessionId - Unique ID of the session
 * @param {number} params.duration - Duration of the session in minutes
 * @returns {Promise<string>} The transaction hash on success
 */
export async function sendStake({ fromKey, amount, sessionId, duration }) {
  if (fromKey && fromKey.startsWith('GBMOCK')) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return "e8a719c8f2f98f6d2f3c7e7b6d5c5a4b3d2e1f0a9b8c7d6e5f4g3h2i1j0k9l8m";
  }
  if (!VAULT_PUBLIC_KEY) {
    throw new Error("Vault public key is not configured in environment variables.");
  }

  const server = new StellarSdk.Horizon.Server(HORIZON_URL);
  
  // Load user account details to get current sequence number
  let account;
  try {
    account = await server.loadAccount(fromKey);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error("Your account does not exist on Testnet. Please fund it first.");
    }
    throw new Error("Failed to load user account: " + (error.message || error));
  }

  const fee = await server.fetchBaseFee();

  // Create payment operation staking the XLM to the Vault wallet
  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: String(fee),
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(StellarSdk.Operation.payment({
      destination: VAULT_PUBLIC_KEY,
      asset: StellarSdk.Asset.native(),
      amount: String(amount),
    }))
    // Standard format for memo: FOCUS:sessionId:durationmin
    .addMemo(StellarSdk.Memo.text(`FOCUS:${sessionId}:${duration}min`))
    .setTimeout(180)
    .build();

  // Convert to XDR
  const xdr = tx.toXDR();

  // Request user's signature via Freighter wallet
  let signedXdr;
  try {
    signedXdr = await signTxWithFreighter(xdr, NETWORK_PASSPHRASE);
  } catch (err) {
    throw new Error("User rejected signing");
  }

  // Parse and submit the signed transaction
  const signedTx = StellarSdk.TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE);
  const result = await server.submitTransaction(signedTx);

  return result.hash;
}
