"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MonthPicker } from "@/components/ui/month-picker";
import { useExpenseCategories } from "../hooks/use-expense-categories";
import { ExpenseCategoryForm } from "./expense-category-form";
import { EXPENSE_TYPE_LABELS } from "../constants/type-labels";
import type { ExpenseCategory } from "../types/expense-category";
import { useCurrency } from "@/models/settings/hooks/use-currency";
import { Pencil, Plus, Sparkles, Trash2 } from "lucide-react";

function getCurrentMonthId(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

interface ExpenseCategoryListProps {
  onCategoryChange?: () => void;
}

export function ExpenseCategoryList({ onCategoryChange }: ExpenseCategoryListProps) {
  const {
    categories,
    isLoading,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    seedDefaults,
  } = useExpenseCategories();
  const { convertAndFormat } = useCurrency();
  const [monthId, setMonthId] = useState(getCurrentMonthId);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  const handleCreate = async (data: {
    label: string;
    type: "FIXED" | "VARIABLE";
    monthlyBudget: number;
    budgetPercent: number | null;
  }) => {
    const result = await createCategory({ ...data, monthId });
    if (result) {
      setShowAddForm(false);
      onCategoryChange?.();
      return true;
    }
    return false;
  };

  const handleUpdate = async (
    id: string,
    data: {
      label: string;
      type: "FIXED" | "VARIABLE";
      monthlyBudget: number;
      budgetPercent: number | null;
    }
  ) => {
    const result = await updateCategory(id, data);
    if (result) {
      setEditingId(null);
      onCategoryChange?.();
      return true;
    }
    return false;
  };

  const handleDelete = async (id: string) => {
    if (
      window.confirm(
        "Supprimer cette catégorie ? Les dépenses associées seront aussi supprimées."
      )
    ) {
      await deleteCategory(id);
      setEditingId(null);
      onCategoryChange?.();
    }
  };

  const handleSeedDefaults = async () => {
    setIsSeeding(true);
    try {
      const result = await seedDefaults(monthId);
      if (result && result.length > 0) {
        setShowAddForm(false);
        onCategoryChange?.();
      }
    } finally {
      setIsSeeding(false);
    }
  };

  useEffect(() => {
    fetchCategories(monthId);
  }, [monthId, fetchCategories]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Catégories de dépenses</CardTitle>
        <div className="flex gap-2">
          {categories.length === 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleSeedDefaults}
              disabled={isSeeding}
            >
              <Sparkles size={16} className="mr-1" />
              Catégories par défaut
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
        <div className="flex flex-wrap items-end gap-4">
          <MonthPicker
            label="Mois"
            value={monthId}
            onValueChange={(v) => setMonthId(v)}
          />
        </div>
        {showAddForm && (
          <div className="rounded-lg border border-border p-4">
            <h4 className="mb-3 text-sm font-medium">Nouvelle catégorie</h4>
            <ExpenseCategoryForm
              onSubmit={handleCreate}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        )}

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Chargement...</p>
        ) : categories.length === 0 && !showAddForm ? (
          <p className="text-sm text-muted-foreground">
            Aucune catégorie. Cliquez sur « Catégories par défaut » pour
            importer loyer, alimentation, transport… ou « Ajouter » pour créer
            la vôtre.
          </p>
        ) : (
          <ul className="space-y-2">
            {categories.map((c: ExpenseCategory) => (
              <li
                key={c.id}
                className="flex items-center justify-between rounded-lg border border-border p-3"
              >
                {editingId === c.id ? (
                  <div className="flex-1">
                    <ExpenseCategoryForm
                      category={c}
                      onSubmit={async (data) => handleUpdate(c.id, data)}
                      onCancel={() => setEditingId(null)}
                    />
                  </div>
                ) : (
                  <>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{c.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {EXPENSE_TYPE_LABELS[c.type] ?? c.type} · Budget mensuel :{" "}
                        {c.budgetPercent != null
                          ? `${c.budgetPercent} % des revenus`
                          : convertAndFormat(c.monthlyBudget)}
                      </p>
                      {c.allocationRules && c.allocationRules.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {c.allocationRules.map((r) => (
                            <span
                              key={r.id}
                              className="inline-flex items-center rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-medium text-primary"
                            >
                              {r.label}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingId(c.id);
                          setShowAddForm(false);
                        }}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(c.id)}
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
