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
import { useAssets } from "../hooks/use-assets";
import { AssetForm } from "./asset-form";
import { useLiabilities } from "@/models/liabilities/hooks/use-liabilities";
import { LiabilityForm } from "@/models/liabilities/components/liability-form";
import { useCurrency } from "@/models/settings/hooks/use-currency";
import type { Asset } from "../types/asset";
import type { Liability } from "@/models/liabilities/types/liability";
import { Plus, Trash2 } from "lucide-react";

type RowType = "asset" | "liability";

interface TableRow {
  type: RowType;
  id: string;
  label: string;
  amount: number;
  date: string;
  note: string;
}

function toRows(assets: Asset[], liabilities: Liability[]): TableRow[] {
  const assetRows: TableRow[] = assets.map((a) => ({
    type: "asset",
    id: a.id,
    label: a.label,
    amount: a.purchaseValue,
    date: a.acquisitionDate,
    note: "",
  }));
  const liabilityRows: TableRow[] = liabilities.map((l) => ({
    type: "liability",
    id: l.id,
    label: l.label,
    amount: l.amount,
    date: l.date,
    note: l.note ?? "",
  }));
  const all = [...assetRows, ...liabilityRows];
  all.sort((a, b) => b.date.localeCompare(a.date));
  return all;
}

export function AssetList() {
  const { assets, isLoading: assetsLoading, fetchAssets, createAsset, deleteAsset } =
    useAssets();
  const {
    liabilities,
    isLoading: liabilitiesLoading,
    fetchLiabilities,
    createLiability,
    deleteLiability,
  } = useLiabilities();
  const { convertAndFormat } = useCurrency();
  const [assetDialogOpen, setAssetDialogOpen] = useState(false);
  const [liabilityDialogOpen, setLiabilityDialogOpen] = useState(false);

  const isLoading = assetsLoading || liabilitiesLoading;

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);
  useEffect(() => {
    fetchLiabilities();
  }, [fetchLiabilities]);

  const handleCreateAsset = async (data: Parameters<typeof createAsset>[0]) => {
    const result = await createAsset(data);
    if (result) {
      setAssetDialogOpen(false);
      return true;
    }
    return false;
  };

  const handleCreateLiability = async (
    data: Parameters<typeof createLiability>[0]
  ) => {
    const result = await createLiability(data);
    if (result) {
      setLiabilityDialogOpen(false);
      return true;
    }
    return false;
  };

  const handleDelete = async (row: TableRow) => {
    const message =
      row.type === "asset"
        ? "Supprimer cet actif ?"
        : "Supprimer ce passif ?";
    if (!window.confirm(message)) return;
    if (row.type === "asset") await deleteAsset(row.id);
    else await deleteLiability(row.id);
  };

  const rows = toRows(assets, liabilities);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Actifs & passifs</CardTitle>
        <div className="flex gap-2">
          <Dialog open={assetDialogOpen} onOpenChange={setAssetDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus size={16} className="mr-1" />
                Ajouter un actif
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nouvel actif</DialogTitle>
              </DialogHeader>
              <AssetForm
                onSubmit={handleCreateAsset}
                onCancel={() => setAssetDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
          <Dialog open={liabilityDialogOpen} onOpenChange={setLiabilityDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus size={16} className="mr-1" />
                Ajouter un passif
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nouveau passif</DialogTitle>
              </DialogHeader>
              <LiabilityForm
                onSubmit={handleCreateLiability}
                onCancel={() => setLiabilityDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Chargement...</p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aucun actif ni passif. Ajoutez des actifs (biens) ou des passifs
            (dettes) pour les lister ici.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-md border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-2 text-left font-medium">Type</th>
                  <th className="px-4 py-2 text-left font-medium">Libellé</th>
                  <th className="px-4 py-2 text-right font-medium">Montant</th>
                  <th className="px-4 py-2 text-left font-medium">Date</th>
                  <th className="px-4 py-2 text-left font-medium">Note</th>
                  <th className="w-10 px-2 py-2" />
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={`${row.type}-${row.id}`}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-4 py-2">
                      <span
                        className={
                          row.type === "asset"
                            ? "text-primary font-medium"
                            : "text-muted-foreground"
                        }
                      >
                        {row.type === "asset" ? "Actif" : "Passif"}
                      </span>
                    </td>
                    <td className="px-4 py-2">{row.label}</td>
                    <td className="px-4 py-2 text-right tabular-nums">
                      {convertAndFormat(row.amount)}
                    </td>
                    <td className="px-4 py-2">{row.date}</td>
                    <td className="px-4 py-2 text-muted-foreground">
                      {row.note || "—"}
                    </td>
                    <td className="px-2 py-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(row)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
