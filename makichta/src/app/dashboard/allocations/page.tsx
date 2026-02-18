"use client";

import { AllocationRuleList } from "@/models/allocation-rules/components/allocation-rule-list";

export default function AllocationsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Répartition</h1>
        <p className="text-muted-foreground">
          Définissez les pourcentages par poste (épargne, charges, loisirs…). Les
          montants seront calculés automatiquement à chaque nouveau revenu.
        </p>
      </div>
      <AllocationRuleList />
    </div>
  );
}
