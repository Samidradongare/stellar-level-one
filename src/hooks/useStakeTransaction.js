import { useState } from 'react';
import { sendStake } from '../stellar/transactions';

export function useStakeTransaction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeStake = async ({ fromKey, amount, sessionId, duration }) => {
    setLoading(true);
    setError(null);
    try {
      const hash = await sendStake({ fromKey, amount, sessionId, duration });
      setLoading(false);
      return hash;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  return { executeStake, loading, error };
}
export default useStakeTransaction;
