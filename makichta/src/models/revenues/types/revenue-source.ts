export type Frequency = "RECURRING" | "ONE_TIME";
export type RecurrenceInterval = "WEEKLY" | "MONTHLY" | "YEARLY" | null;

export interface RevenueSource {
  id: string;
  label: string;
  frequency: Frequency;
  recurrenceInterval: RecurrenceInterval;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRevenueSourceInput {
  label: string;
  frequency: Frequency;
  recurrenceInterval: RecurrenceInterval;
}

export interface UpdateRevenueSourceInput {
  label?: string;
  frequency?: Frequency;
  recurrenceInterval?: RecurrenceInterval;
}
