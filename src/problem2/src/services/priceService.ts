import type { PriceEntry, Token } from '../types';

const PRICES_API_URL = 'https://interview.switcheo.com/prices.json';

/** Fetches raw price data from the API */
export const fetchPrices = async (): Promise<PriceEntry[]> => {
  const response = await fetch(PRICES_API_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch prices: ${response.statusText}`);
  }
  return response.json();
};

/** Deduplicates price entries, keeping the most recent price for each currency */
export const deduplicatePrices = (prices: PriceEntry[]): Map<string, number> => {
  const priceMap = new Map<string, { price: number; date: string }>();

  for (const entry of prices) {
    const existing = priceMap.get(entry.currency);
    if (!existing || new Date(entry.date) > new Date(existing.date)) {
      priceMap.set(entry.currency, { price: entry.price, date: entry.date });
    }
  }

  const result = new Map<string, number>();
  for (const [currency, { price }] of priceMap) {
    if (price > 0) {
      result.set(currency, price);
    }
  }
  return result;
};

/** Maps currency name to the token image filename (uppercase) */
const getTokenImagePath = (currency: string): string => {
  return `/tokens/${currency.toUpperCase()}.svg`;
};

/** Builds a list of tokens with prices and image paths */
export const buildTokenList = (prices: PriceEntry[]): Token[] => {
  const priceMap = deduplicatePrices(prices);
  const tokens: Token[] = [];

  for (const [currency, price] of priceMap) {
    tokens.push({
      currency,
      price,
      image: getTokenImagePath(currency),
    });
  }

  return tokens.sort((a, b) => a.currency.localeCompare(b.currency));
};
