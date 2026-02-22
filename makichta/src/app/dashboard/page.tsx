"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useCurrency } from "@/models/settings/hooks/use-currency";
import { useDuplicateMonth } from "@/models/months/hooks/use-duplicate-month";
import { Wallet, CreditCard, PiggyBank, TrendingUp, Copy } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const MONTH_LABELS: Record<string, string> = {
  "01": "Jan",
  "02": "Fev",
  "03": "Mar",
  "04": "Avr",
  "05": "Mai",
  "06": "Juin",
  "07": "Juil",
  "08": "Aout",
  "09": "Sep",
  "10": "Oct",
  "11": "Nov",
  "12": "Dec",
};

const COLORS = ["#d4af37", "#f5d76e", "#b68c2a", "#8899aa", "#1a2230"];

interface MonthlyData {
  month: string;
  totalRevenues: number;
  totalExpenses: number;
  totalSavings: number;
  savingsByType?: { target: number; emergency: number };
  totalInvestments: number;
  savingsRate: number;
  remainingToLive: number;
  expenseByCategory: {
    categoryId: string;
    label: string;
    amount: number;
    percent: number;
    allocated?: number;
  }[];
  goalsProgress: {
    label: string;
    savingType?: "TARGET" | "EMERGENCY";
    current: number;
    target: number;
    percent: number;
  }[];
}

interface AnnualRow {
  month: string;
  monthLabel: string;
  revenues: number;
  expenses: number;
  savings: number;
}

function getCurrentMonth(): string {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0");
}

function buildMonthOptions(): string[] {
  const opts: string[] = [];
  const d = new Date();
  for (let i = 0; i < 12; i++) {
    const dt = new Date(d.getFullYear(), d.getMonth() - i, 1);
    opts.push(
      dt.getFullYear() + "-" + String(dt.getMonth() + 1).padStart(2, "0")
    );
  }
  return opts;
}

function getNextMonth(month: string): string {
  const [y, m] = month.split("-").map(Number);
  if (m === 12) return `${y + 1}-01`;
  return `${y}-${String(m + 1).padStart(2, "0")}`;
}

function formatMonthLabel(month: string): string {
  const k = month.slice(5, 7);
  return (MONTH_LABELS[k] || k) + " " + month.slice(0, 4);
}

function MonthlyView(props: {
  data: MonthlyData | null;
  monthLabel: string;
  convertAndFormat: (v: number) => string;
}) {
  const { data, monthLabel, convertAndFormat } = props;
  const expenseByCategory = data?.expenseByCategory ?? [];
  const pieData = expenseByCategory.map(function (c) {
    return {
      name: c.label,
      value: c.amount,
      percent: c.percent,
    };
  });

  return (
    <React.Fragment>
      <div className="grid min-w-0 grid-cols-2 gap-4 lg:grid-cols-5">
        <Card className="min-w-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Revenus {monthLabel}
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {convertAndFormat(data?.totalRevenues ?? 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {data?.totalRevenues ? "Total du mois" : "Aucun revenu"}
            </p>
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Depenses {monthLabel}
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              -{convertAndFormat(data?.totalExpenses ?? 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {data?.totalExpenses ? "Total du mois" : "Aucune depense"}
            </p>
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Epargne objectifs
            </CardTitle>
            <PiggyBank className="h-4 w-4 text-primary/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {convertAndFormat(data?.savingsByType?.target ?? data?.totalSavings ?? 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Dépense prévue · contributions du mois
            </p>
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Epargne fonds de secours
            </CardTitle>
            <PiggyBank className="h-4 w-4 text-amber-600 dark:text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-500">
              {convertAndFormat(data?.savingsByType?.emergency ?? 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Fonds de secours · contributions du mois
            </p>
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Investissements
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {convertAndFormat(data?.totalInvestments ?? 0)}
            </div>
            <p className="text-xs text-muted-foreground">Du mois</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Indicateurs cles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Reste a vivre</span>
              <span
                className={
                  (data?.remainingToLive ?? 0) >= 0
                    ? "font-medium text-primary"
                    : "font-medium text-destructive"
                }
              >
                {convertAndFormat(data?.remainingToLive ?? 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{"Taux d'epargne"}</span>
              <span className="font-medium">{data?.savingsRate ?? 0} %</span>
            </div>
          </CardContent>
        </Card>

        {pieData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Repartition des depenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      nameKey="name"
                      label={function (props: {
                        payload?: { name?: string; percent?: number };
                      }) {
                        const p = props.payload;
                        return (
                          (p?.name ?? "") +
                          " " +
                          ((p?.percent ?? 0) * 100).toFixed(0) +
                          "%"
                        );
                      }}
                    >
                      {pieData.map(function (_, i) {
                        return (
                          <Cell
                            key={i}
                            fill={COLORS[i % COLORS.length]}
                          />
                        );
                      })}
                    </Pie>
                    <Tooltip
                      formatter={function (v: number | undefined) {
                        return convertAndFormat(v ?? 0);
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {expenseByCategory.some((c) => c.allocated != null && c.allocated > 0) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Alloué vs dépensé par catégorie
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {expenseByCategory
                  .filter((c) => c.allocated != null && c.allocated > 0)
                  .map((c) => (
                    <li
                      key={c.categoryId}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border p-2 text-sm"
                    >
                      <span className="font-medium">{c.label}</span>
                      <span className="flex gap-3 text-muted-foreground">
                        <span>
                          Alloué : {convertAndFormat(c.allocated ?? 0)}
                        </span>
                        <span>Dépensé : {convertAndFormat(c.amount)}</span>
                        {(c.allocated ?? 0) > 0 && c.amount > (c.allocated ?? 0) && (
                          <span className="text-destructive">Dépassement</span>
                        )}
                      </span>
                    </li>
                  ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      {data?.goalsProgress && data.goalsProgress.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {"Objectifs d'epargne"}
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Objectifs (dépense prévue) et fonds de secours
            </p>
          </CardHeader>
          <CardContent className="min-w-0">
            <div className="h-[200px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.goalsProgress.map((g) => ({
                    ...g,
                    displayLabel:
                      g.savingType === "EMERGENCY"
                        ? `${g.label} (Fonds de secours)`
                        : `${g.label} (Objectif)`,
                  }))}
                  layout="vertical"
                  margin={{ left: 48, right: 8 }}
                >
                  <XAxis
                    type="number"
                    tick={{ fontSize: 10 }}
                    tickFormatter={function (v) {
                      return v + "%";
                    }}
                  />
                  <YAxis
                    type="category"
                    dataKey="displayLabel"
                    width={46}
                    tick={{ fontSize: 10 }}
                    tickFormatter={(v) => (typeof v === "string" && v.length > 18 ? v.slice(0, 16) + "…" : v)}
                  />
                  <Tooltip
                    formatter={function (v: number | undefined) {
                      return (v ?? 0).toFixed(0) + " %";
                    }}
                    labelFormatter={function (l) {
                      return String(l);
                    }}
                  />
                  <Bar
                    dataKey="percent"
                    fill="hsl(var(--primary))"
                    name="Progression %"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </React.Fragment>
  );
}

function AnnualView(props: {
  year: number;
  setYear: (y: number) => void;
  annualData: AnnualRow[];
  convertAndFormat: (v: number) => string;
}) {
  const { year, setYear, annualData, convertAndFormat } = props;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historique {year}</CardTitle>
        <div className="flex gap-2">
          <select
            value={year}
            onChange={function (e) {
              setYear(Number(e.target.value));
            }}
            className="rounded-md border border-input bg-background px-2 py-1 text-sm"
          >
            {[0, 1, 2].map(function (i) {
              const y = new Date().getFullYear() - i;
              return (
                <option key={y} value={y}>
                  {y}
                </option>
              );
            })}
          </select>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="mb-2 text-sm font-medium text-muted-foreground">
            Revenus, depenses, epargne par mois
          </h4>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={annualData}
                margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
              >
                <XAxis dataKey="monthLabel" tick={{ fontSize: 11 }} />
                <YAxis
                  tickFormatter={function (v) {
                    return String(v);
                  }}
                />
                <Tooltip
                  formatter={function (v: number | undefined) {
                    return convertAndFormat(v ?? 0);
                  }}
                />
                <Bar dataKey="revenues" fill="#d4af37" name="Revenus" />
                <Bar dataKey="expenses" fill="#e54545" name="Depenses" />
                <Bar dataKey="savings" fill="#8899aa" name="Epargne" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div>
          <h4 className="mb-2 text-sm font-medium text-muted-foreground">
            {"Evolution de l'epargne"}
          </h4>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={annualData}
                margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
              >
                <XAxis dataKey="monthLabel" tick={{ fontSize: 11 }} />
                <YAxis
                  tickFormatter={function (v) {
                    return convertAndFormat(v);
                  }}
                />
                <Tooltip
                  formatter={function (v: number | undefined) {
                    return convertAndFormat(v ?? 0);
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="savings"
                  stroke="#8899aa"
                  strokeWidth={2}
                  name="Epargne"
                  dot={{ fill: "#8899aa" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { convertAndFormat } = useCurrency();
  const { duplicate, isLoading: isDuplicating, error: duplicateError } = useDuplicateMonth();
  const [monthId, setMonthId] = useState(getCurrentMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [data, setData] = useState<MonthlyData | null>(null);
  const [annualData, setAnnualData] = useState<AnnualRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAnnual, setShowAnnual] = useState(false);
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);
  const [includeRevenues, setIncludeRevenues] = useState(false);

  const fetchData = useCallback(
    async function (m: string) {
      setIsLoading(true);
      try {
        const res = await fetch("/api/dashboard/monthly?month=" + encodeURIComponent(m));
        if (!res.ok) throw new Error("Erreur");
        const d = await res.json();
        setData(d);
      } catch (_e) {
        setData(null);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(
    function () {
      fetchData(monthId);
    },
    [monthId, fetchData]
  );

  useEffect(
    function () {
      const onVisibility = () => {
        if (document.visibilityState === "visible" && !showAnnual) fetchData(monthId);
      };
      document.addEventListener("visibilitychange", onVisibility);
      return () => document.removeEventListener("visibilitychange", onVisibility);
    },
    [monthId, fetchData, showAnnual]
  );

  useEffect(
    function () {
      if (!showAnnual) return;
      fetch("/api/dashboard/annual?year=" + year)
        .then(function (r) {
          return r.ok ? r.json() : [];
        })
        .then(function (d) {
          const arr = Array.isArray(d) ? d : [];
          return arr.map(function (row: {
            month: string;
            revenues: number;
            expenses: number;
            savings: number;
          }) {
            const key = row.month ? row.month.slice(5, 7) : "";
            return {
              month: row.month,
              monthLabel: MONTH_LABELS[key] || key,
              revenues: row.revenues,
              expenses: row.expenses,
              savings: row.savings,
            };
          });
        })
        .then(setAnnualData)
        .catch(function () {
          setAnnualData([]);
        });
    },
    [showAnnual, year]
  );

  let ml = "";
  if (monthId) {
    const k = monthId.slice(5, 7);
    ml = (MONTH_LABELS[k] || "") + " " + monthId.slice(0, 4);
  }

  const monthOptions = buildMonthOptions();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            Tableau de bord
          </h1>
          <p className="text-muted-foreground">
            {"Vue d'ensemble de vos finances"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={monthId}
            onChange={function (e) {
              setMonthId(e.target.value);
            }}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {monthOptions.map(function (m) {
              return (
                <option key={m} value={m}>
                  {MONTH_LABELS[m.slice(5, 7)]} {m.slice(0, 4)}
                </option>
              );
            })}
          </select>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setDuplicateDialogOpen(true)}
            className="gap-1"
          >
            <Copy className="h-4 w-4" />
            Dupliquer vers le mois suivant
          </Button>
          <button
            type="button"
            onClick={function () {
              setShowAnnual(!showAnnual);
            }}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-accent"
          >
            {showAnnual ? "Vue mensuelle" : "Vue annuelle"}
          </button>
        </div>
      </div>

      <Dialog open={duplicateDialogOpen} onOpenChange={setDuplicateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dupliquer vers le mois suivant</DialogTitle>
            <DialogDescription>
              Copie les règles de répartition et les catégories de dépenses du mois
              affiché vers le mois suivant. Vous pouvez optionnellement inclure les
              revenus.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Mois source</Label>
              <p className="text-sm text-muted-foreground">
                {formatMonthLabel(monthId)}
              </p>
            </div>
            <div className="grid gap-2">
              <Label>Mois cible</Label>
              <p className="text-sm text-muted-foreground">
                {formatMonthLabel(getNextMonth(monthId))}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="include-revenues"
                checked={includeRevenues}
                onChange={(e) => setIncludeRevenues(e.target.checked)}
                className="h-4 w-4 rounded border-input"
              />
              <Label htmlFor="include-revenues">Inclure les revenus</Label>
            </div>
            {duplicateError && (
              <p className="text-sm text-destructive">{duplicateError}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDuplicateDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button
              disabled={isDuplicating}
              onClick={async () => {
                const targetMonthId = getNextMonth(monthId);
                const result = await duplicate(monthId, targetMonthId, includeRevenues);
                if (result) {
                  setDuplicateDialogOpen(false);
                  setMonthId(targetMonthId);
                }
              }}
            >
              {isDuplicating ? "Duplication…" : "Dupliquer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showAnnual ? (
        <AnnualView
          year={year}
          setYear={setYear}
          annualData={annualData}
          convertAndFormat={convertAndFormat}
        />
      ) : isLoading ? (
        <p className="text-muted-foreground">Chargement...</p>
      ) : (
        <MonthlyView
          data={data}
          monthLabel={ml}
          convertAndFormat={convertAndFormat}
        />
      )}
    </div>
  );
}
