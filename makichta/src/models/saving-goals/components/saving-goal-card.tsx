"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCurrency } from "@/models/settings/hooks/use-currency";
import { SavingGoalForm } from "./saving-goal-form";
import { ContributionForm } from "./contribution-form";
import { PRIORITY_LABELS } from "../constants/priority-labels";
import { SAVING_TYPE_LABELS } from "../constants/saving-type-labels";
import type { SavingGoal } from "../types/saving-goal";
import type { SavingContribution } from "../types/saving-contribution";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Pencil, Plus, Minus, PiggyBank, Trash2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SavingGoalCardProps {
  goal: SavingGoal;
  projects?: { id: string; label: string }[];
  onUpdate: (
    id: string,
    data: {
      label: string;
      savingType: "TARGET" | "EMERGENCY";
      targetAmount: number;
      deadline: string | null;
      priority: "HIGH" | "MEDIUM" | "LOW";
      projectId?: string | null;
    }
  ) => Promise<boolean>;
  onDelete: (id: string) => Promise<void>;
  onContribution: () => void;
  onValidate?: () => void;
}

export function SavingGoalCard({
  goal,
  projects = [],
  onUpdate,
  onDelete,
  onContribution,
  onValidate,
}: SavingGoalCardProps) {
  const { convertAndFormat } = useCurrency();
  const [editing, setEditing] = useState(false);
  const [contributions, setContributions] = useState<SavingContribution[]>([]);
  const [contribDialogOpen, setContribDialogOpen] = useState(false);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [validateDialogOpen, setValidateDialogOpen] = useState(false);
  const [validateCreateAsset, setValidateCreateAsset] = useState(true);
  const [validateDepreciationMonths, setValidateDepreciationMonths] = useState(60);
  const [isValidating, setIsValidating] = useState(false);

  const targetForBar =
    (goal.allocatedThisMonth != null && goal.allocatedThisMonth > 0)
      ? goal.allocatedThisMonth
      : goal.targetAmount;
  const currentForBar =
    (goal.contributionsThisMonth != null && targetForBar === goal.allocatedThisMonth)
      ? goal.contributionsThisMonth
      : goal.currentAmount;
  const progressPercent =
    targetForBar > 0
      ? Math.min(100, (currentForBar / targetForBar) * 100)
      : 0;
  const remaining = Math.max(0, targetForBar - currentForBar);
  const isMonthlyScope = targetForBar === goal.allocatedThisMonth && (goal.allocatedThisMonth ?? 0) > 0;

  const restantTotal = Math.max(0, goal.targetAmount - goal.currentAmount);
  const monthsToTarget =
    goal.targetAmount > 0 &&
    (goal.allocatedThisMonth ?? 0) > 0 &&
    restantTotal > 0
      ? Math.ceil(restantTotal / (goal.allocatedThisMonth ?? 1))
      : null;
  const isTargetReached = goal.targetAmount > 0 && restantTotal <= 0;

  useEffect(() => {
    fetch(`/api/saving-goals/${goal.id}/contributions`)
      .then((r) => r.ok ? r.json() : [])
      .then(setContributions)
      .catch(() => setContributions([]));
  }, [goal.id, goal.currentAmount]);

  const handleContribution = () => {
    setContribDialogOpen(false);
    onContribution();
  };

  const handleRemoveContribution = async (contributionId: string) => {
    if (!confirm("Retirer cette contribution automatique ? Le montant sera enlevé de l’objectif.")) return;
    const res = await fetch(`/api/saving-goals/contributions/${contributionId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setContributions((prev) => prev.filter((c) => c.id !== contributionId));
      onContribution();
    }
  };

  const handleValidate = async () => {
    setIsValidating(true);
    try {
      const res = await fetch(`/api/saving-goals/${goal.id}/validate`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          createAsset: validateCreateAsset,
          depreciationDurationMonths: validateDepreciationMonths,
          acquisitionDate: new Date().toISOString().slice(0, 10),
        }),
      });
      if (res.ok) {
        setValidateDialogOpen(false);
        onValidate?.();
      }
    } finally {
      setIsValidating(false);
    }
  };

  const isActive = goal.status !== "COMPLETED";

  return (
    <Card className="min-w-0">
      <CardHeader className="flex flex-col gap-2 pb-2 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium break-words">{goal.label}</p>
            <span
              className={`shrink-0 text-xs px-1.5 py-0.5 rounded ${
                goal.savingType === "EMERGENCY"
                  ? "bg-amber-500/20 text-amber-700 dark:text-amber-400"
                  : "bg-primary/10 text-primary"
              }`}
            >
              {SAVING_TYPE_LABELS[goal.savingType]}
            </span>
          </div>
          <p className="text-xs text-muted-foreground break-words">
            {PRIORITY_LABELS[goal.priority]}
            {isMonthlyScope && (
              <> · Prévu ce mois : {convertAndFormat(goal.allocatedThisMonth!)}</>
            )}
            {!isMonthlyScope && goal.targetAmount <= 0 && (
              <> · Cible : {convertAndFormat(goal.targetAmount)}</>
            )}
            {goal.deadline && ` · Échéance ${goal.deadline}`}
          </p>
        </div>
        <div className="flex shrink-0 gap-1">
          <Dialog open={contribDialogOpen} onOpenChange={setContribDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" title="Ajouter une contribution">
                <Plus size={16} />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nouvelle contribution · {goal.label}</DialogTitle>
              </DialogHeader>
              <ContributionForm
                savingGoalId={goal.id}
                onSubmit={handleContribution}
                onCancel={() => setContribDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
          {goal.savingType === "EMERGENCY" && isActive && (
            <Dialog open={withdrawDialogOpen} onOpenChange={setWithdrawDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" title="Retrait">
                  <Minus size={16} />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Retrait · {goal.label}</DialogTitle>
                </DialogHeader>
                <ContributionForm
                  savingGoalId={goal.id}
                  mode="withdrawal"
                  onSubmit={() => {
                    setWithdrawDialogOpen(false);
                    onContribution();
                  }}
                  onCancel={() => setWithdrawDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setEditing(!editing)}
          >
            <Pencil size={16} />
          </Button>
          {isTargetReached && isActive && (
            <Dialog open={validateDialogOpen} onOpenChange={setValidateDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="default" size="sm" title="Valider l'achat (archiver l'objectif)">
                  <CheckCircle2 size={16} className="mr-1" />
                  Valider l'achat
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Valider l&apos;objectif · {goal.label}</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                  L&apos;objectif sera archivé et le montant retiré de l&apos;épargne totale.
                </p>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    id="validate-create-asset"
                    checked={validateCreateAsset}
                    onChange={(e) => setValidateCreateAsset(e.target.checked)}
                    className={cn(
                      "h-4 w-4 rounded border border-input accent-primary",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    )}
                  />
                  <Label htmlFor="validate-create-asset" className="text-sm font-normal cursor-pointer">
                    Créer un actif dans Actifs & passifs ({convertAndFormat(goal.targetAmount)})
                  </Label>
                </label>
                {validateCreateAsset && (
                  <div className="space-y-2">
                    <Label htmlFor="validate-depreciation">Durée d&apos;amortissement (mois)</Label>
                    <Input
                      id="validate-depreciation"
                      type="number"
                      min={1}
                      value={validateDepreciationMonths}
                      onChange={(e) => setValidateDepreciationMonths(parseInt(e.target.value, 10) || 60)}
                    />
                  </div>
                )}
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setValidateDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleValidate} disabled={isValidating}>
                    {isValidating ? "Validation…" : "Valider"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (window.confirm("Supprimer cet objectif ?")) {
                onDelete(goal.id);
              }
            }}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {editing ? (
          <SavingGoalForm
            goal={goal}
            projects={projects}
            onSubmit={async (data) => {
              const ok = await onUpdate(goal.id, data);
              if (ok) setEditing(false);
              return ok;
            }}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <>
            {(goal.targetAmount > 0 || monthsToTarget != null || isTargetReached) && (
              <div className="flex flex-wrap gap-2">
                {goal.targetAmount > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 text-sm font-semibold text-primary">
                    Cible : {convertAndFormat(goal.targetAmount)}
                  </span>
                )}
                {isTargetReached ? (
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/15 px-2.5 py-1 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                    Objectif atteint
                  </span>
                ) : monthsToTarget != null ? (
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-500/15 px-2.5 py-1 text-sm font-semibold text-amber-700 dark:text-amber-400">
                    ~{monthsToTarget} mois restants
                  </span>
                ) : null}
              </div>
            )}
            <div className="flex items-center gap-2 min-w-0">
              <PiggyBank className="h-5 w-5 shrink-0 text-primary/70" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap justify-between gap-x-2 text-sm mb-1">
                  <span className="text-muted-foreground truncate min-w-0">
                    {convertAndFormat(currentForBar)} / {convertAndFormat(targetForBar)}
                    {isMonthlyScope && " (ce mois)"}
                  </span>
                  <span className="font-medium shrink-0">
                    {progressPercent.toFixed(0)} %
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden min-w-0">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {isMonthlyScope ? "Reste à épargner ce mois : " : "Reste à épargner : "}
              <strong className="text-foreground">{convertAndFormat(remaining)}</strong>
            </p>
            {contributions.length > 0 && (
              <details className="text-xs">
                <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                  {contributions.length} contribution(s)
                </summary>
                <ul className="mt-1 space-y-1 pl-2">
                  {contributions.slice(0, 5).map((c) => (
                    <li key={c.id} className="flex items-center justify-between gap-2">
                      <span className={c.amount < 0 ? "text-destructive" : undefined}>
                        {c.date} · {c.amount >= 0 ? "+" : ""}{convertAndFormat(c.amount)}
                        {c.isAutomatic && " (auto)"}
                      </span>
                      {c.isAutomatic && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs text-destructive hover:text-destructive"
                          onClick={() => handleRemoveContribution(c.id)}
                        >
                          Retirer
                        </Button>
                      )}
                    </li>
                  ))}
                  {contributions.length > 5 && (
                    <li className="text-muted-foreground">
                      ... et {contributions.length - 5} autre(s)
                    </li>
                  )}
                </ul>
              </details>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
