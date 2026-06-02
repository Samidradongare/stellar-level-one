import React, { useEffect } from 'react';
import { useWalletStore } from '../store/walletStore';
import { useSessionStore } from '../store/sessionStore';
import { BalanceDisplay } from '../components/wallet/BalanceDisplay';
import { WalletInfo } from '../components/wallet/WalletInfo';
import { SessionSetup } from '../components/session/SessionSetup';
import { TxStatusBadge } from '../components/transaction/TxStatusBadge';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { formatDate, truncatePublicKey } from '../utils/formatters';
import { STELLAR_EXPERT_TX_URL } from '../utils/constants';
import { Wallet, History, ExternalLink, Calendar, Hourglass, Coins } from 'lucide-react';

export function Dashboard() {
  const { isConnected, connect, isConnecting } = useWalletStore();
  const { history } = useSessionStore();

  // Show last 5 sessions in the table
  const recentHistory = history.slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full z-10">
      {!isConnected ? (
        /* Disconnected State Onboarding Card */
        <div className="max-w-md mx-auto text-center py-16">
          <Card className="flex flex-col items-center gap-6 p-8 border-border">
            <div className="p-4 bg-primary-glow border border-primary/20 rounded-full">
              <Wallet className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-text-primary">
              Connect to Dashboard
            </h2>
            <p className="text-sm text-text-muted">
              Please connect your Freighter wallet set to the Stellar Testnet network to configure stake focus commitments.
            </p>
            <Button
              variant="primary"
              onClick={connect}
              loading={isConnecting}
              className="w-full"
            >
              Connect Freighter
            </Button>
          </Card>
        </div>
      ) : (
        /* Connected Dashboard Grid Layout */
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left side stats/status column */}
            <div className="md:col-span-1 flex flex-col gap-6">
              <BalanceDisplay />
              <WalletInfo />
            </div>

            {/* Right side config column */}
            <div className="md:col-span-2">
              <SessionSetup />
            </div>
          </div>

          {/* Session History Table Card */}
          <Card className="border-border">
            <Card.Header className="flex justify-between items-center pb-2">
              <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
                <History className="w-4.5 h-4.5 text-primary" />
                Commitment Logs (Recent 5)
              </h2>
            </Card.Header>

            <Card.Body className="overflow-x-auto mt-4">
              {recentHistory.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-border rounded-input bg-surface/30">
                  <p className="text-xs text-text-muted">No focus commitments recorded yet.</p>
                </div>
              ) : (
                <table className="min-w-full text-left text-sm whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-border text-xs text-text-muted font-bold uppercase tracking-wider">
                      <th className="pb-3 pl-2">Date / Time</th>
                      <th className="pb-3">Duration</th>
                      <th className="pb-3">Staked</th>
                      <th className="pb-3">Outcome</th>
                      <th className="pb-3 text-right pr-2">Ledger Links</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {recentHistory.map((item) => (
                      <tr key={item.id} className="hover:bg-surface/30 transition-colors">
                        <td className="py-3 pl-2 flex items-center gap-2 font-medium text-text-primary">
                          <Calendar className="w-3.5 h-3.5 text-text-muted" />
                          {formatDate(item.date)}
                        </td>
                        <td className="py-3 text-text-muted">
                          <span className="flex items-center gap-1.5">
                            <Hourglass className="w-3.5 h-3.5" />
                            {item.duration} Min
                          </span>
                        </td>
                        <td className="py-3 text-text-muted font-mono font-semibold">
                          <span className="flex items-center gap-1">
                            <Coins className="w-3.5 h-3.5 text-primary" />
                            {item.stakeAmount} XLM
                          </span>
                        </td>
                        <td className="py-3">
                          <TxStatusBadge status={item.outcome} />
                        </td>
                        <td className="py-3 text-right pr-2 text-xs">
                          <div className="flex justify-end gap-3">
                            {item.stakeHash && (
                              <a
                                href={`${STELLAR_EXPERT_TX_URL}/${item.stakeHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-0.5 text-primary hover:underline hover:text-cyan-400 font-mono"
                                title="View Stake Tx"
                              >
                                Stake
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                            {item.returnHash && (
                              <a
                                href={`${STELLAR_EXPERT_TX_URL}/${item.returnHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-0.5 text-success hover:underline hover:text-emerald-400 font-mono"
                                title="View Return Tx"
                              >
                                Refund
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Card.Body>
          </Card>
        </div>
      )}
    </div>
  );
}
