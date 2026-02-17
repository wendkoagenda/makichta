"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSettings } from "@/models/settings/hooks/use-settings";
import {
  LayoutDashboard,
  Wallet,
  PieChart,
  CreditCard,
  PiggyBank,
  TrendingUp,
  CalendarClock,
  ShoppingBag,
  Building2,
  Settings,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Tableau de bord", icon: <LayoutDashboard size={20} /> },
  { href: "/dashboard/revenues", label: "Revenus", icon: <Wallet size={20} /> },
  { href: "/dashboard/allocations", label: "Répartition", icon: <PieChart size={20} /> },
  { href: "/dashboard/expenses", label: "Dépenses", icon: <CreditCard size={20} /> },
  { href: "/dashboard/savings", label: "Épargne", icon: <PiggyBank size={20} /> },
  { href: "/dashboard/investments", label: "Investissement", icon: <TrendingUp size={20} /> },
  { href: "/dashboard/planning", label: "Planification", icon: <CalendarClock size={20} /> },
  { href: "/dashboard/wishlist", label: "Wishlist", icon: <ShoppingBag size={20} /> },
  { href: "/dashboard/depreciation", label: "Amortissement", icon: <Building2 size={20} /> },
  { href: "/dashboard/settings", label: "Paramètres", icon: <Settings size={20} /> },
];

export function Sidebar() {
  const pathname = usePathname();
  const { settings } = useSettings();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <Wallet className="h-6 w-6 text-primary" />
        <span className="text-lg font-bold text-foreground">Ma Kichta</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-border px-6 py-4">
        <p className="text-xs text-muted-foreground">
          Devise : {settings.currency}
        </p>
      </div>
    </aside>
  );
}
