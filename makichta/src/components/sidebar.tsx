"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { useSettings } from "@/models/settings/hooks/use-settings";
import { Button } from "@/components/ui/button";
import { NAV_ITEMS } from "@/constants/nav-items";
import { LogOut } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const { settings } = useSettings();

  return (
    <aside className="hidden h-screen w-64 flex-col border-r border-border bg-card md:flex">
      <Link href="/dashboard" className="flex h-16 items-center gap-2 border-b border-border px-6">
        <Image
          src="/logo_mk-no-bg.png"
          alt="Ma Kichta"
          width={140}
          height={40}
          className="h-8 w-auto object-contain"
          priority
        />
      </Link>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;

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
                  <Icon size={20} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="space-y-2 border-t border-border px-6 py-4">
        <p className="text-xs text-muted-foreground">
          Devise : {settings.currency}
        </p>
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
    </aside>
  );
}
