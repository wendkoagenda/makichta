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
import { useWishlist } from "../hooks/use-wishlist";
import { useSavingGoals } from "@/models/saving-goals/hooks/use-saving-goals";
import { WishlistItemForm } from "./wishlist-item-form";
import { useCurrency } from "@/models/settings/hooks/use-currency";
import { WISHLIST_PRIORITY_LABELS } from "../constants/priority-labels";
import type { WishlistItem } from "../types/wishlist-item";
import { Plus, PiggyBank, Trash2, ExternalLink } from "lucide-react";

export function WishlistList() {
  const { items, isLoading, fetchItems, createItem, deleteItem } = useWishlist();
  const { fetchGoals } = useSavingGoals();
  const { convertAndFormat } = useCurrency();
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchItems();
    fetchGoals();
  }, [fetchItems, fetchGoals]);

  const handleCreate = async (data: Parameters<typeof createItem>[0]) => {
    const result = await createItem(data);
    if (result) {
      setDialogOpen(false);
      return true;
    }
    return false;
  };

  const handleConvert = async (item: WishlistItem) => {
    const res = await fetch("/api/wishlist/convert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId: item.id }),
    });
    if (!res.ok) return;
    const { wishlistItem } = await res.json();
    fetchItems();
    fetchGoals();
    return wishlistItem;
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Supprimer cet article de la wishlist ?")) {
      await deleteItem(id);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Wishlist</CardTitle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus size={16} className="mr-1" />
              Ajouter
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouvel achat souhaité</DialogTitle>
            </DialogHeader>
            <WishlistItemForm
              onSubmit={handleCreate}
              onCancel={() => setDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Chargement...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aucun achat en wishlist. Ajoutez vos achats souhaités pour les
            convertir en objectifs d&apos;épargne.
          </p>
        ) : (
          <ul className="space-y-2">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between rounded-lg border border-border p-3"
              >
                <div>
                  <p className="font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {WISHLIST_PRIORITY_LABELS[item.priority]} ·{" "}
                    {convertAndFormat(item.estimatedCost)}
                    {item.savingGoalId && (
                      <span className="ml-1 text-primary">· Lié à un objectif</span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {item.url && (
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                    >
                      <a href={item.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink size={16} />
                      </a>
                    </Button>
                  )}
                  {!item.savingGoalId && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleConvert(item)}
                      title="Convertir en objectif d'épargne"
                    >
                      <PiggyBank size={16} className="text-primary" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(item.id)}
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
