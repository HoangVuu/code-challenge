import React from 'react';
import type { Token } from '../types';
import { useSwapForm } from '../hooks/useSwapForm';
import { TokenSelector } from './TokenSelector';
import { AmountInput } from './AmountInput';
import { SwapDirectionButton } from './SwapDirectionButton';
import { SwapButton } from './SwapButton';

interface SwapFormProps {
  tokens: Token[];
}

/** Main swap form component that orchestrates all form elements */
export const SwapForm: React.FC<SwapFormProps> = ({ tokens }) => {
  const {
    formState,
    errors,
    submitStatus,
    exchangeRate,
    setFromToken,
    setToToken,
    setFromAmount,
    swapTokens,
    handleSubmit,
  } = useSwapForm();

  return (
    <div className="swap-form">
      <div className="swap-form__header">
        <h2 className="swap-form__title">Swap</h2>
        <p className="swap-form__subtitle">Trade tokens instantly</p>
      </div>

      <form className="swap-form__body" onSubmit={(e) => e.preventDefault()}>
        {/* From Section */}
        <div className="swap-form__section">
          <div className="swap-form__row">
            <AmountInput
              label="You pay"
              value={formState.fromAmount}
              onChange={setFromAmount}
              placeholder="0.00"
              error={errors.fromAmount}
            />
            <TokenSelector
              tokens={tokens}
              selectedToken={formState.fromToken}
              onSelect={setFromToken}
              label="Token"
              error={errors.fromToken}
            />
          </div>
        </div>

        {/* Swap Direction */}
        <div className="swap-form__divider">
          <SwapDirectionButton onClick={swapTokens} />
        </div>

        {/* To Section */}
        <div className="swap-form__section">
          <div className="swap-form__row">
            <AmountInput
              label="You receive"
              value={formState.toAmount}
              readOnly
              placeholder="0.00"
            />
            <TokenSelector
              tokens={tokens}
              selectedToken={formState.toToken}
              onSelect={setToToken}
              label="Token"
              error={errors.toToken}
            />
          </div>
        </div>

        {/* Exchange Rate */}
        {exchangeRate && (
          <div className="swap-form__rate">
            <span className="swap-form__rate-icon">⚡</span>
            <span className="swap-form__rate-text">{exchangeRate}</span>
          </div>
        )}

        {/* Submit Button */}
        <SwapButton onClick={handleSubmit} status={submitStatus} />
      </form>
    </div>
  );
};
