"use client";

import { useState } from "react";
import { InvestmentSummary } from "@/models/investments/components/investment-summary";
import { InvestmentList } from "@/models/investments/components/investment-list";

export default function InvestmentsPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Investissement</h1>
        <p className="text-muted-foreground">
          Suivez vos investissements par type et consultez l&apos;historique
        </p>
      </div>
      <div className="space-y-6">
        <InvestmentSummary refreshKey={refreshKey} />
        <InvestmentList onInvestmentChange={() => setRefreshKey((k) => k + 1)} />
      </div>
    </div>
  );
}
