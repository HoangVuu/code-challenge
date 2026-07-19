import { useState, useCallback, useMemo } from 'react';
import type { Token, SwapFormState, ValidationErrors, AsyncStatus } from '../types';
import { isValidAmount, calculateOutputAmount, formatAmount } from '../utils/formatters';

interface UseSwapFormReturn {
  formState: SwapFormState;
  errors: ValidationErrors;
  submitStatus: AsyncStatus;
  exchangeRate: string | null;
  setFromToken: (token: Token) => void;
  setToToken: (token: Token) => void;
  setFromAmount: (amount: string) => void;
  swapTokens: () => void;
  handleSubmit: () => void;
}

/** Hook to manage swap form state and logic */
export const useSwapForm = (): UseSwapFormReturn => {
  const [formState, setFormState] = useState<SwapFormState>({
    fromToken: null,
    toToken: null,
    fromAmount: '',
    toAmount: '',
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitStatus, setSubmitStatus] = useState<AsyncStatus>('idle');

  const validate = useCallback((state: SwapFormState): ValidationErrors => {
    const newErrors: ValidationErrors = {};
    if (!state.fromToken) newErrors.fromToken = 'Please select a token to send';
    if (!state.toToken) newErrors.toToken = 'Please select a token to receive';
    if (!state.fromAmount || !isValidAmount(state.fromAmount)) {
      newErrors.fromAmount = 'Please enter a valid amount greater than 0';
    }
    return newErrors;
  }, []);

  const recalculateOutput = useCallback(
    (amount: string, from: Token | null, to: Token | null): string => {
      if (!from || !to || !isValidAmount(amount)) return '';
      const inputNum = parseFloat(amount);
      const output = calculateOutputAmount(inputNum, from.price, to.price);
      return formatAmount(output);
    },
    []
  );

  const setFromToken = useCallback(
    (token: Token) => {
      setFormState((prev) => {
        const newState = { ...prev, fromToken: token };
        newState.toAmount = recalculateOutput(prev.fromAmount, token, prev.toToken);
        return newState;
      });
      setErrors((prev) => ({ ...prev, fromToken: undefined }));
    },
    [recalculateOutput]
  );

  const setToToken = useCallback(
    (token: Token) => {
      setFormState((prev) => {
        const newState = { ...prev, toToken: token };
        newState.toAmount = recalculateOutput(prev.fromAmount, prev.fromToken, token);
        return newState;
      });
      setErrors((prev) => ({ ...prev, toToken: undefined }));
    },
    [recalculateOutput]
  );

  const setFromAmount = useCallback(
    (amount: string) => {
      setFormState((prev) => {
        const newState = { ...prev, fromAmount: amount };
        newState.toAmount = recalculateOutput(amount, prev.fromToken, prev.toToken);
        return newState;
      });
      if (isValidAmount(amount)) {
        setErrors((prev) => ({ ...prev, fromAmount: undefined }));
      }
    },
    [recalculateOutput]
  );

  const swapTokens = useCallback(() => {
    setFormState((prev) => {
      const newState: SwapFormState = {
        fromToken: prev.toToken,
        toToken: prev.fromToken,
        fromAmount: prev.toAmount,
        toAmount: prev.fromAmount,
      };
      return newState;
    });
    setErrors({});
  }, []);

  const handleSubmit = useCallback(() => {
    const validationErrors = validate(formState);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitStatus('loading');
    // Simulate backend interaction
    setTimeout(() => {
      setSubmitStatus('success');
      setTimeout(() => setSubmitStatus('idle'), 3000);
    }, 2000);
  }, [formState, validate]);

  const exchangeRate = useMemo(() => {
    if (!formState.fromToken || !formState.toToken) return null;
    const rate = calculateOutputAmount(1, formState.fromToken.price, formState.toToken.price);
    return `1 ${formState.fromToken.currency} = ${formatAmount(rate)} ${formState.toToken.currency}`;
  }, [formState.fromToken, formState.toToken]);

  return {
    formState,
    errors,
    submitStatus,
    exchangeRate,
    setFromToken,
    setToToken,
    setFromAmount,
    swapTokens,
    handleSubmit,
  };
};
