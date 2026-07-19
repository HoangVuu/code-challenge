import React, { useMemo } from "react";

type Blockchain = "Osmosis" | "Ethereum" | "Arbitrum" | "Zilliqa" | "Neo";

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: Blockchain;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

interface BoxProps {
  className?: string;
  [key: string]: unknown;
}

// These hooks and components would be imported from their respective modules
// in a real project. Declared here for completeness.
declare function useWalletBalances(): WalletBalance[];
declare function usePrices(): Record<string, number>;

interface WalletRowProps {
  className: string;
  amount: number;
  usdValue: number;
  formattedAmount: string;
}
declare const WalletRow: React.FC<WalletRowProps>;

// ─── Constants ────────────────────────────────────────────────────────────────

// Moved outside component: pure function with no dependency on props/state.
// Using a Record for O(1) lookups instead of a switch statement.
const BLOCKCHAIN_PRIORITY: Record<Blockchain, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};

const DEFAULT_PRIORITY = -99;

const getPriority = (blockchain: Blockchain): number => {
  return BLOCKCHAIN_PRIORITY[blockchain] ?? DEFAULT_PRIORITY;
};

// ─── Component ────────────────────────────────────────────────────────────────

const WalletPage: React.FC<BoxProps> = (props: BoxProps) => {
  const { ...rest } = props;
  const balances: WalletBalance[] = useWalletBalances();
  const prices: Record<string, number> = usePrices();

  // Single useMemo that filters, sorts, and formats in one pass.
  // Dependencies only include `balances` since filtering/sorting doesn't use `prices`.
  const formattedBalances: FormattedWalletBalance[] = useMemo(() => {
    return balances
      .filter((balance) => {
        const priority = getPriority(balance.blockchain);
        // Keep only balances with a valid blockchain AND positive amount
        return priority > DEFAULT_PRIORITY && balance.amount > 0;
      })
      .sort((lhs, rhs) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        // Explicit return for all cases including equal priorities
        return rightPriority - leftPriority;
      })
      .map((balance) => ({
        ...balance,
        formatted: balance.amount.toFixed(2),
      }));
  }, [balances]);

  // Memoize row rendering; depends on both formattedBalances and prices
  const rows = useMemo(() => {
    return formattedBalances.map((balance) => {
      const usdValue = (prices[balance.currency] ?? 0) * balance.amount;
      return (
        <WalletRow
          className="wallet-row"
          key={`${balance.blockchain}-${balance.currency}`} // Stable unique key instead of array index
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    });
  }, [formattedBalances, prices]);

  return <div {...rest}>{rows}</div>;
};

export default WalletPage;
