"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  clearAllStorage,
  loadAll,
  saveBudget,
  saveTransactions,
} from "@/lib/storage";
import type { CategoryId, Transaction } from "@/lib/types";

export interface WalletState {
  hydrated: boolean;
  transactions: Transaction[];
  budget: number | null;
}

export interface WalletActions {
  addTransaction(
    input: Omit<Transaction, "id" | "createdAt">,
  ): void;
  updateTransaction(id: string, patch: Partial<Transaction>): void;
  deleteTransaction(id: string): void;
  setBudget(monthly: number): void;
  clearAll(): void;
}

export type WalletContextValue = WalletState & WalletActions;

export const WalletContext = createContext<WalletContextValue | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budget, setBudgetState] = useState<number | null>(null);
  const txRef = useRef<Transaction[]>([]);

  useEffect(() => {
    // localStorage is an external system; setState after mount is the hydration gate
    const snap = loadAll();
    txRef.current = snap.transactions;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTransactions(snap.transactions);
     
    setBudgetState(snap.budget?.monthly ?? null);
     
    setHydrated(true);
  }, []);

  const addTransaction = useCallback(
    (input: Omit<Transaction, "id" | "createdAt">) => {
      const tx: Transaction = {
        ...input,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      };
      const next = [...txRef.current, tx];
      txRef.current = next;
      setTransactions(next);
      saveTransactions(next);
    },
    [],
  );

  const updateTransaction = useCallback(
    (id: string, patch: Partial<Transaction>) => {
      const next = txRef.current.map((t) =>
        t.id === id ? { ...t, ...patch } : t,
      );
      txRef.current = next;
      setTransactions(next);
      saveTransactions(next);
    },
    [],
  );

  const deleteTransaction = useCallback((id: string) => {
    const next = txRef.current.filter((t) => t.id !== id);
    txRef.current = next;
    setTransactions(next);
    saveTransactions(next);
  }, []);

  const setBudget = useCallback((monthly: number) => {
    setBudgetState(monthly);
    saveBudget({ monthly, updatedAt: Date.now() });
  }, []);

  const clearAll = useCallback(() => {
    txRef.current = [];
    setTransactions([]);
    setBudgetState(null);
    clearAllStorage();
  }, []);

  const value = useMemo(
    () => ({
      hydrated,
      transactions,
      budget,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      setBudget,
      clearAll,
    }),
    [
      hydrated,
      transactions,
      budget,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      setBudget,
      clearAll,
    ],
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export type { CategoryId };
