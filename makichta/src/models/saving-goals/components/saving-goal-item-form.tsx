"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SavingGoalItem } from "../types/saving-goal-item";

interface SavingGoalItemFormProps {
  savingGoalId: string;
  item?: SavingGoalItem | null;
  onSubmit: () => void;
  onCancel?: () => void;
}

export function SavingGoalItemForm({
  savingGoalId,
  item,
  onSubmit,
  onCancel,
}: SavingGoalItemFormProps) {
  const [title, setTitle] = useState(item?.title ?? "");
  const [url, setUrl] = useState(item?.url ?? "");
  const [amount, setAmount] = useState(item?.amount != null ? String(item.amount) : "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = !!item;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("Le titre est requis");
      return;
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < 0) {
      setError("Le montant doit être un nombre positif ou zéro");
      return;
    }
    setIsSubmitting(true);
    try {
      if (isEdit) {
        const res = await fetch(`/api/saving-goals/items/${item.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: trimmedTitle,
            url: url.trim() || null,
            amount: numAmount,
            description: description.trim() || null,
          }),
        });
        if (!res.ok) throw new Error("Erreur");
      } else {
        const res = await fetch(`/api/saving-goals/${savingGoalId}/items`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: trimmedTitle,
            url: url.trim() || null,
            amount: numAmount,
            description: description.trim() || null,
          }),
        });
        if (!res.ok) throw new Error("Erreur");
      }
      onSubmit();
    } catch {
      setError(isEdit ? "Erreur lors de la mise à jour" : "Erreur lors de l'ajout");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="item-title">Titre</Label>
        <Input
          id="item-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex. Achat véhicule"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="item-url">Lien (optionnel)</Label>
        <Input
          id="item-url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://..."
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="item-amount">Montant</Label>
        <Input
          id="item-amount"
          type="number"
          step="0.01"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="item-description">Description (optionnel)</Label>
        <Input
          id="item-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="..."
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isEdit ? "Enregistrer" : "Ajouter"}
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
