/** Formats a number to a reasonable number of decimal places */
export const formatAmount = (value: number): string => {
  if (value === 0) return '0';
  if (value >= 1) return value.toFixed(4);
  if (value >= 0.01) return value.toFixed(6);
  return value.toFixed(8);
};

/** Validates if a string is a valid positive number */
export const isValidAmount = (value: string): boolean => {
  if (!value || value.trim() === '') return false;
  const num = parseFloat(value);
  return !isNaN(num) && num > 0 && isFinite(num);
};

/** Calculates the exchange rate between two tokens */
export const calculateExchangeRate = (
  fromPrice: number,
  toPrice: number
): number => {
  if (toPrice === 0) return 0;
  return fromPrice / toPrice;
};

/** Calculates the output amount given input amount and exchange rate */
export const calculateOutputAmount = (
  inputAmount: number,
  fromPrice: number,
  toPrice: number
): number => {
  const rate = calculateExchangeRate(fromPrice, toPrice);
  return inputAmount * rate;
};
