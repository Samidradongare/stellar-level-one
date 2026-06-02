import { useState } from 'react';
import { sendReturn } from '../stellar/vault';

export function useReturnTransaction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeReturn = async ({ toKey, amount, sessionId }) => {
    setLoading(true);
    setError(null);
    try {
      const hash = await sendReturn({ toKey, amount, sessionId });
      setLoading(false);
      return hash;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  return { executeReturn, loading, error };
}
export default useReturnTransaction;
