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
import type { CreateWishlistItemInput } from "../types/wishlist-item";
import type { WishlistPriority } from "../types/wishlist-item";
import { WISHLIST_PRIORITY_LABELS } from "../constants/priority-labels";

interface WishlistItemFormProps {
  onSubmit: (data: CreateWishlistItemInput) => Promise<boolean>;
  onCancel?: () => void;
}

export function WishlistItemForm({ onSubmit, onCancel }: WishlistItemFormProps) {
  const [label, setLabel] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("");
  const [priority, setPriority] = useState<WishlistPriority>("MEDIUM");
  const [url, setUrl] = useState("");
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
    const cost = parseFloat(estimatedCost);
    if (isNaN(cost) || cost < 0) {
      setError("Coût estimé invalide");
      return;
    }
    setIsSubmitting(true);
    try {
      const ok = await onSubmit({
        label: trimmed,
        estimatedCost: cost,
        priority,
        url: url.trim() || null,
      });
      if (ok) {
        setLabel("");
        setEstimatedCost("");
        setUrl("");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="wi-label">Libellé</Label>
        <Input
          id="wi-label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Ex. MacBook Pro, Voyage au Japon"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="wi-cost">Coût estimé (USDT)</Label>
          <Input
            id="wi-cost"
            type="number"
            step="0.01"
            min="0"
            value={estimatedCost}
            onChange={(e) => setEstimatedCost(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="wi-priority">Priorité</Label>
          <Select value={priority} onValueChange={(v) => setPriority(v as WishlistPriority)}>
            <SelectTrigger id="wi-priority">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(WISHLIST_PRIORITY_LABELS) as WishlistPriority[]).map((p) => (
                <SelectItem key={p} value={p}>
                  {WISHLIST_PRIORITY_LABELS[p]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="wi-url">Lien URL (optionnel)</Label>
        <Input
          id="wi-url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://..."
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>Ajouter</Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
        )}
      </div>
    </form>
  );
}
