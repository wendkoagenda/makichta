"use client";

import { useState, useCallback } from "react";
import { RevenueSourceList } from "@/models/revenues/components/revenue-source-list";
import { RevenueCreateDialog } from "@/models/revenues/components/revenue-create-dialog";
import { RevenueListCard } from "@/models/revenues/components/revenue-list-card";

export default function RevenuesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRevenueCreated = useCallback(() => {
    setRefreshTrigger((t) => t + 1);
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Revenus</h1>
        <p className="text-muted-foreground">
          Gérez vos sources de revenus et enregistrez vos entrées d&apos;argent
        </p>
      </div>

      <div className="space-y-8">
        <RevenueSourceList />

        <RevenueListCard
          refreshTrigger={refreshTrigger}
          onOpenCreateDialog={() => setDialogOpen(true)}
        />
      </div>

      <RevenueCreateDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={handleRevenueCreated}
      />
    </div>
  );
}
