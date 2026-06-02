import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWalletStore } from '../../store/walletStore';
import { useSessionStore } from '../../store/sessionStore';
import { DurationSelector } from './DurationSelector';
import { StakeInput } from './StakeInput';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { sendStake } from '../../stellar/transactions';
import { MIN_STAKE } from '../../utils/constants';
import { toast } from 'react-hot-toast';
import { Flame } from 'lucide-react';

export function SessionSetup() {
  const navigate = useNavigate();
  const { isConnected, balance, publicKey, connect, refreshBalance } = useWalletStore();
  const { duration, stakeAmount, startSession } = useSessionStore();
  const [isStaking, setIsStaking] = useState(false);

  const numStake = parseFloat(stakeAmount);
  const isStakeValid = !isNaN(numStake) && numStake >= MIN_STAKE;
  
  // Security validation: max = balance - 2 XLM (reserve + transaction fees)
  const maxStakeAllowed = isConnected && balance ? parseFloat(balance) - 2 : 0;
  const isBalanceSufficient = isStakeValid && numStake <= maxStakeAllowed;

  // Compute button text & state
  let buttonText = 'Lock Stake & Start';
  let isButtonDisabled = false;
  let validationMessage = '';

  if (!isConnected) {
    buttonText = 'Connect Wallet to Start';
    isButtonDisabled = false; // Clicking will connect wallet
  } else if (stakeAmount === '') {
    buttonText = 'Enter Stake Amount';
    isButtonDisabled = true;
  } else if (!isStakeValid) {
    buttonText = 'Stake Amount Too Low';
    isButtonDisabled = true;
  } else if (!isBalanceSufficient) {
    buttonText = 'Insufficient Balance';
    isButtonDisabled = true;
    validationMessage = `Balance is low. Max stake: ${Math.max(0, maxStakeAllowed).toFixed(2)} XLM (2 XLM reserved for fees/rent).`;
  }

  const handleStart = async () => {
    if (!isConnected) {
      await connect();
      return;
    }

    if (isStaking || isButtonDisabled) return;
    setIsStaking(true);

    const sessionId = typeof crypto.randomUUID === 'function' 
      ? crypto.randomUUID() 
      : Math.random().toString(36).substring(2, 9);

    const toastId = toast.loading('Preparing transaction. Please approve sign request in Freighter...');

    try {
      // Build, sign, and submit the stake transaction to Stellar
      const txHash = await sendStake({
        fromKey: publicKey,
        amount: stakeAmount,
        sessionId,
        duration
      });

      toast.success('Stake locked on-chain!', { id: toastId });
      
      // Update session store which transitions page state
      startSession(duration, stakeAmount, txHash);
      
      // Refresh wallet balance post-stake
      await refreshBalance();

      // Redirect to the fullscreen focus screen
      navigate('/focus');
    } catch (error) {
      console.error('Stake transaction failed:', error);
      
      let errorMsg = 'Transaction failed. Try again.';
      if (error.message === 'User rejected signing') {
        errorMsg = 'Transaction cancelled';
      } else if (error.message.includes('insufficient balance') || error.message.includes('op_underfunded')) {
        errorMsg = 'Not enough XLM to stake + fees';
      } else if (error.message.includes('not exist')) {
        errorMsg = 'Account not active. Friendbot it first.';
      }

      toast.error(errorMsg, { id: toastId });
    } finally {
      setIsStaking(false);
    }
  };

  return (
    <Card className="flex flex-col gap-5 border-border">
      <Card.Header className="pb-2">
        <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
          <Flame className="w-5 h-5 text-primary" />
          Commitment Config
        </h2>
        <p className="text-xs text-text-muted mt-1">
          Lock testnet XLM. Stay focused to retrieve it. Give up and it is forfeited.
        </p>
      </Card.Header>

      <Card.Body className="flex flex-col gap-4">
        <DurationSelector />
        <StakeInput />

        {isStakeValid && (
          <div className="bg-primary/5 border border-primary/20 rounded-input p-3 text-center">
            <span className="text-xs text-text-muted">Commitment Preview:</span>
            <p className="text-sm font-semibold text-text-primary mt-1">
              You will stake <span className="text-primary font-bold">{stakeAmount} XLM</span> for{' '}
              <span className="text-primary font-bold">{duration} minutes</span>
            </p>
          </div>
        )}

        {validationMessage && (
          <p className="text-xs text-warning text-center mt-1">
            {validationMessage}
          </p>
        )}
      </Card.Body>

      <Card.Footer className="pt-2">
        <Button
          variant={!isConnected ? 'outline' : 'primary'}
          size="lg"
          onClick={handleStart}
          disabled={isButtonDisabled && isConnected}
          loading={isStaking}
          className="w-full text-center"
        >
          {buttonText}
        </Button>
      </Card.Footer>
    </Card>
  );
}
