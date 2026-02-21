"use client";

import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Wallet,
  History,
  PieChart,
  CreditCard,
  FolderTree,
  PiggyBank,
  TrendingUp,
  CalendarClock,
  ShoppingBag,
  Building2,
  Settings,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/dashboard/revenues", label: "Revenus", icon: Wallet },
  { href: "/dashboard/revenue-history", label: "Historique des revenus", icon: History },
  { href: "/dashboard/allocations", label: "Répartition", icon: PieChart },
  { href: "/dashboard/expenses", label: "Dépenses", icon: CreditCard },
  { href: "/dashboard/expense-categories", label: "Catégories de dépenses", icon: FolderTree },
  { href: "/dashboard/savings", label: "Épargne", icon: PiggyBank },
  { href: "/dashboard/investments", label: "Investissement", icon: TrendingUp },
  { href: "/dashboard/planning", label: "Planification", icon: CalendarClock },
  { href: "/dashboard/wishlist", label: "Wishlist", icon: ShoppingBag },
  { href: "/dashboard/depreciation", label: "Actifs & passifs", icon: Building2 },
  { href: "/dashboard/settings", label: "Paramètres", icon: Settings },
];

/** Hrefs présents dans la bottom bar : le reste va dans le tiroir "Plus". */
const BOTTOM_BAR_HREFS = new Set([
  "/dashboard",
  "/dashboard/revenues",
  "/dashboard/expenses",
  "/dashboard/savings",
]);

export function getNavItemsInDrawer(): NavItem[] {
  return NAV_ITEMS.filter((item) => !BOTTOM_BAR_HREFS.has(item.href));
}
