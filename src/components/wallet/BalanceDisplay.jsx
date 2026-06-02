import React, { useState } from 'react';
import { useWalletStore } from '../../store/walletStore';
import { RefreshCw } from 'lucide-react';
import { Card } from '../ui/Card';

export function BalanceDisplay() {
  const { balance, refreshBalance, isConnected } = useWalletStore();
  const [loading, setLoading] = useState(false);

  const handleRefresh = async () => {
    if (!isConnected || loading) return;
    setLoading(true);
    await refreshBalance();
    setLoading(false);
  };

  return (
    <Card hover className="flex flex-col gap-2 relative overflow-hidden bg-gradient-to-br from-surface to-background border-border">
      <div className="flex justify-between items-center text-xs text-text-muted font-semibold uppercase tracking-wider">
        <span>Stellar XLM Balance</span>
        {isConnected && (
          <button
            onClick={handleRefresh}
            disabled={loading}
            className={`p-1 rounded hover:bg-gray-800 transition-colors text-text-muted hover:text-primary ${
              loading ? 'animate-spin text-primary' : ''
            }`}
            title="Refresh balance"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="flex items-baseline gap-1.5 mt-2">
        <span className="text-3xl font-extrabold text-text-primary tracking-tight">
          {isConnected && balance !== null
            ? Number(balance).toLocaleString(undefined, { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 7 
              })
            : '0.00'}
        </span>
        <span className="text-sm font-bold text-primary uppercase">XLM</span>
      </div>
      {/* Bottom glowing line decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </Card>
  );
}
