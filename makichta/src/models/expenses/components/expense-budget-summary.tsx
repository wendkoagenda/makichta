"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrency } from "@/models/settings/hooks/use-currency";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

const MONTH_LABELS: Record<string, string> = {
  "01": "Janvier", "02": "Février", "03": "Mars", "04": "Avril",
  "05": "Mai", "06": "Juin", "07": "Juillet", "08": "Août",
  "09": "Septembre", "10": "Octobre", "11": "Novembre", "12": "Décembre",
};

interface CategorySummary {
  categoryId: string;
  categoryLabel: string;
  budget: number;
  spent: number;
  isOverBudget: boolean;
  remaining: number;
}

interface ExpenseSummary {
  month: string;
  totalRevenues: number;
  totalExpenses: number;
  categories: CategorySummary[];
}

interface ExpenseBudgetSummaryProps {
  refreshKey?: number;
}

export function ExpenseBudgetSummary({ refreshKey = 0 }: ExpenseBudgetSummaryProps) {
  const currentMonth = getCurrentMonth();
  const [month, setMonth] = useState(currentMonth);
  const [summary, setSummary] = useState<ExpenseSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { convertAndFormat } = useCurrency();

  const fetchSummary = useCallback(async (m: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/expenses/summary?month=${m}`);
      if (!res.ok) throw new Error("Erreur réseau");
      const data: ExpenseSummary = await res.json();
      setSummary(data);
    } catch {
      setSummary(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary(month);
  }, [month, fetchSummary, refreshKey]);

  const overBudgetCategories = summary?.categories.filter((c) => c.isOverBudget) ?? [];
  const monthLabel = month ? `${MONTH_LABELS[month.slice(5, 7)] ?? ""} ${month.slice(0, 4)}` : "";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Résumé budget vs réel</CardTitle>
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
        >
          {(() => {
            const options: string[] = [];
            const now = new Date();
            for (let i = 0; i < 12; i++) {
              const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
              const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
              options.push(m);
            }
            return options.map((m) => (
              <option key={m} value={m}>
                {MONTH_LABELS[m.slice(5, 7)]} {m.slice(0, 4)}
              </option>
            ));
          })()}
        </select>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Chargement...</p>
        ) : !summary ? (
          <p className="text-sm text-muted-foreground">
            Impossible de charger le résumé.
          </p>
        ) : summary.categories.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aucune catégorie. Définissez des catégories de dépenses pour voir le
            résumé.
          </p>
        ) : (
          <>
            {overBudgetCategories.length > 0 && (
              <div className="flex items-start gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                <div>
                  <p className="text-sm font-medium text-destructive">
                    Dépassement du budget
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {overBudgetCategories.map((c) => c.categoryLabel).join(", ")}
                  </p>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                Revenus {monthLabel} : {convertAndFormat(summary.totalRevenues)} · Dépenses :{" "}
                {convertAndFormat(summary.totalExpenses)}
              </p>
              <ul className="space-y-2">
                {summary.categories.map((cat) => (
                  <li
                    key={cat.categoryId}
                    className={`flex items-center justify-between rounded-lg border p-3 ${
                      cat.isOverBudget
                        ? "border-destructive/50 bg-destructive/5"
                        : "border-border"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {cat.isOverBudget ? (
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 text-primary/70" />
                      )}
                      <span className="font-medium">{cat.categoryLabel}</span>
                    </div>
                    <div className="text-right text-sm">
                      <span className="text-muted-foreground">
                        {convertAndFormat(cat.spent)}
                      </span>
                      <span className="text-muted-foreground"> / </span>
                      <span>{convertAndFormat(cat.budget)}</span>
                      {cat.remaining !== 0 && (
                        <span
                          className={`ml-1 ${
                            cat.isOverBudget ? "text-destructive" : "text-muted-foreground"
                          }`}
                        >
                          (
                          {cat.remaining > 0 ? "+" : ""}
                          {convertAndFormat(cat.remaining)})
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
