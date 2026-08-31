"use client";

import { useMemo, useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { ProductDialog } from "@/components/ProductDialog";
import { PageTransition, Reveal } from "@/components/motion-primitives";
import { BrushDivider } from "@/components/Decor";
import { shopFilters, products as fallbackProducts } from "@/lib/site-data";
import { api, type ProductData } from "@/lib/api";

const sorts = [
  { id: "featured", label: "Featured" },
  { id: "newest", label: "Newest" },
  { id: "low", label: "Price: Low to High" },
  { id: "high", label: "Price: High to Low" },
] as const;

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [productsList, setProductsList] = useState<ProductData[]>(fallbackProducts as any);
  const [filter, setFilter] = useState(categoryParam || "all");
  const [sort, setSort] = useState<string>("featured");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ProductData | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    if (categoryParam) {
      setFilter(categoryParam);
    }
  }, [categoryParam]);

  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      try {
        const res = await api.getProducts({ includeInactive: false });
        if (isMounted && res.success && res.data && res.data.length > 0) {
          setProductsList(res.data);
        }
      } catch (err) {
        // Fallback already displayed instantly
      }
    };

    fetchProducts();

    try {
      const saved = localStorage.getItem("shiras_wishlist");
      if (saved) setWishlist(JSON.parse(saved));
    } catch {}

    return () => {
      isMounted = false;
    };
  }, []);

  const visible = useMemo(() => {
    let list = productsList.filter((p) => filter === "all" || p.category === filter);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.materials && p.materials.toLowerCase().includes(q))
      );
    }

    const sorted = [...list];
    if (sort === "newest") {
      sorted.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return (b.newest || dateB) - (a.newest || dateA);
      });
    }
    if (sort === "low") sorted.sort((a, b) => a.price - b.price);
    if (sort === "high") sorted.sort((a, b) => b.price - a.price);
    if (sort === "featured") {
      sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
    }
    return sorted;
  }, [productsList, filter, sort, search]);

  const toggleWish = (id: string) => {
    setWishlist((prev) => {
      const updated = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        localStorage.setItem("shiras_wishlist", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  return (
    <PageTransition>
      <div className="mx-auto w-full max-w-6xl px-4 pb-8 pt-12 sm:px-6 sm:pt-16">
        <Reveal className="text-center">
          <p className="eyebrow">The Collection</p>
          <h1 className="mt-3 font-display text-4xl leading-tight sm:text-6xl text-ink">
            Shop Handmade
          </h1>
          <div className="mt-4 flex justify-center">
            <BrushDivider />
          </div>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            Discover creations made slowly, thoughtfully, and with love.
          </p>
        </Reveal>

        {/* Category Filters */}
        <div className="mt-10 -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div
            role="tablist"
            aria-label="Product categories"
            className="flex w-max gap-2 pb-1 sm:w-full sm:flex-wrap sm:justify-center"
          >
            {shopFilters.map((f) => {
              const active = filter === f.slug;
              return (
                <button
                  key={f.slug}
                  role="tab"
                  aria-selected={active}
                  type="button"
                  onClick={() => setFilter(f.slug)}
                  className={`relative shrink-0 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "text-primary-foreground"
                      : "hairline bg-card text-foreground/75 hover:bg-secondary"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="shop-filter"
                      className="absolute inset-0 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative">{f.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search, Count and Sort */}
        <div className="mt-8 flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search handmade creations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full hairline bg-card pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between gap-4 sm:justify-end">
            <p className="text-sm text-muted-foreground" aria-live="polite">
              {visible.length} creation{visible.length === 1 ? "" : "s"}
            </p>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              Sort by
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-full hairline bg-card px-4 py-2 text-sm text-foreground focus:outline-none"
              >
                {sorts.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {/* Products Grid */}
        {visible.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((p) => {
              const pid = p._id || p.id || "";
              return (
                <ProductCard
                  key={pid}
                  product={p}
                  onOpen={setSelected}
                  wishlisted={wishlist.includes(pid)}
                  onWishlist={toggleWish}
                />
              );
            })}
          </div>
        ) : (
          <div className="mt-16 text-center py-12 rounded-3xl hairline bg-card paper">
            <p className="font-hand text-2xl text-rose">No creations found</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try adjusting your category or search keywords.
            </p>
            <button
              onClick={() => {
                setFilter("all");
                setSearch("");
              }}
              className="mt-5 rounded-full bg-primary px-5 py-2.5 text-xs font-medium text-primary-foreground"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      <ProductDialog
        product={selected}
        allProducts={productsList}
        onClose={() => setSelected(null)}
        onSelect={(p) => setSelected(p)}
      />
    </PageTransition>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center bg-background">
          <p className="font-display text-lg text-ink">Loading Shop Collection...</p>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
