"use client";

import { useState } from "react";
import { Dashboard } from "./Dashboard";
import { TransactionFeed } from "./TransactionFeed";
import { AddTransactionSheet } from "./AddTransactionSheet";
import { BudgetSetupModal } from "./BudgetSetupModal";
import { FabAdd } from "./FabAdd";
import type { Transaction } from "@/lib/types";

export function HomeScreen() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);

  const openAdd = () => {
    setEditing(null);
    setSheetOpen(true);
  };

  const openEdit = (tx: Transaction) => {
    setEditing(tx);
    setSheetOpen(true);
  };

  return (
    <>
      <Dashboard />
      <div className="mt-5 pb-28">
        <h2 className="mb-1 px-1 text-base font-semibold">Операции</h2>
        <TransactionFeed onEdit={openEdit} />
      </div>
      <FabAdd onClick={openAdd} />
      <AddTransactionSheet
        key={editing?.id ?? "add"}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        editing={editing}
      />
      <BudgetSetupModal />
    </>
  );
}
