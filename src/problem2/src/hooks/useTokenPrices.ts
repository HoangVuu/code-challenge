import { useState, useEffect } from 'react';
import type { Token, AsyncStatus } from '../types';
import { fetchPrices, buildTokenList } from '../services/priceService';

interface UseTokenPricesReturn {
  tokens: Token[];
  status: AsyncStatus;
  error: string | null;
}

/** Hook to fetch and manage token price data */
export const useTokenPrices = (): UseTokenPricesReturn => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [status, setStatus] = useState<AsyncStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPrices = async () => {
      setStatus('loading');
      setError(null);
      try {
        const prices = await fetchPrices();
        const tokenList = buildTokenList(prices);
        setTokens(tokenList);
        setStatus('success');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load prices';
        setError(message);
        setStatus('error');
      }
    };

    loadPrices();
  }, []);

  return { tokens, status, error };
};
