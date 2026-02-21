"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const MONTH_LABELS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

function getMonthOptions(count: number = 12): { value: string; label: string }[] {
  const options: { value: string; label: string }[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    options.push({
      value: `${y}-${m}`,
      label: `${MONTH_LABELS[d.getMonth()]} ${y}`,
    });
  }
  return options;
}

export interface MonthPickerProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  triggerClassName?: string;
  label?: string;
  monthCount?: number;
}

export function MonthPicker({
  value,
  onValueChange,
  className,
  triggerClassName,
  label,
  monthCount = 12,
}: MonthPickerProps) {
  const options = getMonthOptions(monthCount);

  return (
    <div className={className}>
      {label && (
        <Label className="mb-1 block text-sm font-medium">{label}</Label>
      )}
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className={triggerClassName ?? "w-full sm:w-[180px]"}>
          <SelectValue placeholder="Choisir un mois" />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export { getMonthOptions };
