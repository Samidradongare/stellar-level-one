import React from 'react';
import { useWalletStore } from '../../store/walletStore';
import { Button } from '../ui/Button';
import { Wallet } from 'lucide-react';
import { truncatePublicKey } from '../../utils/formatters';

export function ConnectButton({ className = '' }) {
  const { isConnected, isConnecting, publicKey, connect, disconnect } = useWalletStore();

  if (isConnected) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="hidden sm:inline text-xs text-text-muted bg-gray-900 border border-border px-3 py-2 rounded-input font-mono">
          {truncatePublicKey(publicKey)}
        </span>
        <Button variant="secondary" size="sm" onClick={disconnect}>
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="primary"
      onClick={connect}
      loading={isConnecting}
      icon={Wallet}
      className={className}
    >
      Connect Wallet
    </Button>
  );
}
