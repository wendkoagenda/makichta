export interface Investment {
  id: string;
  type: string;
  amount: number;
  date: string;
  description: string;
  createdAt?: string;
}

export interface CreateInvestmentInput {
  type: string;
  amount: number;
  date: string;
  description?: string;
}
