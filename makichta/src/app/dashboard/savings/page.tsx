"use client";

import { SavingGoalList } from "@/models/saving-goals/components/saving-goal-list";

export default function SavingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Épargne</h1>
        <p className="text-muted-foreground">
          Créez des projets (ex. Mariage) et des lignes d&apos;épargne (ex. Voiture, Déménagement) pour suivre votre progression
        </p>
      </div>
      <SavingGoalList />
    </div>
  );
}
