"use client";

import { AssetList } from "@/models/assets/components/asset-list";

export default function DepreciationPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Amortissement</h1>
        <p className="text-muted-foreground">
          Suivez l&apos;amortissement de vos biens et leur valeur résiduelle
        </p>
      </div>
      <AssetList />
    </div>
  );
}
