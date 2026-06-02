import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWalletStore } from '../store/walletStore';
import { Button } from '../components/ui/Button';
import { Timer, ShieldAlert, BadgeCheck, Hourglass } from 'lucide-react';

export function Landing() {
  const navigate = useNavigate();
  const { isConnected, isConnecting, connect } = useWalletStore();

  const handleCTA = async () => {
    if (isConnected) {
      navigate('/dashboard');
    } else {
      await connect();
      // If successfully connected, navigate to dashboard
      if (useWalletStore.getState().isConnected) {
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="flex-grow flex flex-col justify-center items-center px-4 relative">
      {/* Visual background center glow */}
      <div className="absolute top-[30%] w-[350px] h-[350px] bg-primary/10 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* Main Hero Container */}
      <div className="max-w-3xl text-center flex flex-col items-center gap-6 z-10 py-16 sm:py-24">
        {/* Animated Icon Emblem */}
        <div className="p-4 bg-primary-glow border border-primary/20 rounded-full mb-2 animate-bounce-slow">
          <Timer className="w-10 h-10 text-primary" />
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-text-primary tracking-tight leading-none">
          Your Focus, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-300">On-Chain.</span>
        </h1>
        
        <p className="text-base sm:text-xl text-text-muted max-w-xl">
          Stake testnet XLM. Block distractions. Stay focused to reclaim your stake. Abandoning forfeits it to the vault.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs mt-4">
          <Button
            variant="primary"
            size="lg"
            onClick={handleCTA}
            loading={isConnecting}
            className="w-full text-base font-bold"
          >
            {isConnected ? 'Go to Dashboard' : 'Connect Wallet'}
          </Button>
        </div>
      </div>

      {/* Feature Pills Container */}
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-4 mt-auto mb-12 z-10 px-4">
        <div className="bg-surface/50 border border-border rounded-card p-5 flex items-start gap-4">
          <div className="p-2.5 bg-primary-glow border border-primary/10 rounded-input text-primary shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary">🔒 Stake to Focus</h3>
            <p className="text-xs text-text-muted mt-1 leading-relaxed">
              Back your productivity with financial commitment using Stellar Smart Payments.
            </p>
          </div>
        </div>

        <div className="bg-surface/50 border border-border rounded-card p-5 flex items-start gap-4">
          <div className="p-2.5 bg-primary-glow border border-primary/10 rounded-input text-primary shrink-0">
            <Hourglass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary">⏱ Beat the Timer</h3>
            <p className="text-xs text-text-muted mt-1 leading-relaxed">
              Enter a distraction-free fullscreen timer zone to complete your goals.
            </p>
          </div>
        </div>

        <div className="bg-surface/50 border border-border rounded-card p-5 flex items-start gap-4">
          <div className="p-2.5 bg-primary-glow border border-primary/10 rounded-input text-primary shrink-0">
            <BadgeCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary">✅ Get Paid Back</h3>
            <p className="text-xs text-text-muted mt-1 leading-relaxed">
              Success automatically triggers a vault refund transaction returning your full stake.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
