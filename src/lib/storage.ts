import { SCHEMA_VERSION, type Budget, type Transaction } from "./types";

const VERSION_KEY = "qalta:schemaVersion";
const TX_KEY = "qalta:v1:transactions";
const BUDGET_KEY = "qalta:v1:budget";

let warned = false;

function warnOnce(err: unknown) {
  if (!warned) {
    warned = true;
    console.warn("Qalta: localStorage unavailable, using in-memory store", err);
  }
}

const memory = {
  transactions: [] as Transaction[],
  budget: null as Budget | null,
  hasLocal: false,
};

function safeGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch (err) {
    warnOnce(err);
    return null;
  }
}

function safeSet(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch (err) {
    warnOnce(err);
  }
}

function safeRemove(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch (err) {
    warnOnce(err);
  }
}

function parseTransactions(raw: string | null): Transaction[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (t): t is Transaction =>
        t &&
        typeof t.id === "string" &&
        typeof t.amount === "number" &&
        typeof t.date === "string" &&
        typeof t.category === "string",
    );
  } catch {
    return [];
  }
}

function parseBudget(raw: string | null): Budget | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed === "object" &&
      typeof parsed.monthly === "number"
    ) {
      return { monthly: parsed.monthly, updatedAt: parsed.updatedAt ?? 0 };
    }
    return null;
  } catch {
    return null;
  }
}

export interface WalletSnapshot {
  transactions: Transaction[];
  budget: Budget | null;
}

export function loadAll(): WalletSnapshot {
  if (typeof window === "undefined") {
    return { transactions: [], budget: null };
  }
  const version = Number(safeGet(VERSION_KEY) ?? SCHEMA_VERSION);
  // v1 launch: migrations map is empty; structure exists for future versions.
  if (version < SCHEMA_VERSION) {
    safeSet(VERSION_KEY, String(SCHEMA_VERSION));
  }
  const transactions = parseTransactions(safeGet(TX_KEY));
  const budget = parseBudget(safeGet(BUDGET_KEY));
  memory.transactions = transactions;
  memory.budget = budget;
  memory.hasLocal = true;
  return { transactions, budget };
}

export function saveTransactions(transactions: Transaction[]): void {
  memory.transactions = transactions;
  safeSet(TX_KEY, JSON.stringify(transactions));
}

export function saveBudget(budget: Budget | null): void {
  memory.budget = budget;
  if (budget === null) {
    safeRemove(BUDGET_KEY);
  } else {
    safeSet(BUDGET_KEY, JSON.stringify(budget));
  }
}

export function clearAllStorage(): void {
  memory.transactions = [];
  memory.budget = null;
  safeRemove(TX_KEY);
  safeRemove(BUDGET_KEY);
  safeRemove(VERSION_KEY);
}
