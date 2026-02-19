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
import { useSavingProjects } from "@/models/saving-projects/hooks/use-saving-projects";
import { SavingGoalForm } from "./saving-goal-form";
import { SavingGoalCard } from "./saving-goal-card";
import { SavingProjectCard } from "@/models/saving-projects/components/saving-project-card";
import { SavingProjectForm } from "@/models/saving-projects/components/saving-project-form";
import type { SavingGoal } from "../types/saving-goal";
import { Plus, FolderPlus } from "lucide-react";

export function SavingGoalList() {
  const {
    goals,
    isLoading,
    fetchGoals,
    createGoal,
    updateGoal,
    deleteGoal,
  } = useSavingGoals();
  const {
    projects,
    isLoading: projectsLoading,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  } = useSavingProjects();

  const [newGoalDialogOpen, setNewGoalDialogOpen] = useState(false);
  const [newProjectDialogOpen, setNewProjectDialogOpen] = useState(false);

  useEffect(() => {
    fetchGoals();
    fetchProjects();
  }, [fetchGoals, fetchProjects]);

  const goalsByProject = new Map<string | null, SavingGoal[]>();
  goalsByProject.set(null, []);
  for (const p of projects) {
    goalsByProject.set(p.id, []);
  }
  for (const g of goals) {
    const key = g.projectId ?? null;
    const list = goalsByProject.get(key) ?? [];
    list.push(g);
    goalsByProject.set(key, list);
  }

  const projectsList = projects.map((p) => ({ id: p.id, label: p.label }));

  const handleCreateGoal = async (data: {
    label: string;
    targetAmount: number;
    deadline: string | null;
    priority: "HIGH" | "MEDIUM" | "LOW";
    projectId?: string | null;
  }) => {
    const result = await createGoal(data);
    if (result) {
      setNewGoalDialogOpen(false);
      return true;
    }
    return false;
  };

  const handleCreateProject = async (data: {
    label: string;
    targetAmount: number | null;
    deadline: string | null;
  }) => {
    const result = await createProject(data);
    if (result) {
      setNewProjectDialogOpen(false);
      return true;
    }
    return false;
  };

  const loading = isLoading || projectsLoading;

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 space-y-0">
          <CardTitle>Épargne</CardTitle>
          <div className="flex gap-2">
            <Dialog open={newProjectDialogOpen} onOpenChange={setNewProjectDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <FolderPlus size={16} className="mr-1" />
                  Nouveau projet
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nouveau projet d&apos;épargne</DialogTitle>
                </DialogHeader>
                <SavingProjectForm
                  onSubmit={handleCreateProject}
                  onCancel={() => setNewProjectDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
            <Dialog open={newGoalDialogOpen} onOpenChange={setNewGoalDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus size={16} className="mr-1" />
                  Nouvel objectif
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nouvel objectif (sans projet)</DialogTitle>
                </DialogHeader>
                <SavingGoalForm
                  projects={projectsList}
                  onSubmit={handleCreateGoal}
                  onCancel={() => setNewGoalDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {loading ? (
        <p className="text-sm text-muted-foreground">Chargement...</p>
      ) : (
        <div className="space-y-8">
          {projects.map((project) => {
            const projectGoals = goalsByProject.get(project.id) ?? [];
            return (
              <SavingProjectCard
                key={project.id}
                project={project}
                goals={projectGoals}
                projectsList={projectsList}
                onUpdateProject={async (id, data) => {
                  const ok = await updateProject(id, data);
                  if (ok) fetchProjects();
                  return !!ok;
                }}
                onDeleteProject={async (id) => {
                  await deleteProject(id);
                  fetchGoals();
                }}
                onCreateGoal={async (data) => {
                  const ok = await createGoal(data);
                  if (ok) fetchGoals();
                  return !!ok;
                }}
                onUpdateGoal={async (id, data) => {
                  const ok = await updateGoal(id, data);
                  return !!ok;
                }}
                onDeleteGoal={async (id) => {
                  await deleteGoal(id);
                  fetchGoals();
                }}
                onContribution={fetchGoals}
              />
            );
          })}

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base">Sans projet</CardTitle>
              <Dialog open={newGoalDialogOpen} onOpenChange={setNewGoalDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Plus size={14} className="mr-1" />
                    Ajouter
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Nouvel objectif (sans projet)</DialogTitle>
                  </DialogHeader>
                  <SavingGoalForm
                    projects={projectsList}
                    onSubmit={handleCreateGoal}
                    onCancel={() => setNewGoalDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {(goalsByProject.get(null) ?? []).length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Aucun objectif sans projet. Créez un objectif ou déplacez une
                  ligne depuis un projet.
                </p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {(goalsByProject.get(null) ?? []).map((goal) => (
                    <SavingGoalCard
                      key={goal.id}
                      goal={goal}
                      projects={projectsList}
                      onUpdate={async (id, data) => {
                        const ok = await updateGoal(id, data);
                        return !!ok;
                      }}
                      onDelete={async (id) => {
                        await deleteGoal(id);
                        fetchGoals();
                      }}
                      onContribution={fetchGoals}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
