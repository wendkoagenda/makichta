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
import { Pencil, Plus, PiggyBank, Trash2 } from "lucide-react";

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
}

export function SavingGoalCard({
  goal,
  projects = [],
  onUpdate,
  onDelete,
  onContribution,
}: SavingGoalCardProps) {
  const { convertAndFormat } = useCurrency();
  const [editing, setEditing] = useState(false);
  const [contributions, setContributions] = useState<SavingContribution[]>([]);
  const [contribDialogOpen, setContribDialogOpen] = useState(false);

  const progressPercent =
    goal.targetAmount > 0
      ? Math.min(100, (goal.currentAmount / goal.targetAmount) * 100)
      : 0;
  const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

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
            {PRIORITY_LABELS[goal.priority]} · Cible : {convertAndFormat(goal.targetAmount)}
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
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setEditing(!editing)}
          >
            <Pencil size={16} />
          </Button>
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
            <div className="flex items-center gap-2 min-w-0">
              <PiggyBank className="h-5 w-5 shrink-0 text-primary/70" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap justify-between gap-x-2 text-sm mb-1">
                  <span className="text-muted-foreground truncate min-w-0">
                    {convertAndFormat(goal.currentAmount)} / {convertAndFormat(goal.targetAmount)}
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
              Reste à épargner : <strong className="text-foreground">{convertAndFormat(remaining)}</strong>
            </p>
            {contributions.length > 0 && (
              <details className="text-xs">
                <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                  {contributions.length} contribution(s)
                </summary>
                <ul className="mt-1 space-y-1 pl-2">
                  {contributions.slice(0, 5).map((c) => (
                    <li key={c.id}>
                      {c.date} · +{convertAndFormat(c.amount)}
                      {c.isAutomatic && " (auto)"}
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
