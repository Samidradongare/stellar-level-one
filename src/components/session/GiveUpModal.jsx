import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { AlertTriangle } from 'lucide-react';

export function GiveUpModal({ isOpen, onClose, onConfirm, stakeAmount }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Forfeit Focus Session?">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="p-3 bg-error/10 text-error rounded-full">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm text-text-primary font-semibold">
            Abandoning this session will forfeit your stake.
          </p>
          <p className="text-xs text-text-muted">
            Your locked <span className="text-error font-bold">{stakeAmount} XLM</span> will remain in the vault permanently.
            This action is written to the Stellar ledger and cannot be reversed.
          </p>
        </div>

        <div className="flex gap-3 w-full mt-4">
          <Button
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Keep Focusing
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            className="flex-1"
          >
            Abandon Stake
          </Button>
        </div>
      </div>
    </Modal>
  );
}
