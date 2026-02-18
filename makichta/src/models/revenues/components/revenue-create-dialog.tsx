"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRevenueSources } from "../hooks/use-revenue-sources";
import { RevenueForm } from "./revenue-form";
import { useEffect } from "react";

interface RevenueCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function RevenueCreateDialog({
  open,
  onOpenChange,
  onSuccess,
}: RevenueCreateDialogProps) {
  const { sources, fetchSources } = useRevenueSources();

  useEffect(() => {
    if (open) fetchSources();
  }, [open, fetchSources]);

  const handleSubmit = async (data: {
    sourceId: string;
    amount: number;
    date: string;
    description?: string;
  }) => {
    const res = await fetch("/api/revenues", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) return false;
    onOpenChange(false);
    onSuccess();
    return true;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouveau revenu</DialogTitle>
        </DialogHeader>
        <RevenueForm
          sources={sources}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
