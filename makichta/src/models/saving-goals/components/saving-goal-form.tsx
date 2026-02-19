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
import type { SavingGoal } from "../types/saving-goal";
import type { GoalPriority } from "../types/saving-goal";
import { PRIORITY_LABELS } from "../constants/priority-labels";

interface SavingGoalFormProps {
  goal?: SavingGoal | null;
  /** Prérempli lors de l'ajout d'une ligne à un projet */
  projectId?: string | null;
  /** Liste des projets pour le sélecteur (Sans projet + projets) */
  projects?: { id: string; label: string }[];
  onSubmit: (data: {
    label: string;
    targetAmount: number;
    deadline: string | null;
    priority: GoalPriority;
    projectId?: string | null;
  }) => Promise<boolean>;
  onCancel?: () => void;
}

export function SavingGoalForm({
  goal,
  projectId: initialProjectId,
  projects = [],
  onSubmit,
  onCancel,
}: SavingGoalFormProps) {
  const [label, setLabel] = useState(goal?.label ?? "");
  const [targetAmount, setTargetAmount] = useState(
    goal?.targetAmount != null ? String(goal.targetAmount) : ""
  );
  const [deadline, setDeadline] = useState(goal?.deadline ?? "");
  const [priority, setPriority] = useState<GoalPriority>(
    goal?.priority ?? "MEDIUM"
  );
  /** Valeur sentinelle pour "Sans projet" (Radix Select n'accepte pas value="") */
  const NONE_PROJECT = "__none__";
  const [projectId, setProjectId] = useState<string | "">(
    initialProjectId ?? goal?.projectId ?? ""
  );
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
    const amount = parseFloat(targetAmount);
    if (isNaN(amount) || amount < 0) {
      setError("Le montant cible doit être un nombre positif ou zéro");
      return;
    }
    setIsSubmitting(true);
    try {
      const ok = await onSubmit({
        label: trimmed,
        targetAmount: amount,
        deadline: deadline.trim() || null,
        priority,
        ...(projects.length > 0 && {
          projectId: projectId === "" ? null : projectId,
        }),
      });
      if (ok && !goal) {
        setLabel("");
        setTargetAmount("");
        setDeadline("");
        setPriority("MEDIUM");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="goal-label">Libellé</Label>
        <Input
          id="goal-label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Ex. Fonds d'urgence, Voyage, Achat immobilier"
          autoFocus
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="goal-target">Montant cible (USDT)</Label>
        <Input
          id="goal-target"
          type="number"
          step="0.01"
          min="0"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
          placeholder="0"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="goal-deadline">Échéance (optionnel)</Label>
        <Input
          id="goal-deadline"
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
      </div>
      {projects.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="goal-project">Projet</Label>
          <Select
            value={projectId === "" ? NONE_PROJECT : projectId}
            onValueChange={(v) => setProjectId(v === NONE_PROJECT ? "" : v)}
          >
            <SelectTrigger id="goal-project">
              <SelectValue placeholder="Sans projet" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE_PROJECT}>Sans projet</SelectItem>
              {projects.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="goal-priority">Priorité</Label>
        <Select
          value={priority}
          onValueChange={(v) => setPriority(v as GoalPriority)}
        >
          <SelectTrigger id="goal-priority">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(PRIORITY_LABELS) as GoalPriority[]).map((p) => (
              <SelectItem key={p} value={p}>
                {PRIORITY_LABELS[p]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {goal ? "Enregistrer" : "Créer"}
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
