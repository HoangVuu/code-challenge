/** Represents a single token price entry from the API */
export interface PriceEntry {
  currency: string;
  date: string;
  price: number;
}

/** Represents a normalized token with its price and metadata */
export interface Token {
  currency: string;
  price: number;
  image: string;
}

/** State of the swap form */
export interface SwapFormState {
  fromToken: Token | null;
  toToken: Token | null;
  fromAmount: string;
  toAmount: string;
}

/** Validation error messages */
export interface ValidationErrors {
  fromAmount?: string;
  fromToken?: string;
  toToken?: string;
}

/** Status of an async operation */
export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';
