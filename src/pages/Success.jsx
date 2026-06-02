import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionStore } from '../store/sessionStore';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { TxHashDisplay } from '../components/transaction/TxHashDisplay';
import { BadgeCheck, Trophy, Hourglass, Coins, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

export function Success() {
  const navigate = useNavigate();
  const { duration, stakeAmount, stakeHash, returnHash, resetSession } = useSessionStore();

  // Fire canvas-confetti celebration on view entry
  useEffect(() => {
    // Left-side burst
    confetti({
      particleCount: 80,
      angle: 60,
      spread: 55,
      origin: { x: 0 }
    });
    // Right-side burst
    confetti({
      particleCount: 80,
      angle: 120,
      spread: 55,
      origin: { x: 1 }
    });
    // Central burst
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    }, 250);
  }, []);

  const handleStartNew = () => {
    resetSession();
    navigate('/dashboard');
  };

  return (
    <div className="flex-grow flex items-center justify-center p-4 relative">
      {/* Background visual highlight */}
      <div className="absolute top-[20%] w-[350px] h-[350px] bg-success/5 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="max-w-md w-full flex flex-col items-center gap-6 z-10 py-12">
        {/* Animated Trophy badge */}
        <div className="p-4 bg-emerald-950/20 border border-success/30 rounded-full shadow-[0_0_30px_rgba(16,185,129,0.15)] animate-pulse-slow">
          <Trophy className="w-12 h-12 text-success" />
        </div>

        <div className="text-center flex flex-col gap-2">
          <h1 className="text-3xl font-black text-text-primary tracking-tight">
            Session Complete 🎯
          </h1>
          <p className="text-sm text-text-muted">
            Excellent work! Your commitment has been verified on-chain.
          </p>
        </div>

        {/* Focus Stats Cards Grid */}
        <div className="grid grid-cols-2 gap-4 w-full">
          <Card className="flex flex-col items-center text-center p-4 border-border bg-surface/40">
            <Hourglass className="w-5 h-5 text-primary mb-1.5" />
            <span className="text-[10px] text-text-muted uppercase font-bold">Focus Time</span>
            <span className="text-sm font-bold text-text-primary mt-1">{duration} Minutes</span>
          </Card>
          
          <Card className="flex flex-col items-center text-center p-4 border-border bg-surface/40">
            <Coins className="w-5 h-5 text-success mb-1.5" />
            <span className="text-[10px] text-text-muted uppercase font-bold">Stake Returned</span>
            <span className="text-sm font-bold text-success mt-1">{stakeAmount} XLM</span>
          </Card>
        </div>

        {/* Transaction Hashes container */}
        <Card className="w-full border-border flex flex-col gap-4">
          <TxHashDisplay hash={stakeHash} label="1. Locked Stake Payment" />
          <TxHashDisplay hash={returnHash} label="2. Vault Refund Return" />
        </Card>

        {/* CTA Button to go back */}
        <Button
          variant="primary"
          size="lg"
          onClick={handleStartNew}
          className="w-full text-base font-bold mt-2"
          icon={RefreshCw}
        >
          Start New Session
        </Button>
      </div>
    </div>
  );
}
