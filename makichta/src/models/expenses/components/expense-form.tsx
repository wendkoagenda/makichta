"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ExpenseCategory } from "@/models/expense-categories/types/expense-category";
import type { Expense } from "../types/expense";

interface ExpenseFormProps {
  categories: ExpenseCategory[];
  expense?: Expense | null;
  onSubmit: (data: {
    categoryId: string;
    amount: number;
    date: string;
    description?: string;
  }) => Promise<boolean>;
  onCancel?: () => void;
}

export function ExpenseForm({
  categories,
  expense,
  onSubmit,
  onCancel,
}: ExpenseFormProps) {
  const today = new Date().toISOString().slice(0, 10);
  const [categoryId, setCategoryId] = useState(expense?.categoryId ?? "");
  const [amount, setAmount] = useState(
    expense?.amount != null ? String(expense.amount) : ""
  );
  const [date, setDate] = useState(expense?.date ?? today);
  const [description, setDescription] = useState(expense?.description ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!categoryId) {
      setError("Choisissez une catégorie");
      return;
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < 0) {
      setError("Montant invalide");
      return;
    }
    if (!date) {
      setError("La date est requise");
      return;
    }
    setIsSubmitting(true);
    try {
      const ok = await onSubmit({
        categoryId,
        amount: numAmount,
        date,
        description: description.trim() || undefined,
      });
      if (ok && !expense) {
        setCategoryId("");
        setAmount("");
        setDate(today);
        setDescription("");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (categories.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Créez d&apos;abord une catégorie de dépenses.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="expense-category">Catégorie</Label>
        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger id="expense-category">
            <SelectValue placeholder="Choisir une catégorie" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expense-amount">Montant (USDT)</Label>
          <Input
            id="expense-amount"
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="expense-date">Date</Label>
          <Input
            id="expense-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="expense-description">Description (optionnel)</Label>
        <Input
          id="expense-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ex. Course supermarché"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {expense ? "Enregistrer" : "Ajouter"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
        )}
      </div>
    </form>
  );
}
