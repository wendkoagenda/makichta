"use client";

import { useState } from "react";
import { ExpenseList } from "@/models/expenses/components/expense-list";
import { ExpenseBudgetSummary } from "@/models/expenses/components/expense-budget-summary";

export default function ExpensesPage() {
  const [summaryRefreshKey, setSummaryRefreshKey] = useState(0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Dépenses</h1>
        <p className="text-muted-foreground">
          Suivez vos dépenses par catégorie et comparez au budget prévu
        </p>
      </div>

      <ExpenseBudgetSummary refreshKey={summaryRefreshKey} />
      <ExpenseList onExpenseChange={() => setSummaryRefreshKey((k) => k + 1)} />
    </div>
  );
}
