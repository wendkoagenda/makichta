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
import { FREQUENCIES, RECURRENCE_INTERVALS } from "@/lib/constants";
import {
  FREQUENCY_LABELS,
  RECURRENCE_INTERVAL_LABELS,
} from "../constants/frequency-labels";
import type { RevenueSource } from "../types/revenue-source";

interface RevenueSourceFormProps {
  source?: RevenueSource | null;
  onSubmit: (data: {
    label: string;
    frequency: "RECURRING" | "ONE_TIME";
    recurrenceInterval: "WEEKLY" | "MONTHLY" | "YEARLY" | null;
  }) => Promise<boolean>;
  onCancel?: () => void;
}

export function RevenueSourceForm({
  source,
  onSubmit,
  onCancel,
}: RevenueSourceFormProps) {
  const [label, setLabel] = useState(source?.label ?? "");
  const [frequency, setFrequency] = useState<"RECURRING" | "ONE_TIME">(
    source?.frequency ?? "RECURRING"
  );
  const [recurrenceInterval, setRecurrenceInterval] = useState<
    "WEEKLY" | "MONTHLY" | "YEARLY" | null
  >(source?.recurrenceInterval ?? "MONTHLY");
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
    setIsSubmitting(true);
    try {
      const ok = await onSubmit({
        label: trimmed,
        frequency,
        recurrenceInterval: frequency === "RECURRING" ? recurrenceInterval : null,
      });
      if (ok && !source) {
        setLabel("");
        setFrequency("RECURRING");
        setRecurrenceInterval("MONTHLY");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="source-label">Libellé</Label>
        <Input
          id="source-label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Ex. Salaire, Freelance, Prime..."
          autoFocus
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="source-frequency">Fréquence</Label>
        <Select
          value={frequency}
          onValueChange={(v) =>
            setFrequency(v as "RECURRING" | "ONE_TIME")
          }
        >
          <SelectTrigger id="source-frequency">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={FREQUENCIES.RECURRING}>
              {FREQUENCY_LABELS[FREQUENCIES.RECURRING]}
            </SelectItem>
            <SelectItem value={FREQUENCIES.ONE_TIME}>
              {FREQUENCY_LABELS[FREQUENCIES.ONE_TIME]}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {frequency === "RECURRING" && (
        <div className="space-y-2">
          <Label htmlFor="source-interval">Récurrence</Label>
          <Select
            value={recurrenceInterval ?? "MONTHLY"}
            onValueChange={(v) =>
              setRecurrenceInterval(v as "WEEKLY" | "MONTHLY" | "YEARLY")
            }
          >
            <SelectTrigger id="source-interval">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(RECURRENCE_INTERVAL_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {source ? "Enregistrer" : "Ajouter"}
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
