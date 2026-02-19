"use client";

import { useCallback, useState } from "react";
import type { SavingProject } from "../types/saving-project";
import type {
  CreateSavingProjectInput,
  UpdateSavingProjectInput,
} from "../types/saving-project";

export function useSavingProjects() {
  const [projects, setProjects] = useState<SavingProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/saving-projects");
      if (!res.ok) throw new Error("Erreur réseau");
      const data: SavingProject[] = await res.json();
      setProjects(data);
    } catch {
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createProject = useCallback(
    async (input: CreateSavingProjectInput): Promise<SavingProject | null> => {
      const res = await fetch("/api/saving-projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) return null;
      const data: SavingProject = await res.json();
      setProjects((prev) => [...prev, data].sort((a, b) => a.label.localeCompare(b.label)));
      return data;
    },
    []
  );

  const updateProject = useCallback(
    async (
      id: string,
      input: UpdateSavingProjectInput
    ): Promise<SavingProject | null> => {
      const res = await fetch(`/api/saving-projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) return null;
      const data: SavingProject = await res.json();
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? data : p)).sort((a, b) => a.label.localeCompare(b.label))
      );
      return data;
    },
    []
  );

  const deleteProject = useCallback(async (id: string): Promise<boolean> => {
    const res = await fetch(`/api/saving-projects/${id}`, { method: "DELETE" });
    if (!res.ok) return false;
    setProjects((prev) => prev.filter((p) => p.id !== id));
    return true;
  }, []);

  return {
    projects,
    isLoading,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  };
}
