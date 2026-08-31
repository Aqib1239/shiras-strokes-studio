"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Facebook, Instagram, MessageCircle, Lock } from "lucide-react";
import { FACEBOOK_URL, INSTAGRAM_URL, WHATSAPP_URL } from "@/lib/site-data";
import { BrushDivider } from "@/components/Decor";
import { memo } from "react";

const pages = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/our-story", label: "Our Story" },
  { to: "/reviews", label: "Reviews" },
  { to: "/contact", label: "Contact" },
] as const;

const cats = [
  { label: "Crochet", slug: "crochet" },
  { label: "Paintings", slug: "paintings" },
  { label: "Flowers", slug: "flowers" },
  { label: "Accessories", slug: "accessories" },
  { label: "Rakhis", slug: "rakhis" },
  { label: "Custom Gifts", slug: "gifts" },
];

export const Footer = memo(function Footer() {
  const pathname = usePathname();

  // Hide public footer on admin dashboard pages
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    return null;
  }

  return (
    <footer className="mt-24 border-t border-border/70 bg-card/60">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-2xl text-ink">Shira&rsquo;s Strokes</p>
            <p className="font-hand mt-1 text-lg text-rose">Handmade with Love ♡</p>
            <BrushDivider className="mt-3" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Turning creativity into handmade happiness, one small piece at a time.
            </p>
          </div>

          <nav aria-label="Footer pages">
            <h2 className="eyebrow">Explore</h2>
            <ul className="mt-4 space-y-2.5">
              {pages.map((p) => (
                <li key={p.to}>
                  <Link
                    href={p.to}
                    prefetch={true}
                    className="text-sm text-foreground/80 transition-colors hover:text-primary"
                  >
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Footer categories">
            <h2 className="eyebrow">Categories</h2>
            <ul className="mt-4 space-y-2.5">
              {cats.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/shop?category=${c.slug}`}
                    prefetch={true}
                    className="text-sm text-foreground/80 transition-colors hover:text-primary"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="eyebrow">Say hello</h2>
            <ul className="mt-4 flex gap-3">
              <li>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="flex h-11 w-11 items-center justify-center rounded-full hairline bg-background text-ink transition-colors hover:bg-secondary"
                >
                  <Instagram className="h-4.5 w-4.5" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href={FACEBOOK_URL}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="flex h-11 w-11 items-center justify-center rounded-full hairline bg-background text-ink transition-colors hover:bg-secondary"
                >
                  <Facebook className="h-4.5 w-4.5" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp"
                  className="flex h-11 w-11 items-center justify-center rounded-full hairline bg-background text-ink transition-colors hover:bg-secondary"
                >
                  <MessageCircle className="h-4.5 w-4.5" aria-hidden="true" />
                </a>
              </li>
            </ul>
            <p className="mt-6 text-sm text-muted-foreground">Established in 2025</p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© 2026 Shira&rsquo;s Strokes. Crafted with love.</p>
          <div className="flex items-center gap-4">
            <Link
              href="/admin/login"
              prefetch={true}
              className="inline-flex items-center gap-1.5 text-muted-foreground/60 transition-colors hover:text-foreground"
            >
              <Lock className="h-3 w-3" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
});
