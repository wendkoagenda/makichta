"use client";

import { AssetList } from "@/models/assets/components/asset-list";

export default function DepreciationPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Actifs & passifs</h1>
        <p className="text-muted-foreground">
          Listez vos actifs (biens) et passifs (dettes) dans un tableau
        </p>
      </div>
      <AssetList />
    </div>
  );
}
