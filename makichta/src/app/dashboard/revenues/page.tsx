"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MonthPicker } from "@/components/ui/month-picker";
import { RevenueSourceList } from "@/models/revenues/components/revenue-source-list";
import { RevenueCreateDialog } from "@/models/revenues/components/revenue-create-dialog";
import { useRevenues } from "@/models/revenues/hooks/use-revenues";
import { useCurrency } from "@/models/settings/hooks/use-currency";
import { History } from "lucide-react";

function getCurrentMonthId(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default function RevenuesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [monthId, setMonthId] = useState(getCurrentMonthId);
  const { revenues, isLoading, fetchRevenues } = useRevenues();
  const { convertAndFormat } = useCurrency();

  useEffect(() => {
    fetchRevenues({ monthId });
  }, [monthId, fetchRevenues]);

  const handleRevenueCreated = useCallback(() => {
    fetchRevenues({ monthId });
  }, [monthId, fetchRevenues]);

  const totalMonth = revenues.reduce((s, r) => s + r.amount, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Revenus</h1>
          <p className="text-muted-foreground">
            Gérez vos sources de revenus et enregistrez vos entrées d&apos;argent
          </p>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <MonthPicker
            label="Mois"
            value={monthId}
            onValueChange={setMonthId}
            triggerClassName="w-full sm:w-[180px]"
          />
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/revenue-history" className="gap-1">
              <History size={16} />
              Historique des revenus
            </Link>
          </Button>
          <Button size="sm" onClick={() => setDialogOpen(true)}>
            Saisir un revenu
          </Button>
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Chargement…</p>
      ) : (
        <p className="text-sm text-muted-foreground">
          Total du mois sélectionné : <strong className="text-foreground">{convertAndFormat(totalMonth)}</strong>
          {revenues.length > 0 && (
            <span> ({revenues.length} revenu{revenues.length > 1 ? "s" : ""})</span>
          )}
        </p>
      )}

      <RevenueSourceList />

      <RevenueCreateDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={handleRevenueCreated}
      />
    </div>
  );
}
