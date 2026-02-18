import { FREQUENCIES, RECURRENCE_INTERVALS } from "@/lib/constants";

export const FREQUENCY_LABELS: Record<string, string> = {
  [FREQUENCIES.RECURRING]: "Récurrent",
  [FREQUENCIES.ONE_TIME]: "Ponctuel",
};

export const RECURRENCE_INTERVAL_LABELS: Record<string, string> = {
  [RECURRENCE_INTERVALS.WEEKLY]: "Hebdomadaire",
  [RECURRENCE_INTERVALS.MONTHLY]: "Mensuelle",
  [RECURRENCE_INTERVALS.YEARLY]: "Annuelle",
};
