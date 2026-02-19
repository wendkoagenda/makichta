"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RevenueListCard } from "@/models/revenues/components/revenue-list-card";
import { RevenueCreateDialog } from "@/models/revenues/components/revenue-create-dialog";
import { ArrowLeft } from "lucide-react";

export default function RevenueHistoryPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRevenueCreated = useCallback(() => {
    setRefreshTrigger((t) => t + 1);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Historique des revenus
          </h1>
          <p className="text-muted-foreground">
            Consultez et filtrez tous vos revenus par mois et par source
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/revenues" className="gap-1">
              <ArrowLeft size={16} />
              Revenus
            </Link>
          </Button>
        </div>
      </div>

      <RevenueListCard
        refreshTrigger={refreshTrigger}
        onOpenCreateDialog={() => setDialogOpen(true)}
      />

      <RevenueCreateDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={handleRevenueCreated}
      />
    </div>
  );
}
