export interface AllocationRuleCategory {
  id: string;
  label: string;
}

export interface AllocationRule {
  id: string;
  label: string;
  percentage: number;
  monthId: string;
  categoryIds?: string[];
  categories?: AllocationRuleCategory[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAllocationRuleInput {
  label: string;
  percentage: number;
  monthId: string;
  expenseCategoryIds?: string[];
}

export interface UpdateAllocationRuleInput {
  label?: string;
  percentage?: number;
  expenseCategoryIds?: string[];
}
