import React, { useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { truncatePublicKey } from '../../utils/formatters';
import { STELLAR_EXPERT_TX_URL } from '../../utils/constants';

export function TxHashDisplay({ hash, label = 'Transaction Hash' }) {
  const [copied, setCopied] = useState(false);

  if (!hash) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-1 text-left w-full">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
        {label}
      </span>
      <div className="flex items-center justify-between gap-3 bg-surface/40 border border-border px-3 py-2 rounded-input font-mono text-xs w-full">
        <a
          href={`${STELLAR_EXPERT_TX_URL}/${hash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline hover:text-cyan-400 flex items-center gap-1.5 min-w-0"
        >
          <span className="truncate">{truncatePublicKey(hash)}</span>
          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
        </a>
        <button
          onClick={handleCopy}
          className="text-text-muted hover:text-text-primary p-1 rounded hover:bg-gray-800 transition-colors shrink-0"
          title="Copy Transaction Hash"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-success" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}
