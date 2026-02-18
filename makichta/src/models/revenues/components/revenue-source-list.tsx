"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRevenueSources } from "../hooks/use-revenue-sources";
import { RevenueSourceForm } from "./revenue-source-form";
import {
  FREQUENCY_LABELS,
  RECURRENCE_INTERVAL_LABELS,
} from "../constants/frequency-labels";
import type { RevenueSource } from "../types/revenue-source";
import { Pencil, Plus, Trash2 } from "lucide-react";

export function RevenueSourceList() {
  const {
    sources,
    isLoading,
    fetchSources,
    createSource,
    updateSource,
    deleteSource,
  } = useRevenueSources();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleCreate = async (data: {
    label: string;
    frequency: "RECURRING" | "ONE_TIME";
    recurrenceInterval: "WEEKLY" | "MONTHLY" | "YEARLY" | null;
  }) => {
    const result = await createSource(data);
    if (result) {
      setShowAddForm(false);
      return true;
    }
    return false;
  };

  const handleUpdate = async (
    id: string,
    data: {
      label: string;
      frequency: "RECURRING" | "ONE_TIME";
      recurrenceInterval: "WEEKLY" | "MONTHLY" | "YEARLY" | null;
    }
  ) => {
    const result = await updateSource(id, data);
    if (result) {
      setEditingId(null);
      return true;
    }
    return false;
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Supprimer cette source ? Les revenus associés seront aussi supprimés.")) {
      await deleteSource(id);
      setEditingId(null);
    }
  };

  useEffect(() => {
    fetchSources();
  }, [fetchSources]);

  const formatSource = (s: RevenueSource) => {
    const freq = FREQUENCY_LABELS[s.frequency] ?? s.frequency;
    const interval =
      s.frequency === "RECURRING" && s.recurrenceInterval
        ? ` (${RECURRENCE_INTERVAL_LABELS[s.recurrenceInterval] ?? s.recurrenceInterval})`
        : "";
    return `${freq}${interval}`;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Sources de revenus</CardTitle>
        {!showAddForm && (
          <Button
            size="sm"
            onClick={() => {
              setShowAddForm(true);
              setEditingId(null);
            }}
          >
            <Plus size={16} className="mr-1" />
            Ajouter
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {showAddForm && (
          <div className="rounded-lg border border-border p-4">
            <h4 className="mb-3 text-sm font-medium">Nouvelle source</h4>
            <RevenueSourceForm
              onSubmit={handleCreate}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        )}

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Chargement...</p>
        ) : sources.length === 0 && !showAddForm ? (
          <p className="text-sm text-muted-foreground">
            Aucune source. Créez-en une pour commencer.
          </p>
        ) : (
          <ul className="space-y-2">
            {sources.map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between rounded-lg border border-border p-3"
              >
                {editingId === s.id ? (
                  <div className="flex-1">
                    <RevenueSourceForm
                      source={s}
                      onSubmit={async (data) => handleUpdate(s.id, data)}
                      onCancel={() => setEditingId(null)}
                    />
                  </div>
                ) : (
                  <>
                    <div>
                      <p className="font-medium">{s.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatSource(s)}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingId(s.id);
                          setShowAddForm(false);
                        }}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(s.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
