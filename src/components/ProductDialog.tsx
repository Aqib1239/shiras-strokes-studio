"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, X, MessageCircle, ShoppingBag } from "lucide-react";
import { useEffect, useState, memo } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";

import { formatPrice } from "@/lib/site-data";
import { getWhatsAppEnquiryUrl } from "@/lib/whatsapp";
import type { ProductData } from "@/lib/api";
import ImageWithLoader from "./ImageWithLoader";

export const ProductDialog = memo(function ProductDialog({
  product,
  allProducts = [],
  onClose,
  onSelect,
}: {
  product: ProductData | null;
  allProducts?: ProductData[];
  onClose: () => void;
  onSelect: (p: ProductData) => void;
}) {
  const [qty, setQty] = useState(1);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [mounted, setMounted] = useState(false);

  const prodId = product?._id || product?.id;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setQty(1);
    setActiveImageIdx(0);
  }, [prodId]);

  useEffect(() => {
    if (!product) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", onKey);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [product, onClose]);

  const imagesList = product
    ? (product.images && product.images.length > 0 ? product.images : [product.image]).filter(
        Boolean,
      )
    : [];

  const activeImage = imagesList[activeImageIdx] || product?.image || "/assets/cat-crafts.jpg";

  const related = product
    ? allProducts
        .filter((p) => p.category === product.category && (p._id || p.id) !== prodId)
        .slice(0, 3)
    : [];

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {product && (
        <motion.div
          className="
            fixed
            inset-0
            z-[9999]
            flex
            items-end
            justify-center
            bg-black/40
            backdrop-blur-sm

            md:items-center
            md:p-6
          "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* ================================================= */}
          {/* DESKTOP MODAL */}
          {/* ================================================= */}

          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{
              opacity: 0,
              scale: 0.96,
              y: 15,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.96,
              y: 10,
            }}
            transition={{
              duration: 0.22,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="
              hidden
              relative
              h-[90dvh]
              w-full
              max-w-4xl
              overflow-hidden
              rounded-3xl
              bg-card
              shadow-2xl

              md:flex
            "
          >
            {/* Desktop Close */}
            <CloseButton onClose={onClose} />

            <div className="grid h-full min-h-0 w-full md:grid-cols-2">
              {/* ============================= */}
              {/* DESKTOP IMAGE */}
              {/* ============================= */}

              <div className="flex h-full min-h-0 flex-col bg-secondary/30">
                <div className="relative min-h-0 flex-1 overflow-hidden">
                  <img
                    src={activeImage}
                    alt={product.name}
                    loading="eager"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>

                {imagesList.length > 1 && (
                  <ThumbnailList
                    images={imagesList}
                    activeImageIdx={activeImageIdx}
                    setActiveImageIdx={setActiveImageIdx}
                  />
                )}
              </div>

              {/* ============================= */}
              {/* DESKTOP RIGHT SIDE */}
              {/* ============================= */}

              <div className="flex h-full min-h-0 flex-col">
                {/* Fixed Header */}
                <div
                  className="
                    shrink-0
                    border-b
                    border-border/60
                    bg-card
                    px-6
                    pb-4
                    pt-6
                    sm:px-8
                    sm:pt-8
                  "
                >
                  <p className="eyebrow">{product.categoryLabel || product.category}</p>

                  <h2 className="mt-1 pr-12 font-display text-3xl font-semibold leading-tight text-ink">
                    {product.name}
                  </h2>
                </div>

                {/* ONLY RIGHT SIDE SCROLLS */}
                <div
                  className="
                    min-h-0
                    flex-1
                    overflow-y-auto
                    overscroll-contain
                    px-6
                    py-5
                    sm:px-8
                    sm:py-6
                  "
                >
                  <ProductContent
                    product={product}
                    qty={qty}
                    setQty={setQty}
                    related={related}
                    onSelect={onSelect}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* ================================================= */}
          {/* ================================================= */}
          {/* MOBILE BOTTOM SHEET */}
          {/* ================================================= */}

          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 32,
              mass: 0.8,
            }}
            className="
    relative
    flex
    max-h-[94dvh]
    w-full
    flex-col
    overflow-hidden
    rounded-t-[28px]
    bg-card
    shadow-2xl
    md:hidden
  "
          >
            {/* ============================================= */}
            {/* MOBILE CLOSE BUTTON */}
            {/* ============================================= */}

            <CloseButton onClose={onClose} />

            {/* ============================================= */}
            {/* SINGLE SCROLL CONTAINER */}
            {/* ============================================= */}

            <div
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain
    "
            >
              {/* =========================================== */}
              {/* PRODUCT IMAGE */}
              {/* =========================================== */}

              <div
                className="
        relative
        h-[45dvh]
        min-h-[280px]
        max-h-[440px]
        w-full
        shrink-0
        overflow-hidden
        bg-secondary/30
      "
              >
                <ImageWithLoader
                  src={activeImage}
                  alt={product.name}
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="h-full w-full object-cover"
                />

                {/* Image gradient */}
                <div
                  className="
          pointer-events-none
          absolute
          inset-x-0
          bottom-0
          h-40
          bg-gradient-to-t
          from-black/50
          via-black/10
          to-transparent
        "
                />

                {/* Drag handle */}
                <div
                  className="
          absolute
          left-1/2
          top-3
          h-2
          w-12
          -translate-x-1/2
          rounded-full
          bg-blue-200
        "
                />
              </div>

              {/* =========================================== */}
              {/* OVERLAPPING CONTENT */}
              {/* =========================================== */}

              <div
                className="
        relative
        z-20
        -mt-8
        min-h-[60dvh]
        rounded-t-[28px]
        bg-card
      "
              >
                {/* ========================================= */}
                {/* PRODUCT HEADER */}
                {/* ========================================= */}

                <div
                  className="
          sticky
          top-0
          z-30
          border-b
          border-border/60
          bg-card/95
          px-5
          pb-4
          pt-5
          backdrop-blur-xl
        "
                >
                  <p className="eyebrow">{product.categoryLabel || product.category}</p>

                  <h2
                    className="
            mt-1
            pr-12
            font-display
            text-2xl
            font-semibold
            leading-tight
            text-ink
          "
                  >
                    {product.name}
                  </h2>
                </div>

                {/* ========================================= */}
                {/* PRODUCT DETAILS */}
                {/* ========================================= */}

                <div className="px-5 py-5">
                  <ProductContent
                    product={product}
                    qty={qty}
                    setQty={setQty}
                    related={related}
                    onSelect={onSelect}
                  />

                  <div className="h-8" />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
});

/* ========================================================= */
/* CLOSE BUTTON */
/* ========================================================= */

function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      type="button"
      onClick={onClose}
      aria-label="Close product details"
      className="
        absolute
        right-3
        top-3
        z-[100]
        flex
        h-10
        w-10
        items-center
        justify-center
        rounded-full
        bg-gray-100
        text-ink
        shadow-md
        backdrop-blur
        transition
        hover:bg-background
        active:scale-95

        sm:right-4
        sm:top-4
      "
    >
      <X className="hover:rotate-90 transition duration-300 h-[18px] w-[18px]" />
    </button>
  );
}

/* ========================================================= */
/* THUMBNAILS */
/* ========================================================= */

function ThumbnailList({
  images,
  activeImageIdx,
  setActiveImageIdx,
}: {
  images: string[];
  activeImageIdx: number;
  setActiveImageIdx: (idx: number) => void;
}) {
  return (
    <div className="flex shrink-0 gap-2 overflow-x-auto border-t border-border/50 bg-card/90 p-3">
      {images.map((img, idx) => (
        <button
          key={idx}
          type="button"
          onClick={() => setActiveImageIdx(idx)}
          className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
            activeImageIdx === idx
              ? "scale-105 border-primary"
              : "border-transparent opacity-70 hover:opacity-100"
          }`}
        >
          <img
            src={img}
            alt={`Product thumbnail ${idx + 1}`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </button>
      ))}
    </div>
  );
}

/* ========================================================= */
/* PRODUCT CONTENT */
/* ========================================================= */

function ProductContent({
  product,
  qty,
  setQty,
  related,
  onSelect,
}: {
  product: ProductData;
  qty: number;
  setQty: React.Dispatch<React.SetStateAction<number>>;
  related: ProductData[];
  onSelect: (p: ProductData) => void;
}) {
  return (
    <div className="space-y-5">
      {/* Description */}
      <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>

      {/* Price */}
      <p className="font-display text-2xl font-semibold text-ink">{formatPrice(product.price)}</p>

      {/* Product Information */}
      <dl className="space-y-2 rounded-2xl bg-secondary/60 p-4 text-sm">
        <div className="flex gap-2">
          <dt className="min-w-24 text-muted-foreground">Materials</dt>

          <dd className="font-medium text-foreground">
            {product.materials || "Artisan materials"}
          </dd>
        </div>

        <div className="flex gap-2">
          <dt className="min-w-24 text-muted-foreground">Crafted</dt>

          <dd className="text-foreground">Entirely by hand, in small batches</dd>
        </div>

        <div className="flex gap-2">
          <dt className="min-w-24 text-muted-foreground">Custom</dt>

          <dd className="text-foreground">
            {product.customisable
              ? "Colours, size and personalised notes available"
              : "Available as shown"}
          </dd>
        </div>
      </dl>

      {/* Quantity */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">Quantity</span>

        <div className="flex items-center gap-1 rounded-full hairline bg-background p-1">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              hover:bg-secondary
              active:scale-95
            "
          >
            <Minus className="h-4 w-4" />
          </button>

          <span className="w-8 text-center text-sm font-medium" aria-live="polite">
            {qty}
          </span>

          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQty((q) => q + 1)}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              hover:bg-secondary
              active:scale-95
            "
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2.5">
        <button
          type="button"
          onClick={() =>
            toast.success("Added to your basket", {
              description: `${qty} × ${product.name}`,
            })
          }
          className="
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-full
            bg-primary
            px-5
            py-3.5
            text-sm
            font-medium
            text-primary-foreground
            shadow-sm
            transition-transform
            hover:scale-[1.02]
            active:scale-95
          "
        >
          <ShoppingBag className="h-4 w-4" />
          Add to Cart
        </button>

        <a
          href={getWhatsAppEnquiryUrl(product.name, product.price)}
          target="_blank"
          rel="noreferrer"
          className="
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-full
            border
            border-primary/30
            bg-card
            px-5
            py-3.5
            text-center
            text-sm
            font-medium
            text-primary
            transition-colors
            hover:bg-secondary
            active:scale-95
          "
        >
          <MessageCircle className="h-4 w-4 text-[#25D366]" />
          Enquire on WhatsApp
        </a>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="border-t border-border/60 pt-5">
          <h3 className="eyebrow">You may also love</h3>

          <ul className="mt-3 flex gap-3 overflow-x-auto pb-2">
            {related.map((r) => (
              <li key={r._id || r.id} className="shrink-0">
                <button type="button" onClick={() => onSelect(r)} className="group w-32 text-left">
                  <div className="h-24 w-32 overflow-hidden rounded-xl bg-secondary/30">
                    <img
                      src={r.image || (r.images && r.images[0]) || "/assets/cat-crafts.jpg"}
                      alt={r.name}
                      loading="lazy"
                      decoding="async"
                      className="
                        h-full
                        w-full
                        object-cover
                        transition-transform
                        group-hover:scale-105
                      "
                    />
                  </div>

                  <span className="mt-1.5 block truncate text-xs font-medium leading-snug text-ink">
                    {r.name}
                  </span>

                  <span className="block text-[0.7rem] text-muted-foreground">
                    {formatPrice(r.price)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
