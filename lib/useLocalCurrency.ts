"use client";

import { useEffect, useState } from "react";

const CACHE_KEY = "lp_currency_cache_v1";
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

// Best-effort region → currency map. Extend as needed.
const COUNTRY_CURRENCY: Record<string, string> = {
  KE: "KES", UG: "UGX", TZ: "TZS", RW: "RWF", ET: "ETB", BI: "BIF",
  US: "USD", CA: "CAD", GB: "GBP", IE: "EUR",
  DE: "EUR", FR: "EUR", ES: "EUR", IT: "EUR", NL: "EUR", PT: "EUR",
  NG: "NGN", GH: "GHS", ZA: "ZAR", EG: "EGP",
  IN: "INR", PK: "PKR", AE: "AED", SA: "SAR", QA: "QAR",
  AU: "AUD", NZ: "NZD", CN: "CNY", JP: "JPY", KR: "KRW", BR: "BRL", MX: "MXN",
};

type CurrencyState = {
  currency: string | null; // null → show KES only
  rate: number | null;     // 1 KES = rate * currency
  loading: boolean;
};

export function useLocalCurrency() {
  const [state, setState] = useState<CurrencyState>({
    currency: null,
    rate: null,
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;

    async function resolve() {
      // Best-effort region guess from the browser locale, e.g. "en-KE" -> "KE"
      let region: string | null = null;
      try {
        const locale = Intl.DateTimeFormat().resolvedOptions().locale;
        const parts = locale.split("-");
        region = parts.length > 1 ? parts[parts.length - 1].toUpperCase() : null;
      } catch {
        region = null;
      }

      // Kenyan visitors, or anywhere we can't map, just see KES.
      if (!region || region === "KE" || !COUNTRY_CURRENCY[region]) {
        if (!cancelled) setState({ currency: null, rate: null, loading: false });
        return;
      }

      const currency = COUNTRY_CURRENCY[region];

      try {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.currency === currency && Date.now() - parsed.ts < CACHE_TTL) {
            if (!cancelled) setState({ currency, rate: parsed.rate, loading: false });
            return;
          }
        }
      } catch {
        /* ignore cache errors */
      }

      try {
        const res = await fetch("https://open.er-api.com/v6/latest/KES");
        const data = await res.json();
        const rate = data?.rates?.[currency] ?? null;
        if (!cancelled) {
          setState({ currency, rate, loading: false });
          if (rate) {
            sessionStorage.setItem(
              CACHE_KEY,
              JSON.stringify({ currency, rate, ts: Date.now() })
            );
          }
        }
      } catch {
        if (!cancelled) setState({ currency, rate: null, loading: false });
      }
    }

    resolve();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}