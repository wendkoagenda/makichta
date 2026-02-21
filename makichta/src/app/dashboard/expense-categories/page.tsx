"use client";

import { ExpenseCategoryList } from "@/models/expense-categories/components/expense-category-list";

export default function ExpenseCategoriesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          Catégories de dépenses
        </h1>
        <p className="text-muted-foreground">
          Gérez vos postes de dépenses et liez-les aux règles de répartition
        </p>
      </div>

      <ExpenseCategoryList />
    </div>
  );
}
