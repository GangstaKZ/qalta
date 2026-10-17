"use client";

import { useWallet } from "@/hooks/useWallet";
import { BudgetForm } from "@/components/BudgetForm";
import { Card } from "@/components/ui/Card";

export function SettingsScreen() {
  const { clearAll } = useWallet();

  const handleClear = () => {
    if (window.confirm("Удалить все операции и бюджет? Это нельзя отменить.")) {
      clearAll();
    }
  };

  return (
    <div className="pb-24">
      <h1 className="mb-4 text-xl font-semibold">Настройки</h1>
      <BudgetForm />
      <Card className="mt-4">
        <p className="text-sm font-medium">Данные</p>
        <p className="mt-1 text-sm text-muted">
          Все данные хранятся только на этом устройстве (localStorage).
          Резервная копия не создаётся.
        </p>
        <button
          type="button"
          onClick={handleClear}
          className="mt-4 w-full rounded-2xl border border-danger/30 py-3 text-sm font-semibold text-danger active:bg-danger/5"
        >
          Очистить все данные
        </button>
      </Card>
      <p className="mt-6 text-center text-xs text-muted">Qalta · KZT · v1.0</p>
    </div>
  );
}
