"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSavingGoals } from "../hooks/use-saving-goals";
import type { SavingGoal } from "../types/saving-goal";
import { SavingGoalForm } from "./saving-goal-form";
import { SavingGoalCard } from "./saving-goal-card";
import { Plus } from "lucide-react";

export function SavingGoalList() {
  const {
    goals,
    isLoading,
    fetchGoals,
    createGoal,
    updateGoal,
    deleteGoal,
  } = useSavingGoals();
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const handleCreate = async (data: {
    label: string;
    targetAmount: number;
    deadline: string | null;
    priority: "HIGH" | "MEDIUM" | "LOW";
  }) => {
    const result = await createGoal(data);
    if (result) {
      setDialogOpen(false);
      return true;
    }
    return false;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Objectifs d&apos;épargne</CardTitle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus size={16} className="mr-1" />
              Nouvel objectif
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouvel objectif d&apos;épargne</DialogTitle>
            </DialogHeader>
            <SavingGoalForm
              onSubmit={handleCreate}
              onCancel={() => setDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Chargement...</p>
        ) : goals.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aucun objectif. Créez un objectif (fonds d&apos;urgence, voyage,
            achat immobilier…) pour suivre votre épargne.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {goals.map((goal: SavingGoal) => (
              <SavingGoalCard
                key={goal.id}
                goal={goal}
                onUpdate={async (id, data) => {
                  const ok = await updateGoal(id, data);
                  return !!ok;
                }}
                onDelete={async (id) => {
                  await deleteGoal(id);
                }}
                onContribution={fetchGoals}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
