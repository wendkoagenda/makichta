/** Contribution avec libellé de l'objectif et du projet pour l'affichage en liste. */
export interface ContributionEnriched {
  id: string;
  savingGoalId: string;
  goalLabel: string;
  projectLabel: string | null;
  amount: number;
  date: string;
  isAutomatic: boolean;
  monthId: string;
  createdAt?: string;
}
