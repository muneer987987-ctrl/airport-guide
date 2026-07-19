"use client";

import { useEffect, useState } from "react";

const COUNTRY_CURRENCY: Record<string, string> = {
  GB: "GBP", AE: "AED", US: "USD", FR: "EUR", SG: "SGD", JP: "JPY",
  TR: "TRY", QA: "QAR", PK: "PKR", SA: "SAR", OM: "OMR", KW: "KWD",
  NL: "EUR", DE: "EUR", ES: "EUR", IT: "EUR", CA: "CAD", AU: "AUD",
  TH: "THB", MY: "MYR", HK: "HKD", IN: "INR",
};

const COMMON_TARGETS = ["USD", "EUR", "GBP", "PKR", "AED"];

export function CurrencyConverter({ countryIso2 }: { countryIso2: string }) {
  const localCurrency = COUNTRY_CURRENCY[countryIso2];
  const [amount, setAmount] = useState("100");
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localCurrency) { setLoading(false); return; }
    fetch(`https://open.er-api.com/v6/latest/${localCurrency}`)
      .then((res) => res.json())
      .then((data) => { if (data?.result === "success") setRates(data.rates); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [localCurrency]);

  if (!localCurrency) return null;

  const targets = COMMON_TARGETS.filter((c) => c !== localCurrency);
  const numericAmount = parseFloat(amount) || 0;

  return (
    <div className="card p-5">
      <p className="eyebrow mb-3">Currency converter</p>
      <div className="mb-3 flex items-center gap-2">
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
          className="w-24 border border-ink-300 bg-transparent px-2 py-1.5 text-sm text-ink-900 dark:border-ink-700 dark:text-white" />
        <span className="font-mono text-sm text-ink-500">{localCurrency}</span>
      </div>
      {loading ? (
        <p className="text-sm text-ink-400">Loading rates…</p>
      ) : rates ? (
        <ul className="space-y-1.5 text-sm">
          {targets.map((currency) => (
            <li key={currency} className="flex justify-between">
              <span className="text-ink-500">{currency}</span>
              <span className="font-mono">{rates[currency] ? (numericAmount * rates[currency]).toFixed(2) : "—"}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-ink-400">Rates unavailable right now.</p>
      )}
    </div>
  );
}