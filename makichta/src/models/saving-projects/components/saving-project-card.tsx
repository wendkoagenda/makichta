"use client";

import { useState } from "react";
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
import { SavingGoalCard } from "@/models/saving-goals/components/saving-goal-card";
import { SavingGoalForm } from "@/models/saving-goals/components/saving-goal-form";
import { SavingProjectForm } from "./saving-project-form";
import type { SavingProject } from "../types/saving-project";
import type { SavingGoal } from "@/models/saving-goals/types/saving-goal";
import { Pencil, Plus, FolderOpen, Trash2 } from "lucide-react";

interface SavingProjectCardProps {
  project: SavingProject;
  goals: SavingGoal[];
  projectsList: { id: string; label: string }[];
  onUpdateProject: (
    id: string,
    data: { label: string; targetAmount: number | null; deadline: string | null }
  ) => Promise<boolean>;
  onDeleteProject: (id: string) => Promise<void>;
  onCreateGoal: (data: {
    label: string;
    savingType: "TARGET" | "EMERGENCY";
    targetAmount: number;
    deadline: string | null;
    priority: "HIGH" | "MEDIUM" | "LOW";
    projectId?: string | null;
  }) => Promise<boolean>;
  onUpdateGoal: (
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
  onDeleteGoal: (id: string) => Promise<void>;
  onContribution: () => void;
}

export function SavingProjectCard({
  project,
  goals,
  projectsList,
  onUpdateProject,
  onDeleteProject,
  onCreateGoal,
  onUpdateGoal,
  onDeleteGoal,
  onContribution,
}: SavingProjectCardProps) {
  const { convertAndFormat } = useCurrency();
  const [editProjectOpen, setEditProjectOpen] = useState(false);
  const [addLineOpen, setAddLineOpen] = useState(false);

  const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0);
  const totalCurrent = goals.reduce((s, g) => s + g.currentAmount, 0);

  return (
    <Card className="min-w-0">
      <CardHeader className="flex flex-col gap-2 pb-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5 shrink-0 text-primary/70" />
            <div className="min-w-0">
              <p className="font-medium wrap-break-word">{project.label}</p>
              <p className="text-xs text-muted-foreground wrap-break-word">
                {goals.length} ligne(s)
                {project.targetAmount != null && project.targetAmount > 0 && (
                  <> · Objectif global : {convertAndFormat(project.targetAmount)}</>
                )}
                {project.deadline && ` · Échéance ${project.deadline}`}
              </p>
            </div>
          </div>
        </div>
        <div className="flex shrink-0 gap-1">
          <Dialog open={editProjectOpen} onOpenChange={setEditProjectOpen}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setEditProjectOpen(true)}
              title="Modifier le projet"
            >
              <Pencil size={16} />
            </Button>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Modifier le projet</DialogTitle>
              </DialogHeader>
              <SavingProjectForm
                project={project}
                onSubmit={async (data) => {
                  const ok = await onUpdateProject(project.id, data);
                  if (ok) setEditProjectOpen(false);
                  return ok;
                }}
                onCancel={() => setEditProjectOpen(false)}
              />
            </DialogContent>
          </Dialog>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (
                window.confirm(
                  "Supprimer ce projet ? Les lignes seront déplacées dans « Sans projet »."
                )
              ) {
                onDeleteProject(project.id);
              }
            }}
            className="text-destructive hover:text-destructive"
            title="Supprimer le projet"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Dialog open={addLineOpen} onOpenChange={setAddLineOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="w-full">
              <Plus size={16} className="mr-1" />
              Ajouter une ligne
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouvelle ligne · {project.label}</DialogTitle>
            </DialogHeader>
            <SavingGoalForm
              projectId={project.id}
              projects={projectsList}
              onSubmit={async (data) => {
                const ok = await onCreateGoal({ ...data, projectId: project.id });
                if (ok) setAddLineOpen(false);
                return ok;
              }}
              onCancel={() => setAddLineOpen(false)}
            />
          </DialogContent>
        </Dialog>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => (
            <SavingGoalCard
              key={goal.id}
              goal={goal}
              projects={projectsList}
              onUpdate={async (id, data) => {
                const ok = await onUpdateGoal(id, data);
                return ok;
              }}
              onDelete={onDeleteGoal}
              onContribution={onContribution}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
