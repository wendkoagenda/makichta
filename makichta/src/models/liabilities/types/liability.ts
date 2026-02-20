export interface Liability {
  id: string;
  label: string;
  amount: number;
  date: string;
  note: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateLiabilityInput {
  label: string;
  amount: number;
  date: string;
  note?: string | null;
}
