export interface AllocationRule {
  id: string;
  label: string;
  percentage: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAllocationRuleInput {
  label: string;
  percentage: number;
}

export interface UpdateAllocationRuleInput {
  label?: string;
  percentage?: number;
}
