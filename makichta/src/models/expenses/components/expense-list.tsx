"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useExpenses } from "../hooks/use-expenses";
import { useExpenseCategories } from "@/models/expense-categories/hooks/use-expense-categories";
import { ExpenseForm } from "./expense-form";
import { useCurrency } from "@/models/settings/hooks/use-currency";
import { Plus, Pencil, Trash2 } from "lucide-react";

function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

interface ExpenseListProps {
  onExpenseChange?: () => void;
}

export function ExpenseList({ onExpenseChange }: ExpenseListProps) {
  const currentMonth = getCurrentMonth();
  const {
    expenses,
    isLoading,
    fetchExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
  } = useExpenses(currentMonth);
  const { categories, fetchCategories } = useExpenseCategories();
  const { convertAndFormat } = useCurrency();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchCategories(currentMonth);
  }, [currentMonth, fetchCategories]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleCreate = async (data: {
    categoryId: string;
    amount: number;
    date: string;
    description?: string;
  }) => {
    const result = await createExpense(data);
    if (result) {
      setDialogOpen(false);
      fetchExpenses();
      onExpenseChange?.();
      return true;
    }
    return false;
  };

  const handleUpdate = async (
    id: string,
    data: {
      categoryId: string;
      amount: number;
      date: string;
      description?: string;
    }
  ) => {
    const result = await updateExpense(id, data);
    if (result) {
      setEditingId(null);
      onExpenseChange?.();
      return true;
    }
    return false;
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Supprimer cette dépense ?")) {
      await deleteExpense(id);
      setEditingId(null);
      onExpenseChange?.();
    }
  };

  const getCategoryLabel = (categoryId: string, categoryLabel?: string) =>
    categoryLabel ?? categories.find((c) => c.id === categoryId)?.label ?? "?";

  const total = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <Card className="min-w-0">
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <CardTitle>Dépenses du mois</CardTitle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus size={16} className="mr-1" />
              Nouvelle dépense
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouvelle dépense</DialogTitle>
            </DialogHeader>
            <ExpenseForm
              categories={categories}
              onSubmit={handleCreate}
              onCancel={() => setDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Chargement...</p>
        ) : expenses.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aucune dépense ce mois-ci. Cliquez sur « Nouvelle dépense » pour en
            ajouter.
          </p>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              Total : <strong className="text-foreground">{convertAndFormat(total)}</strong>
            </p>
            <ul className="space-y-2">
              {expenses.map((e) => (
                <li
                  key={e.id}
                  className="flex min-w-0 flex-col gap-2 rounded-lg border border-border p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  {editingId === e.id ? (
                    <div className="min-w-0 flex-1">
                      <ExpenseForm
                        categories={categories}
                        expense={e}
                        onSubmit={async (data) => handleUpdate(e.id, data)}
                        onCancel={() => setEditingId(null)}
                      />
                    </div>
                  ) : (
                    <>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium wrap-break-word">
                          {getCategoryLabel(e.categoryId, e.categoryLabel)}
                        </p>
                        <p className="text-xs text-muted-foreground wrap-break-word">
                          {e.date} · {e.description || "—"}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="font-medium text-destructive tabular-nums">
                          -{convertAndFormat(e.amount)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="min-h-[44px] min-w-[44px] shrink-0"
                          onClick={() => {
                            setEditingId(e.id);
                            setDialogOpen(false);
                          }}
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="min-h-[44px] min-w-[44px] shrink-0 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(e.id)}
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
