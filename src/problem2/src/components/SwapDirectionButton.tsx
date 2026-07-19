import React, { memo } from 'react';

interface SwapDirectionButtonProps {
  onClick: () => void;
}

/** Button to swap the direction of token exchange */
export const SwapDirectionButton: React.FC<SwapDirectionButtonProps> = memo(({ onClick }) => {
  return (
    <button
      type="button"
      className="swap-direction-button"
      onClick={onClick}
      title="Swap direction"
      aria-label="Swap token direction"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    </button>
  );
});

SwapDirectionButton.displayName = 'SwapDirectionButton';
