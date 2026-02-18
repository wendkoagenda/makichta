"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useCurrency } from "@/models/settings/hooks/use-currency";
import { useRevenues } from "../hooks/use-revenues";
import { useRevenueSources } from "../hooks/use-revenue-sources";
import { Plus, Trash2 } from "lucide-react";
import { useState, useMemo } from "react";
import type { Revenue } from "../types/revenue";

const MONTH_NAMES = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

function getMonthOptions(): { value: string; label: string }[] {
  const options: { value: string; label: string }[] = [
    { value: "all", label: "Afficher tous les mois" },
  ];
  const now = new Date();
  for (let i = 0; i < 24; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    options.push({
      value: `${y}-${m}`,
      label: `${MONTH_NAMES[d.getMonth()]} ${y}`,
    });
  }
  return options;
}

function formatMonthLabel(monthKey: string): string {
  const [year, m] = monthKey.split("-");
  const monthIndex = parseInt(m, 10) - 1;
  return `${MONTH_NAMES[monthIndex]} ${year}`;
}

function groupRevenuesByMonth(revenues: Revenue[]): Map<string, Revenue[]> {
  const map = new Map<string, Revenue[]>();
  for (const r of revenues) {
    const monthKey = r.date.slice(0, 7); // YYYY-MM
    const list = map.get(monthKey) ?? [];
    list.push(r);
    map.set(monthKey, list);
  }
  // Sort months descending (most recent first)
  const sorted = new Map(
    [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]))
  );
  return sorted;
}

interface RevenueListCardProps {
  refreshTrigger?: number;
  onOpenCreateDialog?: () => void;
  renderHeaderAction?: React.ReactNode;
}

export function RevenueListCard({
  refreshTrigger = 0,
  onOpenCreateDialog,
  renderHeaderAction,
}: RevenueListCardProps) {
  const { sources, fetchSources } = useRevenueSources();
  const {
    revenues,
    isLoading,
    fetchRevenues,
    deleteRevenue,
  } = useRevenues();
  const { convertAndFormat } = useCurrency();

  const [monthFilter, setMonthFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");

  const loadData = () => {
    fetchSources();
    fetchRevenues({
      month: monthFilter === "all" ? undefined : monthFilter,
      sourceId: sourceFilter === "all" ? undefined : sourceFilter,
    });
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthFilter, sourceFilter, refreshTrigger]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Supprimer ce revenu ?")) {
      await deleteRevenue(id);
      loadData();
    }
  };

  const handleMonthChange = (v: string) => setMonthFilter(v);
  const handleSourceChange = (v: string) => setSourceFilter(v);

  const sourceMap = useMemo(
    () => new Map(sources.map((s) => [s.id, s])),
    [sources]
  );
  const getSourceLabel = (id: string) => sourceMap.get(id)?.label ?? id;

  const total = revenues.reduce((sum, r) => sum + r.amount, 0);
  const monthOptions = getMonthOptions();
  const showAccordion = monthFilter === "all";
  const revenuesByMonth = useMemo(
    () => (showAccordion ? groupRevenuesByMonth(revenues) : null),
    [showAccordion, revenues]
  );

  const renderRevenueItem = (r: Revenue) => (
    <li
      key={r.id}
      className="flex items-center justify-between rounded-lg border border-border/60 p-3 bg-transparent"
    >
      <div>
        <p className="font-medium">
          {getSourceLabel(r.sourceId)} – {convertAndFormat(r.amount)}
        </p>
        <p className="text-xs text-muted-foreground">
          Perçu le {r.date}
          {r.description ? ` · ${r.description}` : ""}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleDelete(r.id)}
        className="text-destructive hover:text-destructive"
      >
        <Trash2 size={16} />
      </Button>
    </li>
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle>Historique des revenus</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Filtrage par mois de perception (date du revenu)
          </p>
        </div>
        {(renderHeaderAction ?? onOpenCreateDialog) && (
          <div className="shrink-0">
            {renderHeaderAction ?? (
              <Button size="sm" onClick={onOpenCreateDialog}>
                <Plus size={16} className="mr-1" />
                Nouveau revenu
              </Button>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Mois</label>
            <Select value={monthFilter} onValueChange={handleMonthChange}>
              <SelectTrigger className="w-[220px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Source</label>
            <Select value={sourceFilter} onValueChange={handleSourceChange}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                {sources.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Chargement...</p>
        ) : revenues.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aucun revenu pour cette période.
          </p>
        ) : (
          <>
            <p className="text-sm font-medium">
              Total : {convertAndFormat(total)}
              {!showAccordion && " (mois sélectionné)"}
            </p>

            {showAccordion && revenuesByMonth ? (
              <Accordion type="multiple" className="space-y-2">
                {[...revenuesByMonth.entries()].map(([monthKey, monthRevenues]) => {
                  const monthTotal = monthRevenues.reduce((s, r) => s + r.amount, 0);
                  const count = monthRevenues.length;
                  return (
                    <AccordionItem
                      key={monthKey}
                      value={monthKey}
                      className="rounded-lg overflow-hidden"
                    >
                      <AccordionTrigger className="bg-[#111820] text-gold border-l-4 border-l-gold rounded-lg hover:bg-[#1a2230] hover:no-underline [&>svg]:text-gold">
                        <span className="font-medium flex items-center gap-2">
                          {formatMonthLabel(monthKey)} – {convertAndFormat(monthTotal)}
                          <span className="text-xs text-muted-foreground font-normal">
                            {count} revenu{count > 1 ? "s" : ""}
                          </span>
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="bg-[#0b0f14]/50 rounded-b-lg px-4">
                        <ul className="space-y-2 pl-2">
                          {monthRevenues.map((r) => renderRevenueItem(r))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            ) : (
              <ul className="space-y-2">
                {revenues.map((r) => renderRevenueItem(r))}
              </ul>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
