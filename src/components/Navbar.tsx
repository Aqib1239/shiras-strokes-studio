"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, memo } from "react";
import { useAuth } from "@/lib/auth-context";
import { ShieldCheck } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/our-story", label: "Our Story" },
  { to: "/reviews", label: "Reviews" },
  { to: "/contact", label: "Contact" },
] as const;

export const Navbar = memo(function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Hide main public navbar on admin dashboard pages to keep admin focused
  const isAdminDashboard = pathname.startsWith("/admin") && pathname !== "/admin/login";
  if (isAdminDashboard) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-md">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:h-20 sm:px-6"
      >
        <Link href="/" prefetch={true} className="group flex flex-col leading-none">
          <span className="font-display text-xl tracking-tight text-ink sm:text-2xl">
            Shira&rsquo;s Strokes
          </span>
          <span className="font-hand text-sm text-rose">Handmade with Love</span>
        </Link>

        <ul className="hidden items-center gap-7 lg:flex">
          {links.map((l) => {
            const isActive = pathname === l.to;
            return (
              <li key={l.to}>
                <Link
                  href={l.to}
                  prefetch={true}
                  className={`relative py-1 text-sm transition-colors hover:text-primary ${
                    isActive ? "text-primary font-medium" : "text-foreground/80"
                  }`}
                >
                  {l.label}
                  {isActive && (
                    <span className="absolute -bottom-0.5 left-0 h-px w-full bg-rose" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          {isAuthenticated && (
            <Link
              href="/admin/dashboard"
              prefetch={true}
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-secondary/80 px-3 py-1.5 text-xs font-medium text-primary hover:bg-secondary transition-colors"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Admin
            </Link>
          )}

          <Link
            href="/contact"
            prefetch={true}
            className="hidden rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03] active:scale-95 sm:inline-flex"
          >
            Custom Order
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-11 w-11 items-center justify-center rounded-full hairline bg-card lg:hidden"
          >
            <span className="relative block h-3.5 w-5">
              <span
                className={`absolute left-0 top-0 block h-px w-5 bg-ink transition-transform duration-200 ${
                  open ? "rotate-45 translate-y-[7px]" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-1.5 block h-px w-5 bg-ink transition-opacity duration-150 ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 top-3.5 block h-px w-5 bg-ink transition-transform duration-200 ${
                  open ? "-rotate-45 -translate-y-[7px]" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-border/60 bg-background/98 lg:hidden"
          >
            <ul className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-4">
              {links.map((l) => (
                <li key={l.to}>
                  <Link
                    href={l.to}
                    prefetch={true}
                    onClick={() => setOpen(false)}
                    className={`block rounded-2xl px-4 py-3.5 font-display text-xl transition-colors hover:bg-secondary ${
                      pathname === l.to ? "bg-secondary text-primary font-medium" : "text-ink"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link
                  href="/contact"
                  prefetch={true}
                  onClick={() => setOpen(false)}
                  className="block rounded-full bg-primary px-5 py-3.5 text-center text-sm font-medium text-primary-foreground"
                >
                  Custom Order
                </Link>
              </li>
              {isAuthenticated && (
                <li className="pt-1">
                  <Link
                    href="/admin/dashboard"
                    prefetch={true}
                    onClick={() => setOpen(false)}
                    className="block rounded-2xl border border-primary/20 bg-secondary/50 px-4 py-3 text-center text-sm font-medium text-primary"
                  >
                    Open Admin Dashboard
                  </Link>
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
});
