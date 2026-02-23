"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCurrency } from "@/models/settings/hooks/use-currency";
import type { ContributionEnriched } from "@/models/saving-goals/types/contribution-enriched";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";

const MONTH_LABELS: Record<string, string> = {
  "01": "Janvier", "02": "Février", "03": "Mars", "04": "Avril",
  "05": "Mai", "06": "Juin", "07": "Juillet", "08": "Août",
  "09": "Septembre", "10": "Octobre", "11": "Novembre", "12": "Décembre",
};

function formatMonthId(monthId: string): string {
  const [y, m] = monthId.split("-");
  const monthName = MONTH_LABELS[m] ?? m;
  return `${monthName} ${y}`;
}

export default function ContributionsPage() {
  const { convertAndFormat } = useCurrency();
  const [contributions, setContributions] = useState<ContributionEnriched[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"goal" | "month">("goal");
  const [selectedGoalId, setSelectedGoalId] = useState<string>("");
  const [selectedMonthId, setSelectedMonthId] = useState<string>("");

  const fetchContributions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/contributions");
      if (res.ok) {
        const data: ContributionEnriched[] = await res.json();
        setContributions(data);
        if (data.length > 0) {
          const goalIds = [...new Set(data.map((c) => c.savingGoalId))];
          const monthIds = [...new Set(data.map((c) => c.monthId))].sort().reverse();
          setSelectedGoalId((prev) => (goalIds.includes(prev) ? prev : goalIds[0] ?? ""));
          setSelectedMonthId((prev) => (monthIds.includes(prev) ? prev : monthIds[0] ?? ""));
        }
      } else {
        setContributions([]);
      }
    } catch {
      setContributions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContributions();
  }, [fetchContributions]);

  const goals = Array.from(
    new Map(contributions.map((c) => [c.savingGoalId, { id: c.savingGoalId, label: c.goalLabel, projectLabel: c.projectLabel }])).values()
  ).sort((a, b) => a.label.localeCompare(b.label));

  const months = [...new Set(contributions.map((c) => c.monthId))].sort().reverse();

  const filteredByGoal =
    mode === "goal" && selectedGoalId
      ? contributions.filter((c) => c.savingGoalId === selectedGoalId)
      : [];
  const filteredByMonth =
    mode === "month" && selectedMonthId
      ? contributions.filter((c) => c.monthId === selectedMonthId)
      : [];
  const rows = mode === "goal" ? filteredByGoal : filteredByMonth;

  const handleDelete = async (id: string) => {
    if (!confirm("Retirer cette contribution ? Le montant sera enlevé de l’objectif.")) return;
    const res = await fetch(`/api/saving-goals/contributions/${id}`, { method: "DELETE" });
    if (res.ok) fetchContributions();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          Historique des contributions
        </h1>
        <p className="text-muted-foreground">
          Tableau des contributions manuelles et automatiques, par objectif ou par mois
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base">Filtrer par</CardTitle>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex rounded-md border border-border p-0.5">
              <button
                type="button"
                onClick={() => setMode("goal")}
                className={cn(
                  "rounded px-3 py-1.5 text-sm font-medium",
                  mode === "goal"
                    ? "bg-primary text-primary-foreground"
                    : "bg-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                Par objectif
              </button>
              <button
                type="button"
                onClick={() => setMode("month")}
                className={cn(
                  "rounded px-3 py-1.5 text-sm font-medium",
                  mode === "month"
                    ? "bg-primary text-primary-foreground"
                    : "bg-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                Par mois
              </button>
            </div>
            {mode === "goal" && goals.length > 0 && (
              <Select value={selectedGoalId} onValueChange={setSelectedGoalId}>
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Choisir un objectif" />
                </SelectTrigger>
                <SelectContent>
                  {goals.map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                      {g.projectLabel ? `${g.label} · ${g.projectLabel}` : g.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {mode === "month" && months.length > 0 && (
              <Select value={selectedMonthId} onValueChange={setSelectedMonthId}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Choisir un mois" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((monthId) => (
                    <SelectItem key={monthId} value={monthId}>
                      {formatMonthId(monthId)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Chargement...</p>
          ) : contributions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aucune contribution. Les contributions apparaissent lorsque vous ajoutez un versement
              sur un objectif ou via la répartition des revenus.
            </p>
          ) : rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aucune contribution pour cette sélection.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-md border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    {mode === "month" && (
                      <th className="px-4 py-2 text-left font-medium">Objectif</th>
                    )}
                    <th className="px-4 py-2 text-left font-medium">Date</th>
                    <th className="px-4 py-2 text-right font-medium">Montant</th>
                    <th className="px-4 py-2 text-left font-medium">Type</th>
                    <th className="w-10 px-2 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((c) => (
                    <tr
                      key={c.id}
                      className={cn(
                        "border-b border-border last:border-0",
                        c.amount < 0 && "text-destructive"
                      )}
                    >
                      {mode === "month" && (
                        <td className="px-4 py-2">
                          {c.projectLabel ? `${c.goalLabel} · ${c.projectLabel}` : c.goalLabel}
                        </td>
                      )}
                      <td className="px-4 py-2">{c.date}</td>
                      <td className="px-4 py-2 text-right tabular-nums">
                        {c.amount >= 0 ? "+" : ""}{convertAndFormat(c.amount)}
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={cn(
                            "inline-flex rounded px-1.5 py-0.5 text-xs font-medium",
                            c.isAutomatic
                              ? "bg-primary/10 text-primary"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {c.isAutomatic ? "Automatique" : "Manuel"}
                        </span>
                      </td>
                      <td className="px-2 py-2">
                        {c.isAutomatic && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(c.id)}
                            className="text-destructive hover:text-destructive"
                            title="Retirer cette contribution"
                          >
                            <Trash2 size={16} />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
