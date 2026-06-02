/**
 * Truncates a Stellar public key for UI display
 * e.g. GCVFAWHKJGFILGSFJCE7Q55GJIHNIWNFHD2MBBJGTHDLWB5VS34M7PZE -> GCVF...7PZE
 */
export function truncatePublicKey(key) {
  if (!key) return '';
  if (key.length <= 12) return key;
  return `${key.slice(0, 6)}...${key.slice(-4)}`;
}

/**
 * Formats a duration in seconds to MM:SS format
 * e.g. 1500 -> 25:00
 */
export function formatTime(seconds) {
  if (seconds === null || seconds === undefined || isNaN(seconds)) return '00:00';
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

/**
 * Formats an ISO date string to a localized readable format
 */
export function formatDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
