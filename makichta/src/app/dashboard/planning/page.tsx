"use client";

import { PlannedExpenseList } from "@/models/planned-expenses/components/planned-expense-list";

export default function PlanningPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Planification</h1>
        <p className="text-muted-foreground">
          Planifiez vos dépenses futures et anticipez votre budget
        </p>
      </div>
      <PlannedExpenseList />
    </div>
  );
}
