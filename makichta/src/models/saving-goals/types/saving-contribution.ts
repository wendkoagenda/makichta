export interface SavingContribution {
  id: string;
  savingGoalId: string;
  amount: number;
  date: string;
  isAutomatic: boolean;
  createdAt?: string;
}

export interface CreateSavingContributionInput {
  savingGoalId: string;
  amount: number;
  date: string;
  isAutomatic?: boolean;
  /** Lorsque créée automatiquement depuis une répartition (allocation), pour pouvoir annuler au recalcul du revenu */
  revenueId?: string | null;
}
