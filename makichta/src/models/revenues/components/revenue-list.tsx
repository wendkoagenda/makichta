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
import { useCurrency } from "@/models/settings/hooks/use-currency";
import { useRevenues } from "../hooks/use-revenues";
import { useRevenueSources } from "../hooks/use-revenue-sources";
import { RevenueForm } from "./revenue-form";
import type { RevenueSource } from "../types/revenue-source";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

function getMonthOptions(): { value: string; label: string }[] {
  const options: { value: string; label: string }[] = [];
  const now = new Date();
  const months = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
  ];
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    options.push({
      value: `${y}-${m}`,
      label: `${months[d.getMonth()]} ${y}`,
    });
  }
  return options;
}

export function RevenueList() {
  const { sources, fetchSources } = useRevenueSources();
  const {
    revenues,
    isLoading,
    fetchRevenues,
    createRevenue,
    deleteRevenue,
  } = useRevenues();
  const { convertAndFormat } = useCurrency();

  const [monthId, setMonthId] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [showAddForm, setShowAddForm] = useState(false);

  const loadData = () => {
    fetchSources();
    fetchRevenues({
      monthId,
      sourceId: sourceFilter === "all" ? undefined : sourceFilter,
    });
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async (data: {
    sourceId: string;
    amount: number;
    date: string;
    description?: string;
  }) => {
    const result = await createRevenue(data);
    if (result) {
      setShowAddForm(false);
      loadData();
      return true;
    }
    return false;
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Supprimer ce revenu ?")) {
      await deleteRevenue(id);
      loadData();
    }
  };

  const sourceMap = new Map(sources.map((s) => [s.id, s]));
  const getSourceLabel = (id: string) => sourceMap.get(id)?.label ?? id;
  const total = revenues.reduce((sum, r) => sum + r.amount, 0);
  const monthOptions = getMonthOptions();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Revenus</CardTitle>
        {!showAddForm && (
          <Button
            size="sm"
            onClick={() => {
              setShowAddForm(true);
            }}
          >
            <Plus size={16} className="mr-1" />
            Saisir un revenu
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Mois</label>
            <Select
              value={monthId}
              onValueChange={(v) => {
                setMonthId(v);
                fetchRevenues({
                  monthId: v,
                  sourceId: sourceFilter === "all" ? undefined : sourceFilter,
                });
              }}
            >
              <SelectTrigger className="w-[180px]">
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
            <Select
              value={sourceFilter}
              onValueChange={(v) => {
                setSourceFilter(v);
                fetchRevenues({
                  monthId,
                  sourceId: v === "all" ? undefined : v,
                });
              }}
            >
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

        {showAddForm && (
          <div className="rounded-lg border border-border p-4">
            <h4 className="mb-3 text-sm font-medium">Nouveau revenu</h4>
            <RevenueForm
              sources={sources}
              onSubmit={handleCreate}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        )}

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Chargement...</p>
        ) : (
          <>
            {revenues.length > 0 && (
              <p className="text-sm font-medium">
                Total du mois : {convertAndFormat(total)}
              </p>
            )}
            {revenues.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Aucun revenu pour cette période.
              </p>
            ) : (
              <ul className="space-y-2">
                {revenues.map((r) => (
                  <li
                    key={r.id}
                    className="flex items-center justify-between rounded-lg border border-border p-3"
                  >
                    <div>
                      <p className="font-medium">
                        {getSourceLabel(r.sourceId)} – {convertAndFormat(r.amount)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {r.date}
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
                ))}
              </ul>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
