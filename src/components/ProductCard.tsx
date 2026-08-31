"use client";

import React, { memo } from "react";
import { Heart } from "lucide-react";
import { formatPrice } from "@/lib/site-data";
import type { ProductData } from "@/lib/api";
import ImageWithLoader from "./ImageWithLoader";

interface ProductCardProps {
  product: ProductData;
  onOpen: (p: ProductData) => void;
  wishlisted?: boolean;
  onWishlist?: (id: string) => void;
}

export const ProductCard = memo(function ProductCard({
  product,
  onOpen,
  wishlisted,
  onWishlist,
}: ProductCardProps) {
  const prodId = product._id || product.id || "";
  const imageUrl =
    product.image || (product.images && product.images[0]) || "/assets/cat-crafts.jpg";

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl hairline bg-card paper transition-shadow duration-300 hover:shadow-md">
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary/30">
        <ImageWithLoader
          src={imageUrl}
          alt={product.name}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="transition-transform duration-500 ease-out group-hover:scale-105 will-change-transform"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5 pointer-events-none">
          <span className="rounded-full bg-background/85 px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.14em] text-ink backdrop-blur">
            Handmade
          </span>
          {product.customisable && (
            <span className="rounded-full bg-accent/90 px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.14em] text-accent-foreground backdrop-blur">
              Customisable
            </span>
          )}
        </div>
        {onWishlist && prodId && (
          <button
            type="button"
            onClick={() => onWishlist(prodId)}
            aria-pressed={!!wishlisted}
            aria-label={`${wishlisted ? "Remove" : "Add"} ${product.name} ${
              wishlisted ? "from" : "to"
            } wishlist`}
            className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-background/85 text-ink backdrop-blur transition-transform hover:scale-110 active:scale-95"
          >
            <Heart
              className={`h-4.5 w-4.5 transition-colors ${wishlisted ? "fill-rose text-rose" : ""}`}
              aria-hidden="true"
            />
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="eyebrow">{product.categoryLabel || product.category}</p>
        <h3 className="font-display text-xl leading-snug text-ink">{product.name}</h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {product.description}
        </p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <span className="font-display text-lg text-ink font-semibold">
            {formatPrice(product.price)}
          </span>
          <button
            type="button"
            onClick={() => onOpen(product)}
            className="rounded-full border border-primary/30 px-4 py-2.5 text-sm text-primary font-medium transition-colors hover:bg-primary hover:text-primary-foreground active:scale-95"
          >
            View Product
          </button>
        </div>
      </div>
    </article>
  );
});
