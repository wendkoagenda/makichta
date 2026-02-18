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
import { useCurrency } from "@/models/settings/hooks/use-currency";
import { getAssetCalculations } from "../types/asset";
import type { Asset } from "../types/asset";
import { Plus, Trash2, Package } from "lucide-react";

export function AssetList() {
  const { assets, isLoading, fetchAssets, createAsset, deleteAsset } =
    useAssets();
  const { convertAndFormat } = useCurrency();
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const handleCreate = async (data: Parameters<typeof createAsset>[0]) => {
    const result = await createAsset(data);
    if (result) {
      setDialogOpen(false);
      return true;
    }
    return false;
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Supprimer ce bien ?")) {
      await deleteAsset(id);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Biens et amortissement</CardTitle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus size={16} className="mr-1" />
              Ajouter un bien
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouveau bien</DialogTitle>
            </DialogHeader>
            <AssetForm
              onSubmit={handleCreate}
              onCancel={() => setDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Chargement...</p>
        ) : assets.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aucun bien enregistré. Ajoutez vos biens pour suivre leur
            amortissement linéaire.
          </p>
        ) : (
          <ul className="space-y-4">
            {assets.map((asset) => (
              <AssetRow
                key={asset.id}
                asset={asset}
                convertAndFormat={convertAndFormat}
                onDelete={() => handleDelete(asset.id)}
              />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function AssetRow({
  asset,
  convertAndFormat,
  onDelete,
}: {
  asset: Asset;
  convertAndFormat: (n: number) => string;
  onDelete: () => void;
}) {
  const calc = getAssetCalculations(asset);

  return (
    <li className="rounded-lg border border-border p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-primary/70" />
          <div>
            <p className="font-medium">{asset.label}</p>
            <p className="text-xs text-muted-foreground">
              Acquis le {asset.acquisitionDate} ·{" "}
              {asset.depreciationDurationMonths} mois
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 size={16} />
        </Button>
      </div>
      <div className="mt-3 grid gap-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Valeur d&apos;achat</span>
          <span>{convertAndFormat(asset.purchaseValue)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Amort. mensuel</span>
          <span>{convertAndFormat(calc.monthlyDepreciation)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Amort. annuel</span>
          <span>{convertAndFormat(calc.annualDepreciation)}</span>
        </div>
        <div className="flex justify-between font-medium">
          <span className="text-muted-foreground">Valeur résiduelle</span>
          <span>{convertAndFormat(calc.residualValue)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Statut</span>
          <span
            className={
              calc.isAmortized ? "text-muted-foreground" : "text-primary"
            }
          >
            {calc.isAmortized ? "Amorti" : "En cours"}
          </span>
        </div>
      </div>
    </li>
  );
}
