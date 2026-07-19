import { useEffect, useMemo, useState } from "react";

export interface PriceItem {
  currency: string;
  date: string;
  price: number;
}

export type PricesMap = Record<string, number>;

export function usePrices() {
  const [data, setData] = useState<PriceItem[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch("https://interview.switcheo.com/prices.json")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch prices");
        const json = (await res.json()) as PriceItem[];
        setData(json);
      })
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : "Unknown error");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const map: PricesMap = useMemo(() => {
    if (!data) return {};

    return data.reduce((acc, item) => {
      acc[item.currency] = item.price;
      return acc;
    }, {} as PricesMap);
  }, [data]);

  return { prices: map, loading, error };
}
