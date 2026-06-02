import React from 'react';
import { useSessionStore } from '../../store/sessionStore';
import { DURATIONS } from '../../utils/constants';

export function DurationSelector() {
  const { duration, setDuration } = useSessionStore();

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">
        Focus Duration
      </label>
      <div className="grid grid-cols-3 gap-2 mt-1">
        {DURATIONS.map((d) => (
          <button
            key={d.value}
            type="button"
            onClick={() => setDuration(d.value)}
            className={`py-2 px-4 rounded-pill border text-sm font-semibold transition-all duration-200 ${
              duration === d.value
                ? 'bg-primary-glow border-primary text-primary shadow-[0_0_12px_rgba(6,182,212,0.12)]'
                : 'border-border text-text-muted hover:border-gray-600 hover:text-text-primary bg-transparent'
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>
    </div>
  );
}
