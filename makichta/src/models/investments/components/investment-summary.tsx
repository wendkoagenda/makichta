"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrency } from "@/models/settings/hooks/use-currency";
import { INVESTMENT_TYPE_LABELS } from "../constants/investment-types";

interface TypeSummary {
  type: string;
  total: number;
  count: number;
  percent: number;
}

interface InvestmentSummary {
  total: number;
  allocatedFromRevenues: number;
  byType: TypeSummary[];
}

interface InvestmentSummaryProps {
  refreshKey?: number;
}

export function InvestmentSummary({ refreshKey = 0 }: InvestmentSummaryProps) {
  const { convertAndFormat } = useCurrency();
  const [summary, setSummary] = useState<InvestmentSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/investments/summary")
      .then((r) => (r.ok ? r.json() : null))
      .then(setSummary)
      .catch(() => setSummary(null))
      .finally(() => setIsLoading(false));
  }, [refreshKey]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Répartition par type</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Chargement...</p>
        </CardContent>
      </Card>
    );
  }

  if (!summary) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Répartition par type</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Impossible de charger le résumé.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Répartition par type</CardTitle>
        <div className="space-y-1 text-sm text-muted-foreground">
          <p>
            Total investi : <strong className="text-foreground">{convertAndFormat(summary.total)}</strong>
          </p>
          {summary.allocatedFromRevenues > 0 && (
            <p>
              Alloué via répartition des revenus :{" "}
              <strong className="text-primary">
                {convertAndFormat(summary.allocatedFromRevenues)}
              </strong>
            </p>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {summary.byType.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {summary.allocatedFromRevenues > 0
              ? "Aucun investissement enregistré. Le montant alloué via la répartition est disponible pour investir."
              : "Aucun investissement enregistré."}
          </p>
        ) : (
        <ul className="space-y-2">
          {summary.byType.map((item) => (
            <li
              key={item.type}
              className="flex items-center justify-between rounded-lg border border-border p-3"
            >
              <span>{INVESTMENT_TYPE_LABELS[item.type] ?? item.type}</span>
              <div className="text-right text-sm">
                <span>{convertAndFormat(item.total)}</span>
                <span className="ml-1 text-muted-foreground">
                  ({item.percent} %)
                </span>
              </div>
            </li>
          ))}
        </ul>
        )}
      </CardContent>
    </Card>
  );
}
