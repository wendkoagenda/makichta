"use client";

import { useState } from "react";
import { ExpenseCategoryList } from "@/models/expense-categories/components/expense-category-list";
import { ExpenseList } from "@/models/expenses/components/expense-list";
import { ExpenseBudgetSummary } from "@/models/expenses/components/expense-budget-summary";

export default function ExpensesPage() {
  const [summaryRefreshKey, setSummaryRefreshKey] = useState(0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dépenses</h1>
        <p className="text-muted-foreground">
          Suivez vos dépenses par catégorie et comparez au budget prévu
        </p>
      </div>

      <ExpenseBudgetSummary refreshKey={summaryRefreshKey} />
      <ExpenseList onExpenseChange={() => setSummaryRefreshKey((k) => k + 1)} />
      <ExpenseCategoryList
        onCategoryChange={() => setSummaryRefreshKey((k) => k + 1)}
      />
    </div>
  );
}
