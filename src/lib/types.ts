export type CategoryId =
  | "food"
  | "transport"
  | "housing"
  | "cafe"
  | "shopping"
  | "health"
  | "entertainment"
  | "comms"
  | "subscriptions"
  | "other";

export interface Category {
  id: CategoryId;
  label: string;
  color: string;
  icon: string;
}

export interface Transaction {
  id: string;
  amount: number;
  category: CategoryId;
  note?: string;
  date: string; // YYYY-MM-DD local calendar day
  createdAt: number;
}

export interface Budget {
  monthly: number;
  updatedAt: number;
}

export const SCHEMA_VERSION = 1;
