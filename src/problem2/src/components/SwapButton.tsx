import React, { memo } from 'react';
import type { AsyncStatus } from '../types';

interface SwapButtonProps {
  onClick: () => void;
  status: AsyncStatus;
  disabled?: boolean;
}

/** Submit button with loading and success states */
export const SwapButton: React.FC<SwapButtonProps> = memo(({ onClick, status, disabled }) => {
  const getButtonContent = () => {
    switch (status) {
      case 'loading':
        return (
          <span className="swap-button__content">
            <span className="swap-button__spinner" />
            <span>Processing...</span>
          </span>
        );
      case 'success':
        return (
          <span className="swap-button__content">
            <span className="swap-button__check">✓</span>
            <span>Swap Successful!</span>
          </span>
        );
      default:
        return 'Confirm Swap';
    }
  };

  return (
    <button
      type="button"
      className={`swap-button swap-button--${status}`}
      onClick={onClick}
      disabled={disabled || status === 'loading' || status === 'success'}
    >
      {getButtonContent()}
    </button>
  );
});

SwapButton.displayName = 'SwapButton';
