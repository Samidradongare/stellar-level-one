import freighterApi from "@stellar/freighter-api";

const {
  getAddress,
  isConnected,
  signTransaction,
  requestAccess,
  getNetwork,
  isAllowed,
} = freighterApi;

/**
 * Checks if the Freighter wallet extension is installed and accessible in the browser.
 * In v6, isConnected() returns { isConnected: boolean }
 */
export async function isFreighterInstalled() {
  try {
    const result = await isConnected();
    // v6 returns an object: { isConnected: boolean }
    if (typeof result === "object" && result !== null && "isConnected" in result) {
      return result.isConnected;
    }
    // Fallback for older API versions that returned a boolean directly
    return Boolean(result);
  } catch (error) {
    console.error("Error checking Freighter connection:", error);
    return false;
  }
}

/**
 * Requests access to the user's Freighter wallet.
 * In v6, requestAccess() returns { address: string, error?: FreighterApiError }
 */
export async function requestWalletAccess() {
  try {
    const result = await requestAccess();
    console.log("[Freighter] requestAccess() raw result:", result);

    if (result && result.error) {
      throw new Error(
        typeof result.error === "object" ? result.error.message || JSON.stringify(result.error) : result.error
      );
    }
    return result;
  } catch (error) {
    console.error("Error requesting wallet access:", error);
    throw error;
  }
}

/**
 * Retrieves the wallet's Stellar public key/address from Freighter.
 * In v6, getAddress() returns { address: string, error?: FreighterApiError }
 * NOT just a plain string.
 */
export async function getConnectedPublicKey() {
  try {
    const result = await getAddress();
    console.log("[Freighter] getAddress() raw result:", result);

    if (result && result.error) {
      throw new Error(
        typeof result.error === "object" ? result.error.message || JSON.stringify(result.error) : result.error
      );
    }

    // v6 returns { address: "G..." } - extract the address string
    const address = result?.address || null;
    console.log("[Freighter] Resolved address:", address);
    return address;
  } catch (error) {
    console.error("Error getting public key/address:", error);
    throw error;
  }
}

/**
 * Gets the network the Freighter wallet is connected to.
 * In v6, getNetwork() returns { network: string, networkPassphrase: string, error?: ... }
 * NOT just a plain string.
 * 
 * @returns {Promise<string>} The network name string e.g. "TESTNET" or "PUBLIC"
 */
export async function getConnectedNetwork() {
  try {
    const result = await getNetwork();
    console.log("[Freighter] getNetwork() raw result:", result);

    if (result && result.error) {
      console.warn("[Freighter] getNetwork returned an error:", result.error);
    }

    // v6 returns { network: "TESTNET", networkPassphrase: "..." }
    // Extract the network string field
    let networkStr;
    if (typeof result === "object" && result !== null && "network" in result) {
      networkStr = result.network;
    } else if (typeof result === "string") {
      // Older API returned plain strings — handle gracefully
      networkStr = result;
    } else {
      networkStr = "UNKNOWN";
    }

    const expected = "TESTNET";
    const isTestnet = networkStr === expected;

    console.log("[Freighter] Network returned:", networkStr);
    console.log("[Freighter] Expected network:", expected);
    console.log("[Freighter] Is testnet?", isTestnet);

    return networkStr;
  } catch (error) {
    console.error("Error getting network:", error);
    throw error;
  }
}

/**
 * Signs a transaction XDR with the Freighter wallet.
 * In v6, signTransaction() returns { signedTxXdr: string, signerAddress: string, error?: ... }
 * NOT just the signed XDR string.
 */
/**
 * Signs a transaction XDR with the Freighter wallet.
 * In v6, signTransaction() takes { networkPassphrase, address } as opts
 * and returns { signedTxXdr: string, signerAddress: string, error?: ... }
 * NOT just the signed XDR string.
 * @param {string} xdr - The transaction XDR to sign
 * @param {string} networkPassphrase - The Stellar network passphrase
 */
export async function signTxWithFreighter(xdr, networkPassphrase = "Test SDF Network ; September 2015") {
  try {
    // v6 opts: { networkPassphrase, address? } — NOT { network: "TESTNET" }
    const result = await signTransaction(xdr, { networkPassphrase });
    console.log("[Freighter] signTransaction() raw result:", result);

    if (result && result.error) {
      throw new Error(
        typeof result.error === "object" ? result.error.message || JSON.stringify(result.error) : result.error
      );
    }

    // v6 returns { signedTxXdr: "...", signerAddress: "..." }
    if (typeof result === "object" && result !== null && "signedTxXdr" in result) {
      return result.signedTxXdr;
    }

    // Fallback: older API returned the signed XDR string directly
    if (typeof result === "string") {
      return result;
    }

    throw new Error("Unexpected signTransaction response format");
  } catch (error) {
    console.error("Error signing transaction with Freighter:", error);
    throw error;
  }
}
