"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CreateLiabilityInput } from "../types/liability";

interface LiabilityFormProps {
  onSubmit: (data: CreateLiabilityInput) => Promise<boolean>;
  onCancel?: () => void;
}

export function LiabilityForm({ onSubmit, onCancel }: LiabilityFormProps) {
  const today = new Date().toISOString().slice(0, 10);
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(today);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmed = label.trim();
    if (!trimmed) {
      setError("Le libellé est requis");
      return;
    }
    const value = parseFloat(amount);
    if (isNaN(value) || value < 0) {
      setError("Le montant doit être un nombre positif ou zéro");
      return;
    }
    if (!date) {
      setError("La date est requise");
      return;
    }
    setIsSubmitting(true);
    try {
      const ok = await onSubmit({
        label: trimmed,
        amount: value,
        date,
        note: note.trim() || null,
      });
      if (ok) {
        setLabel("");
        setAmount("");
        setDate(today);
        setNote("");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="liability-label">Libellé</Label>
        <Input
          id="liability-label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Ex. Crédit auto, Dette perso"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="liability-amount">Montant</Label>
          <Input
            id="liability-amount"
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="liability-date">Date</Label>
          <Input
            id="liability-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="liability-note">Note (optionnel)</Label>
        <Input
          id="liability-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Ex. Échéance, créancier"
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          Enregistrer
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
