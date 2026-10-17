"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { CATEGORIES, CATEGORY_MAP } from "@/lib/categories";
import { parseAmount } from "@/lib/format";
import { todayKey } from "@/lib/date";
import type { CategoryId, Transaction } from "@/lib/types";
import { Icon } from "./Icon";

interface Props {
  open: boolean;
  onClose: () => void;
  editing?: Transaction | null;
}

export function AddTransactionSheet({ open, onClose, editing }: Props) {
  const { addTransaction, updateTransaction, deleteTransaction } = useWallet();
  const [amount, setAmount] = useState(() =>
    editing ? String(editing.amount) : "",
  );
  const [category, setCategory] = useState<CategoryId | null>(
    editing?.category ?? null,
  );
  const [note, setNote] = useState(editing?.note ?? "");
  const [date, setDate] = useState(editing?.date ?? "");
  const [dateReady, setDateReady] = useState(Boolean(editing));

  useEffect(() => {
    // todayKey() is client-only; set after mount to avoid prerender instability
    if (!editing && !dateReady) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDate(todayKey());
       
      setDateReady(true);
    }
  }, [editing, dateReady]);

  if (!open) return null;

  const parsed = parseAmount(amount);
  const canSave = parsed !== null && category !== null && date !== "";

  const handleSave = () => {
    if (!canSave || parsed === null || category === null) return;
    if (editing) {
      updateTransaction(editing.id, {
        amount: parsed,
        category,
        note: note.trim() || undefined,
        date,
      });
    } else {
      addTransaction({
        amount: parsed,
        category,
        note: note.trim() || undefined,
        date,
      });
    }
    onClose();
  };

  const handleDelete = () => {
    if (!editing) return;
    if (window.confirm("Удалить операцию?")) {
      deleteTransaction(editing.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button
        type="button"
        aria-label="Закрыть"
        onClick={onClose}
        className="absolute inset-0 bg-black/40 animate-fade-in"
      />
      <div className="relative z-10 max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-card p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] animate-sheet-up">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />

        <input
          type="text"
          inputMode="decimal"
          autoFocus={!editing}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Сумма"
          className="w-full border-none bg-transparent py-3 text-center text-4xl font-semibold tabular outline-none placeholder:text-border"
        />
        {amount.trim() !== "" && parsed === null && (
          <p className="text-center text-sm text-danger">Введите сумму</p>
        )}

        <p className="mt-4 mb-2 text-sm font-medium text-muted">Категория</p>
        <div className="grid grid-cols-3 gap-2">
          {CATEGORIES.map((c) => {
            const selected = category === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategory(c.id)}
                className={`flex flex-col items-center gap-1.5 rounded-2xl border px-2 py-3 text-[11px] font-medium transition-colors ${
                  selected
                    ? "border-primary bg-primary/10 text-primary-dark"
                    : "border-border bg-bg text-ink"
                }`}
              >
                <Icon name={c.icon} className="h-6 w-6" />
                <span className="max-w-full truncate">{c.label}</span>
              </button>
            );
          })}
        </div>

        <input
          type="text"
          value={note}
          maxLength={120}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Заметка (необязательно)"
          className="mt-4 w-full rounded-2xl border border-border bg-bg px-4 py-3 text-sm outline-none focus:border-primary"
        />

        <label className="mt-3 block text-sm text-muted">
          Дата
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 w-full rounded-2xl border border-border bg-bg px-4 py-3 text-sm text-ink outline-none focus:border-primary"
          />
        </label>

        <button
          type="button"
          onClick={handleSave}
          disabled={!canSave}
          className="mt-5 w-full rounded-2xl bg-primary py-3.5 font-semibold text-white transition-transform disabled:opacity-40 active:scale-[0.98]"
        >
          Сохранить
        </button>

        {editing && (
          <button
            type="button"
            onClick={handleDelete}
            className="mt-2 w-full rounded-2xl py-3 font-medium text-danger active:bg-danger/5"
          >
            Удалить
          </button>
        )}

        <p className="mt-2 text-center text-xs text-muted">
          {category ? CATEGORY_MAP[category].label : ""}
        </p>
      </div>
    </div>
  );
}
