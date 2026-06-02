import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWalletStore } from '../store/walletStore';
import { useSessionStore } from '../store/sessionStore';
import { CircularTimer } from '../components/timer/CircularTimer';
import { TimerDisplay } from '../components/timer/TimerDisplay';
import { GiveUpModal } from '../components/session/GiveUpModal';
import { TxHashDisplay } from '../components/transaction/TxHashDisplay';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { sendReturn } from '../stellar/vault';
import { STELLAR_EXPERT_TX_URL } from '../utils/constants';
import { ShieldAlert, ExternalLink, RefreshCw, Mail, Cpu } from 'lucide-react';
import { toast } from 'react-hot-toast';

export function FocusSession() {
  const navigate = useNavigate();
  const { publicKey, refreshBalance } = useWalletStore();
  const {
    sessionId,
    duration,
    stakeAmount,
    status,
    stakeHash,
    endsAt,
    forfeitSession,
    completeSession,
    resetSession,
    setStatus
  } = useSessionStore();

  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isGiveUpOpen, setIsGiveUpOpen] = useState(false);
  const [returnError, setReturnError] = useState(null);
  const [isRefunding, setIsRefunding] = useState(false);

  const timerRef = useRef(null);
  const returnTriggered = useRef(false);

  // Compute total duration in seconds
  const totalSeconds = duration * 60;

  // Initialize and tick countdown timer
  useEffect(() => {
    // If there is no active session, go back to dashboard
    if (status !== 'active' || !endsAt) {
      if (status === 'success') {
        navigate('/success');
      } else if (status === 'forfeited') {
        navigate('/forfeit');
      } else if (status === 'idle') {
        navigate('/dashboard');
      }
      return;
    }

    const updateCountdown = () => {
      const now = Date.now();
      const diff = Math.ceil((endsAt - now) / 1000);

      if (diff <= 0) {
        setRemainingSeconds(0);
        clearInterval(timerRef.current);
        
        // Trigger the return transaction automatically
        if (!returnTriggered.current) {
          returnTriggered.current = true;
          handleSessionCompletion();
        }
      } else {
        setRemainingSeconds(diff);
      }
    };

    updateCountdown(); // run initial
    timerRef.current = setInterval(updateCountdown, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [endsAt, status, navigate]);

  // Execute vault refund payments
  const handleSessionCompletion = async () => {
    setStatus('completing');
    setIsRefunding(true);
    const toastId = toast.loading('Session complete! Triggering vault refund transaction...');

    try {
      // Vault returns staked amount back to user's address (signed with vault key, no Freighter required)
      const returnTxHash = await sendReturn({
        toKey: publicKey,
        amount: stakeAmount,
        sessionId
      });

      toast.success('Funds returned successfully!', { id: toastId });
      
      // Update session history
      completeSession(returnTxHash);
      
      // Refresh wallet balance post-refund
      await refreshBalance();
      
      setIsRefunding(false);
      navigate('/success');
    } catch (error) {
      console.error('Vault return transaction failed:', error);
      toast.error('Vault return transaction failed.', { id: toastId });
      
      setReturnError(error.message || 'Horizon response error during submit');
      setStatus('error');
      setIsRefunding(false);
    }
  };

  const handleGiveUpConfirm = () => {
    // Forfeit the session - no return transaction is sent
    forfeitSession();
    setIsGiveUpOpen(false);
    toast.error('Session forfeited. Stake locked in vault.');
    navigate('/forfeit');
  };

  // Retry refund trigger if it failed initially
  const handleRetryRefund = async () => {
    setReturnError(null);
    await handleSessionCompletion();
  };

  const handleResetToDashboard = () => {
    resetSession();
    navigate('/dashboard');
  };

  // Render error recovery details if vault submit fails
  if (status === 'error') {
    return (
      <div className="flex-grow flex items-center justify-center p-4 bg-background">
        <Card className="max-w-md w-full border-error/40 flex flex-col items-center text-center gap-6 p-8 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-error" />
          <div className="p-4 bg-error/15 text-error rounded-full">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-bold text-text-primary">
              Refund Transfer Failed
            </h2>
            <p className="text-sm text-text-muted">
              Your focus session was completed successfully, but the automatic refund from the vault failed.
            </p>
          </div>

          <div className="bg-background border border-border/80 text-left rounded-input p-4 w-full flex flex-col gap-3.5">
            <div className="text-xs">
              <span className="font-bold text-text-muted block uppercase tracking-wider">Session Reference ID</span>
              <span className="font-mono text-text-primary break-all select-all block mt-1">{sessionId}</span>
            </div>
            <div className="text-xs">
              <span className="font-bold text-text-muted block uppercase tracking-wider">Stake Tx Hash</span>
              <a
                href={`${STELLAR_EXPERT_TX_URL}/${stakeHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-mono inline-flex items-center gap-1 mt-1"
              >
                View Stake Proof
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="text-xs">
              <span className="font-bold text-text-muted block uppercase tracking-wider">Error Details</span>
              <span className="font-mono text-error/90 block mt-1 leading-normal">{returnError}</span>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-input p-3 text-left w-full flex items-start gap-2.5">
            <Mail className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p className="text-[11px] text-text-muted leading-relaxed">
              Please contact the support team at <span className="text-primary font-semibold">support@proofoffocus.com</span> with your Reference ID to request a manual refund.
            </p>
          </div>

          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              onClick={handleRetryRefund}
              loading={isRefunding}
              className="flex-1"
              icon={RefreshCw}
            >
              Retry Refund
            </Button>
            <Button
              variant="secondary"
              onClick={handleResetToDashboard}
              className="flex-1"
            >
              Go Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Completing transition view
  if (status === 'completing') {
    return (
      <div className="flex-grow flex flex-col items-center justify-center bg-background text-center gap-6">
        <div className="relative">
          {/* Centered spinning glowing animation */}
          <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-md" />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold text-text-primary">
            Signing Refund Transaction
          </h2>
          <p className="text-sm text-text-muted max-w-xs mx-auto">
            Vault is generating the refund payment of {stakeAmount} XLM back to your address on-chain.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col justify-between items-center py-16 px-4 bg-background relative z-10">
      {/* Tab/Browser Title Controller */}
      <TimerDisplay remainingSeconds={remainingSeconds} isComplete={remainingSeconds === 0} />

      {/* Top Session Stats Info Chip */}
      <div className="flex items-center gap-2.5 bg-surface border border-border px-4 py-2 rounded-pill shadow-lg">
        <Cpu className="w-3.5 h-3.5 text-primary" />
        <span className="text-xs text-text-muted">
          Active Session ID: <span className="font-mono font-semibold text-text-primary">{sessionId ? sessionId.slice(0, 8) : ''}</span>
        </span>
      </div>

      {/* SVG Circular Timer Display */}
      <div className="my-auto">
        <CircularTimer
          totalSeconds={totalSeconds}
          remainingSeconds={remainingSeconds}
          isComplete={remainingSeconds === 0}
        />
      </div>

      {/* Stake details and hash */}
      <div className="flex flex-col items-center gap-4 w-full max-w-sm mt-auto mb-12">
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5 bg-surface border border-border px-3 py-1.5 rounded-input">
            <span className="text-[10px] text-text-muted uppercase font-bold">Staked</span>
            <span className="text-xs text-primary font-bold">{stakeAmount} XLM</span>
          </div>
          <div className="flex items-center gap-1.5 bg-surface border border-border px-3 py-1.5 rounded-input">
            <span className="text-[10px] text-text-muted uppercase font-bold">Duration</span>
            <span className="text-xs text-primary font-bold">{duration} Min</span>
          </div>
        </div>

        {stakeHash && (
          <TxHashDisplay hash={stakeHash} label="Locked Stake Tx Proof" />
        )}

        {/* Give Up trigger button */}
        <button
          onClick={() => setIsGiveUpOpen(true)}
          className="text-xs font-bold text-error/70 hover:text-error hover:underline transition-colors mt-4 p-2"
        >
          Give Up (Forfeit Stake)
        </button>
      </div>

      {/* Cancel Focus Warning Dialog */}
      <GiveUpModal
        isOpen={isGiveUpOpen}
        onClose={() => setIsGiveUpOpen(false)}
        onConfirm={handleGiveUpConfirm}
        stakeAmount={stakeAmount}
      />
    </div>
  );
}
