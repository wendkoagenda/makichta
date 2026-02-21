export interface AllocationRuleCategory {
  id: string;
  label: string;
}

export interface AllocationRuleSavingGoal {
  id: string;
  label: string;
}

export type AllocationRuleType = "PERCENT" | "AMOUNT";

export interface AllocationRule {
  id: string;
  label: string;
  allocationType: AllocationRuleType;
  percentage: number;
  amount: number | null;
  monthId: string;
  /** Montant calculé : pour PERCENT = total revenus × (percentage/100), pour AMOUNT = amount */
  calculatedAmount?: number;
  savingGoalId?: string | null;
  savingGoal?: AllocationRuleSavingGoal | null;
  categoryIds?: string[];
  categories?: AllocationRuleCategory[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAllocationRuleInput {
  label: string;
  allocationType?: AllocationRuleType;
  percentage?: number;
  amount?: number | null;
  monthId: string;
  expenseCategoryIds?: string[];
  savingGoalId?: string | null;
}

export interface UpdateAllocationRuleInput {
  label?: string;
  allocationType?: AllocationRuleType;
  percentage?: number;
  amount?: number | null;
  expenseCategoryIds?: string[];
  savingGoalId?: string | null;
}
