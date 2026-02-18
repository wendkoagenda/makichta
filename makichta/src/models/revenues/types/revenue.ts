export interface Revenue {
  id: string;
  sourceId: string;
  amount: number;
  date: string;
  description: string;
  createdAt?: string;
}

export interface CreateRevenueInput {
  sourceId: string;
  amount: number;
  date: string;
  description?: string;
}

export interface UpdateRevenueInput {
  sourceId?: string;
  amount?: number;
  date?: string;
  description?: string;
}
