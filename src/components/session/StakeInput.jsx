import React from 'react';
import { useSessionStore } from '../../store/sessionStore';
import { MIN_STAKE } from '../../utils/constants';

export function StakeInput() {
  const { stakeAmount, setStakeAmount } = useSessionStore();

  const handleChange = (e) => {
    const value = e.target.value;
    // Allow empty string, decimals, or numbers
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setStakeAmount(value);
    }
  };

  const isInvalid = stakeAmount !== '' && parseFloat(stakeAmount) < MIN_STAKE;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">
          Stake Amount
        </label>
        <span className="text-xs text-text-muted">Min: {MIN_STAKE} XLM</span>
      </div>
      <div className="relative mt-1 rounded-input shadow-sm">
        <input
          type="text"
          inputMode="decimal"
          value={stakeAmount}
          onChange={handleChange}
          placeholder="e.g. 5.0"
          className={`w-full bg-background border rounded-input py-3 pl-4 pr-16 text-sm font-semibold text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200
            ${isInvalid ? 'border-error/60 focus:ring-error' : 'border-border'}`}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
          <span className="text-xs font-extrabold text-primary tracking-wide">
            XLM
          </span>
        </div>
      </div>
      {isInvalid && (
        <span className="text-xs text-error mt-1">
          Minimum stake is {MIN_STAKE} XLM to create a valid commitment.
        </span>
      )}
    </div>
  );
}
