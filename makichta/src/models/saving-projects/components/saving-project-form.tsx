"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SavingProject } from "../types/saving-project";

interface SavingProjectFormProps {
  project?: SavingProject | null;
  onSubmit: (data: {
    label: string;
    targetAmount: number | null;
    deadline: string | null;
  }) => Promise<boolean>;
  onCancel?: () => void;
}

export function SavingProjectForm({
  project,
  onSubmit,
  onCancel,
}: SavingProjectFormProps) {
  const [label, setLabel] = useState(project?.label ?? "");
  const [targetAmount, setTargetAmount] = useState(
    project?.targetAmount != null ? String(project.targetAmount) : ""
  );
  const [deadline, setDeadline] = useState(project?.deadline ?? "");
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
    const amount =
      targetAmount.trim() === ""
        ? null
        : parseFloat(targetAmount);
    if (targetAmount.trim() !== "" && (isNaN(amount!) || amount! < 0)) {
      setError("Le montant cible doit être un nombre positif ou zéro");
      return;
    }
    setIsSubmitting(true);
    try {
      const ok = await onSubmit({
        label: trimmed,
        targetAmount: amount ?? null,
        deadline: deadline.trim() || null,
      });
      if (ok && !project) {
        setLabel("");
        setTargetAmount("");
        setDeadline("");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="project-label">Nom du projet</Label>
        <Input
          id="project-label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Ex. Mariage, Déménagement"
          autoFocus
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="project-target">Objectif global (optionnel)</Label>
        <Input
          id="project-target"
          type="number"
          step="0.01"
          min="0"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
          placeholder="Laisser vide si pas d'objectif global"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="project-deadline">Échéance (optionnel)</Label>
        <Input
          id="project-deadline"
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {project ? "Enregistrer" : "Créer"}
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
