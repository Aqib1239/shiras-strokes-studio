"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, useRequireAuth } from "@/lib/auth-context";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  MessageSquareHeart,
  Settings,
  LogOut,
  Store,
  Menu,
  X,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { BrushDivider } from "@/components/Decor";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function AdminLayout({ children, title, subtitle, action }: AdminLayoutProps) {
  const { admin, logout } = useAuth();
  const { isLoading } = useRequireAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Reviews", href: "/admin/reviews", icon: MessageSquareHeart },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Fluent-style dot ring spinner */}
          <div className="relative h-14 w-14">
            {Array.from({ length: 8 }).map((_, i) => (
              <span
                key={i}
                className="absolute left-1/2 top-1/2 h-[10px] w-[10px] -ml-[5px] -mt-[5px] rounded-full"
                style={{
                  transform: `rotate(${i * 45}deg) translateY(-22px)`,
                }}
              >
                <span
                  className="block h-full w-full rounded-full animate-[fluent-pulse_1.2s_ease-in-out_infinite]"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              </span>
            ))}
          </div>
  
          {/* Loading text */}
          <div className="mt-6">
            <p className="font-display text-lg font-semibold tracking-tight text-ink">
              Shira&rsquo;s Strokes
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Verifying admin session
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border/70 bg-card">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <span className="font-display text-xl text-ink font-semibold">Shira&rsquo;s Admin</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl border border-border/70 text-ink hover:bg-secondary"
          aria-label="Toggle Navigation"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-border/70 bg-card p-6 flex flex-col transition-transform duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex flex-col">
            <span className="font-display text-2xl font-semibold tracking-tight text-ink">
              Shira&rsquo;s Strokes
            </span>
            <span className="font-hand text-sm text-rose">Studio Management</span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-muted-foreground hover:bg-secondary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <BrushDivider className="my-4 w-full opacity-60" />

        {/* User Info Badge */}
        <div className="mb-6 rounded-2xl bg-secondary/70 p-2 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-ink truncate">{admin?.name || "Admin"}</p>
            <p className="text-[0.7rem] text-muted-foreground truncate">{admin?.email}</p>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="space-y-1.5 flex-1">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground/80 hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-border/70 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between rounded-2xl px-4 py-2.5 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <span className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              Visit Store
            </span>
            <ExternalLink className="h-3 w-3" />
          </Link>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-ink/30 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Main Content Area */}
      <main className="min-h-screen md:ml-64 flex flex-col min-w-0">
        <div className="border-b border-border/60 bg-card/60 px-6 py-6 sm:px-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl text-ink">{title}</h1>
              {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
            </div>
            {action && <div className="flex items-center gap-3 shrink-0">{action}</div>}
          </div>
        </div>

        <div className="p-6 sm:p-10 flex-1">{children}</div>
      </main>
    </div>
  );
}
