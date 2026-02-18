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
import type { RevenueSource } from "../types/revenue-source";
import type { Revenue } from "../types/revenue";

interface RevenueFormProps {
  sources: RevenueSource[];
  revenue?: Revenue | null;
  onSubmit: (data: {
    sourceId: string;
    amount: number;
    date: string;
    description?: string;
  }) => Promise<boolean>;
  onCancel?: () => void;
}

export function RevenueForm({
  sources,
  revenue,
  onSubmit,
  onCancel,
}: RevenueFormProps) {
  const today = new Date().toISOString().slice(0, 10);
  const [sourceId, setSourceId] = useState(revenue?.sourceId ?? "");
  const [amount, setAmount] = useState(
    revenue?.amount != null ? String(revenue.amount) : ""
  );
  const [date, setDate] = useState(revenue?.date ?? today);
  const [description, setDescription] = useState(
    revenue?.description ?? ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!sourceId) {
      setError("Choisissez une source");
      return;
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
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
        sourceId,
        amount: numAmount,
        date,
        description: description.trim() || undefined,
      });
      if (ok && !revenue) {
        setSourceId("");
        setAmount("");
        setDate(today);
        setDescription("");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (sources.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Créez d&apos;abord une source de revenus.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="revenue-source">Source</Label>
        <Select value={sourceId} onValueChange={setSourceId}>
          <SelectTrigger id="revenue-source">
            <SelectValue placeholder="Choisir une source" />
          </SelectTrigger>
          <SelectContent>
            {sources.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="revenue-amount">Montant (USDT)</Label>
          <Input
            id="revenue-amount"
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="revenue-date">Date de perception</Label>
          <Input
            id="revenue-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="revenue-description">Description (optionnel)</Label>
        <Input
          id="revenue-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ex. Salaire de janvier"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {revenue ? "Enregistrer" : "Ajouter"}
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
