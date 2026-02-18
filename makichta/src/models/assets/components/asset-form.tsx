"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CreateAssetInput } from "../types/asset";

interface AssetFormProps {
  onSubmit: (data: CreateAssetInput) => Promise<boolean>;
  onCancel?: () => void;
}

export function AssetForm({ onSubmit, onCancel }: AssetFormProps) {
  const today = new Date().toISOString().slice(0, 10);
  const [label, setLabel] = useState("");
  const [purchaseValue, setPurchaseValue] = useState("");
  const [durationMonths, setDurationMonths] = useState("");
  const [acquisitionDate, setAcquisitionDate] = useState(today);
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
    const value = parseFloat(purchaseValue);
    if (isNaN(value) || value < 0) {
      setError("Valeur d'achat invalide");
      return;
    }
    const months = parseInt(durationMonths, 10);
    if (isNaN(months) || months < 1) {
      setError("Durée d'amortissement invalide (min 1 mois)");
      return;
    }
    if (!acquisitionDate) {
      setError("La date d'acquisition est requise");
      return;
    }
    setIsSubmitting(true);
    try {
      const ok = await onSubmit({
        label: trimmed,
        purchaseValue: value,
        depreciationDurationMonths: months,
        acquisitionDate,
      });
      if (ok) {
        setLabel("");
        setPurchaseValue("");
        setDurationMonths("");
        setAcquisitionDate(today);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="asset-label">Libellé</Label>
        <Input
          id="asset-label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Ex. Voiture, Ordinateur, Équipement"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="asset-value">Valeur d&apos;achat (USDT)</Label>
          <Input
            id="asset-value"
            type="number"
            step="0.01"
            min="0"
            value={purchaseValue}
            onChange={(e) => setPurchaseValue(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="asset-date">Date d&apos;acquisition</Label>
          <Input
            id="asset-date"
            type="date"
            value={acquisitionDate}
            onChange={(e) => setAcquisitionDate(e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="asset-duration">
          Durée d&apos;amortissement (mois)
        </Label>
        <Input
          id="asset-duration"
          type="number"
          min="1"
          value={durationMonths}
          onChange={(e) => setDurationMonths(e.target.value)}
          placeholder="Ex. 60 pour 5 ans"
        />
        <p className="text-xs text-muted-foreground">
          12 mois = 1 an, 60 mois = 5 ans
        </p>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>Enregistrer</Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
        )}
      </div>
    </form>
  );
}
