"use client";

import { useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { parseAmount } from "@/lib/format";

export function BudgetSetupModal() {
  const { hydrated, budget, setBudget } = useWallet();
  const [raw, setRaw] = useState("");

  if (!hydrated || budget !== null) return null;

  const parsed = parseAmount(raw);
  const canSubmit = parsed !== null && parsed > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6 animate-fade-in">
      <div className="w-full max-w-sm rounded-3xl bg-card p-6 shadow-xl animate-modal-in">
        <h2 className="text-xl font-semibold">Задайте месячный бюджет</h2>
        <p className="mt-1 text-sm text-muted">
          Сколько вы планируете потратить в месяц?
        </p>
        <input
          type="text"
          inputMode="decimal"
          autoFocus
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && canSubmit && parsed !== null)
              setBudget(parsed);
          }}
          placeholder="50 000"
          className="mt-5 w-full rounded-2xl border border-border bg-bg px-4 py-3 text-center text-3xl font-semibold tabular outline-none focus:border-primary"
        />
        <button
          type="button"
          disabled={!canSubmit || parsed === null}
          onClick={() => parsed !== null && setBudget(parsed)}
          className="mt-4 w-full rounded-2xl bg-primary py-3.5 font-semibold text-white disabled:opacity-40 active:scale-[0.98] transition-transform"
        >
          Начать
        </button>
      </div>
    </div>
  );
}
