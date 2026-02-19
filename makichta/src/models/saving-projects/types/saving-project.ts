export interface SavingProject {
  id: string;
  label: string;
  targetAmount: number | null;
  deadline: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSavingProjectInput {
  label: string;
  targetAmount?: number | null;
  deadline?: string | null;
}

export interface UpdateSavingProjectInput {
  label?: string;
  targetAmount?: number | null;
  deadline?: string | null;
}
