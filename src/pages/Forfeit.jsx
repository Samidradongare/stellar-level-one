import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionStore } from '../store/sessionStore';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { TxHashDisplay } from '../components/transaction/TxHashDisplay';
import { ShieldAlert, Trash2, ArrowLeft } from 'lucide-react';

export function Forfeit() {
  const navigate = useNavigate();
  const { stakeAmount, stakeHash, resetSession } = useSessionStore();

  const handleRetry = () => {
    resetSession();
    navigate('/dashboard');
  };

  return (
    <div className="flex-grow flex items-center justify-center p-4 relative">
      {/* Background radial glow */}
      <div className="absolute top-[20%] w-[350px] h-[350px] bg-error/5 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="max-w-md w-full flex flex-col items-center gap-6 z-10 py-12">
        {/* Animated Forfeit Trash Badge */}
        <div className="p-4 bg-red-950/20 border border-error/30 rounded-full shadow-[0_0_30px_rgba(239,68,68,0.1)]">
          <Trash2 className="w-12 h-12 text-error" />
        </div>

        <div className="text-center flex flex-col gap-2">
          <h1 className="text-3xl font-black text-text-primary tracking-tight">
            Session Ended Early
          </h1>
          <p className="text-sm text-text-muted">
            You chose to abandon the session. Your commitment stake has been forfeited.
          </p>
        </div>

        {/* Forfeit Info card */}
        <Card className="w-full border-border flex flex-col items-center text-center p-6 bg-surface/30">
          <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Forfeited Amount</span>
          <span className="text-2xl font-extrabold text-error mt-1.5">{stakeAmount} XLM</span>
          <p className="text-xs text-text-muted mt-2 max-w-[280px]">
            This stake remains in the vault wallet permanently as on-chain accountability proof.
          </p>
        </Card>

        {/* Stake transaction hash proof */}
        {stakeHash && (
          <div className="w-full">
            <TxHashDisplay hash={stakeHash} label="On-Chain Stake Payment Proof" />
          </div>
        )}

        {/* CTA to return home */}
        <Button
          variant="secondary"
          size="lg"
          onClick={handleRetry}
          className="w-full text-base font-bold mt-2"
          icon={ArrowLeft}
        >
          Try Again
        </Button>
      </div>
    </div>
  );
}
