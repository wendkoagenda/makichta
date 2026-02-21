"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getNavItemsInDrawer } from "@/constants/nav-items";
import { LayoutDashboard, Wallet, CreditCard, PiggyBank, Menu, LogOut } from "lucide-react";

const ICON_SIZE = 24;

function ActiveIndicator({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        "mt-1 h-0.5 w-6 rounded-full transition-colors",
        active ? "bg-primary" : "bg-transparent"
      )}
      aria-hidden
    />
  );
}

export function BottomNav() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

  const drawerItems = getNavItemsInDrawer();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-border bg-card px-2 py-2 md:hidden"
      aria-label="Navigation principale"
    >
      {/* 1. Dépenses */}
      <Link
        href="/dashboard/expenses"
        className="flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-muted-foreground transition-colors hover:text-foreground"
        aria-current={pathname.startsWith("/dashboard/expenses") ? "page" : undefined}
      >
        <CreditCard size={ICON_SIZE} />
        <ActiveIndicator active={pathname.startsWith("/dashboard/expenses")} />
      </Link>

      {/* 2. Revenus */}
      <Link
        href="/dashboard/revenues"
        className="flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-muted-foreground transition-colors hover:text-foreground"
        aria-current={isActive("/dashboard/revenues") ? "page" : undefined}
      >
        <Wallet size={ICON_SIZE} />
        <ActiveIndicator active={isActive("/dashboard/revenues")} />
      </Link>

      {/* 3. Central: Tableau de bord (bouton mis en avant) */}
      <Link
        href="/dashboard"
        className="flex flex-1 flex-col items-center justify-center py-2"
        aria-current={pathname === "/dashboard" ? "page" : undefined}
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
          <LayoutDashboard size={ICON_SIZE} />
        </span>
      </Link>

      {/* 4. Épargne */}
      <Link
        href="/dashboard/savings"
        className="flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-muted-foreground transition-colors hover:text-foreground"
        aria-current={isActive("/dashboard/savings") ? "page" : undefined}
      >
        <PiggyBank size={ICON_SIZE} />
        <ActiveIndicator active={isActive("/dashboard/savings")} />
      </Link>

      {/* 5. Plus (ouvre le tiroir) */}
      <Dialog open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="flex flex-1 flex-col gap-0.5 py-2 text-muted-foreground hover:text-foreground"
            aria-label="Ouvrir le menu"
          >
            <Menu size={ICON_SIZE} />
            <span className="h-0.5 w-6 rounded-full bg-transparent" aria-hidden />
          </Button>
        </DialogTrigger>
        <DialogContent className="bottom-0 left-0 right-0 top-auto max-h-[85vh] translate-x-0 translate-y-0 rounded-t-2xl border-t">
          <DialogHeader>
            <DialogTitle>Menu</DialogTitle>
          </DialogHeader>
          <ul className="flex flex-col gap-1 overflow-y-auto">
            {drawerItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                    onClick={() => setDrawerOpen(false)}
                  >
                    <Icon size={20} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="border-t border-border pt-4">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 text-muted-foreground"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut size={16} />
              Déconnexion
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </nav>
  );
}
