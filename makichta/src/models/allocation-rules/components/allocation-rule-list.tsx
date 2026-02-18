"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAllocationRules } from "../hooks/use-allocation-rules";
import { AllocationRuleForm } from "./allocation-rule-form";
import { Pencil, Plus, Sparkles, Trash2 } from "lucide-react";

export function AllocationRuleList() {
  const {
    rules,
    isLoading,
    fetchRules,
    createRule,
    updateRule,
    deleteRule,
    seedDefaults,
  } = useAllocationRules();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  const totalPercent = rules.reduce((s, r) => s + r.percentage, 0);

  const handleCreate = async (data: {
    label: string;
    percentage: number;
  }) => {
    const result = await createRule(data);
    if (result) {
      setShowAddForm(false);
      return true;
    }
    return false;
  };

  const handleUpdate = async (
    id: string,
    data: { label: string; percentage: number }
  ) => {
    const result = await updateRule(id, data);
    if (result) {
      setEditingId(null);
      return true;
    }
    return false;
  };

  const handleDelete = async (id: string) => {
    if (
      window.confirm(
        "Supprimer cette règle de répartition ? Les allocations existantes ne seront pas recalculées."
      )
    ) {
      await deleteRule(id);
      setEditingId(null);
    }
  };

  const handleSeedDefaults = async () => {
    setIsSeeding(true);
    try {
      const result = await seedDefaults();
      if (result && result.length > 0) {
        setShowAddForm(false);
      }
    } finally {
      setIsSeeding(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Règles de répartition</CardTitle>
        <div className="flex gap-2">
          {rules.length === 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleSeedDefaults}
              disabled={isSeeding}
            >
              <Sparkles size={16} className="mr-1" />
              Règles par défaut
            </Button>
          )}
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
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showAddForm && (
          <div className="rounded-lg border border-border p-4">
            <h4 className="mb-3 text-sm font-medium">Nouvelle règle</h4>
            <AllocationRuleForm
              onSubmit={handleCreate}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        )}

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Chargement...</p>
        ) : rules.length === 0 && !showAddForm ? (
          <p className="text-sm text-muted-foreground">
            Aucune règle. Cliquez sur « Règles par défaut » pour importer
            épargne, charges fixes, loisirs… ou « Ajouter » pour créer la vôtre.
            Les montants seront calculés automatiquement à chaque nouveau revenu.
          </p>
        ) : (
          <>
            {rules.length > 0 && (
              <p className="text-sm text-muted-foreground">
                Total : <strong>{totalPercent.toFixed(1)} %</strong>
                {totalPercent !== 100 && (
                  <span className="ml-1 text-amber-500">
                    (recommandé : 100 %)
                  </span>
                )}
              </p>
            )}
            <ul className="space-y-2">
              {rules.map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  {editingId === r.id ? (
                    <div className="flex-1">
                      <AllocationRuleForm
                        rule={r}
                        onSubmit={async (data) => handleUpdate(r.id, data)}
                        onCancel={() => setEditingId(null)}
                      />
                    </div>
                  ) : (
                    <>
                      <div>
                        <p className="font-medium">{r.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {r.percentage} % des revenus
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingId(r.id);
                            setShowAddForm(false);
                          }}
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(r.id)}
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
          </>
        )}
      </CardContent>
    </Card>
  );
}
