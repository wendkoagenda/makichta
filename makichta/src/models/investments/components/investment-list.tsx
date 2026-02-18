"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInvestments } from "../hooks/use-investments";
import { InvestmentForm } from "./investment-form";
import { useCurrency } from "@/models/settings/hooks/use-currency";
import { INVESTMENT_TYPES, INVESTMENT_TYPE_LABELS } from "../constants/investment-types";
import { Plus, Trash2 } from "lucide-react";

interface InvestmentListProps {
  onInvestmentChange?: () => void;
}

export function InvestmentList({ onInvestmentChange }: InvestmentListProps) {
  const {
    investments,
    isLoading,
    fetchInvestments,
    createInvestment,
    deleteInvestment,
  } = useInvestments();
  const { convertAndFormat } = useCurrency();
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchInvestments(typeFilter || undefined);
  }, [fetchInvestments, typeFilter]);

  const handleCreate = async (data: {
    type: string;
    amount: number;
    date: string;
    description?: string;
  }) => {
    const result = await createInvestment(data);
    if (result) {
      setDialogOpen(false);
      onInvestmentChange?.();
      return true;
    }
    return false;
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Supprimer cet investissement ?")) {
      await deleteInvestment(id);
      onInvestmentChange?.();
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Historique des investissements</CardTitle>
        <div className="flex gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Tous les types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous les types</SelectItem>
              {INVESTMENT_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {INVESTMENT_TYPE_LABELS[t]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus size={16} className="mr-1" />
                Ajouter
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nouvel investissement</DialogTitle>
              </DialogHeader>
              <InvestmentForm
                onSubmit={handleCreate}
                onCancel={() => setDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Chargement...</p>
        ) : investments.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aucun investissement. Cliquez sur « Ajouter » pour enregistrer vos
            placements.
          </p>
        ) : (
          <ul className="space-y-2">
            {investments.map((inv) => (
              <li
                key={inv.id}
                className="flex items-center justify-between rounded-lg border border-border p-3"
              >
                <div>
                  <p className="font-medium">
                    {INVESTMENT_TYPE_LABELS[inv.type] ?? inv.type}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {inv.date} · {inv.description || "—"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-primary">
                    +{convertAndFormat(inv.amount)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(inv.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
