"use client";

import { PlannedExpenseList } from "@/models/planned-expenses/components/planned-expense-list";

export default function PlanningPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Planification</h1>
        <p className="text-muted-foreground">
          Planifiez vos dépenses futures et anticipez votre budget
        </p>
      </div>
      <PlannedExpenseList />
    </div>
  );
}
