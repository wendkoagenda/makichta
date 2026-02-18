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
import { usePlannedExpenses } from "../hooks/use-planned-expenses";
import { PlannedExpenseForm } from "./planned-expense-form";
import { useCurrency } from "@/models/settings/hooks/use-currency";
import { RECURRENCE_LABELS } from "../constants/recurrence-labels";
import type { PlannedExpense } from "../types/planned-expense";
import { Plus, Check, Trash2, Calendar } from "lucide-react";

export function PlannedExpenseList() {
  const { items, isLoading, fetchItems, createItem, updateItem, deleteItem } =
    usePlannedExpenses();
  const { convertAndFormat } = useCurrency();
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleCreate = async (data: Parameters<typeof createItem>[0]) => {
    const result = await createItem(data);
    if (result) {
      setDialogOpen(false);
      return true;
    }
    return false;
  };

  const pending = items.filter((i) => !i.isDone);
  const done = items.filter((i) => i.isDone);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Dépenses planifiées</CardTitle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus size={16} className="mr-1" />
              Planifier
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouvelle dépense planifiée</DialogTitle>
            </DialogHeader>
            <PlannedExpenseForm
              onSubmit={handleCreate}
              onCancel={() => setDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Chargement...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aucune dépense planifiée. Planifiez vos dépenses futures pour
            anticiper votre budget.
          </p>
        ) : (
          <>
            {pending.length > 0 && (
              <ul className="space-y-2">
                {pending.map((item) => (
                  <PlannedExpenseRow
                    key={item.id}
                    item={item}
                    convertAndFormat={convertAndFormat}
                    onDone={() => updateItem(item.id, { isDone: true })}
                    onDelete={() => deleteItem(item.id)}
                  />
                ))}
              </ul>
            )}
            {done.length > 0 && (
              <details>
                <summary className="cursor-pointer text-sm text-muted-foreground">
                  Effectuées ({done.length})
                </summary>
                <ul className="mt-2 space-y-2">
                  {done.map((item) => (
                    <PlannedExpenseRow
                      key={item.id}
                      item={item}
                      convertAndFormat={convertAndFormat}
                      onDone={() => {}}
                      onDelete={() => deleteItem(item.id)}
                      isDone
                    />
                  ))}
                </ul>
              </details>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

function PlannedExpenseRow({
  item,
  convertAndFormat,
  onDone,
  onDelete,
  isDone = false,
}: {
  item: PlannedExpense;
  convertAndFormat: (n: number) => string;
  onDone: () => void;
  onDelete: () => void;
  isDone?: boolean;
}) {
  const handleDelete = () => {
    if (window.confirm("Supprimer cette dépense planifiée ?")) onDelete();
  };

  return (
    <li
      className={`flex items-center justify-between rounded-lg border p-3 ${
        isDone ? "opacity-60 border-border" : "border-border"
      }`}
    >
      <div className="flex items-center gap-2">
        {!isDone && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onDone}
            title="Marquer comme effectuée"
          >
            <Check size={16} className="text-primary" />
          </Button>
        )}
        <div>
          <p className={isDone ? "line-through text-muted-foreground" : "font-medium"}>
            {item.label}
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar size={12} />
            {item.dueDate}
            {item.isRecurring && item.recurrenceInterval && (
              <> · {RECURRENCE_LABELS[item.recurrenceInterval]}</>
            )}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-medium">{convertAndFormat(item.estimatedAmount)}</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </li>
  );
}
