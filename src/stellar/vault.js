import * as StellarSdk from "@stellar/stellar-sdk";
import { HORIZON_URL, NETWORK_PASSPHRASE, VAULT_SECRET_KEY } from "../utils/constants";
import { checkOrCreateAccount } from "./horizon";

/**
 * Builds, signs server-side (using vault secret key in env), and submits a return transaction.
 * Sends the staked XLM back from the Vault wallet to the User's public key.
 * 
 * @param {object} params
 * @param {string} params.toKey - User's Stellar public key to receive the returned stake
 * @param {string} params.amount - The staked XLM amount to return
 * @param {string} params.sessionId - Unique ID of the session
 * @returns {Promise<string>} The transaction hash on success
 */
export async function sendReturn({ toKey, amount, sessionId }) {
  if (toKey && toKey.startsWith('GBMOCK')) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return "f8b719c8f2f98f6d2f3c7e7b6d5c5a4b3d2e1f0a9b8c7d6e5f4g3h2i1j0k9l9n";
  }
  if (!VAULT_SECRET_KEY) {
    throw new Error("Vault secret key is not configured in environment variables.");
  }

  const vaultKeypair = StellarSdk.Keypair.fromSecret(VAULT_SECRET_KEY);
  const vaultPublicKey = vaultKeypair.publicKey();

  // Ensure Vault account is active on Testnet before loading it
  await checkOrCreateAccount(vaultPublicKey);

  const server = new StellarSdk.Horizon.Server(HORIZON_URL);
  
  let account;
  try {
    account = await server.loadAccount(vaultPublicKey);
  } catch (error) {
    throw new Error("Failed to load Vault account: " + (error.message || error));
  }

  const fee = await server.fetchBaseFee();

  // Create payment operation returning the XLM to the user
  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: String(fee),
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(StellarSdk.Operation.payment({
      destination: toKey,
      asset: StellarSdk.Asset.native(),
      amount: String(amount),
    }))
    .addMemo(StellarSdk.Memo.text(`RETURN:${sessionId}`))
    .setTimeout(180)
    .build();

  // Sign transaction with vault's keypair
  tx.sign(vaultKeypair);

  // Submit to Horizon
  const result = await server.submitTransaction(tx);
  
  return result.hash;
}
