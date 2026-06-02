import React from 'react';
import { useWalletStore } from '../../store/walletStore';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ExternalLink } from 'lucide-react';
import { truncatePublicKey } from '../../utils/formatters';
import { STELLAR_EXPERT_ACCOUNT_URL } from '../../utils/constants';

export function WalletInfo() {
  const { publicKey, isConnected, network } = useWalletStore();

  if (!isConnected) return null;

  return (
    <Card className="flex flex-col gap-3 border-border">
      <h3 className="text-xs text-text-muted font-semibold uppercase tracking-wider">
        Wallet Credentials
      </h3>
      <div className="flex flex-col gap-2.5 mt-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-text-muted">Network Environment</span>
          <Badge variant="primary">{network || 'TESTNET'}</Badge>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-text-muted">Public Address</span>
          <a
            href={`${STELLAR_EXPERT_ACCOUNT_URL}/${publicKey}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 font-mono text-xs text-primary hover:underline"
          >
            {truncatePublicKey(publicKey)}
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </Card>
  );
}
