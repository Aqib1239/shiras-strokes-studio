"use client";

import { X, Loader2 } from "lucide-react";
import { ImageUploader } from "./ImageUploader";

type ProductForm = {
  images: string[];
  setImages: (images: string[]) => void;

  name: string;
  setName: (value: string) => void;

  category: string;
  setCategory: (value: string) => void;

  price: number | "";
  setPrice: (value: number | "") => void;

  materials: string;
  setMaterials: (value: string) => void;

  description: string;
  setDescription: (value: string) => void;

  isActive: boolean;
  setIsActive: (value: boolean) => void;

  featured: boolean;
  setFeatured: (value: boolean) => void;

  customisable: boolean;
  setCustomisable: (value: boolean) => void;

  handmade: boolean;
  setHandmade: (value: boolean) => void;
};

type ProductFormModalProps = {
  isModalOpen: boolean;
  onClose: () => void;
  editingProduct: any | null;

  form: ProductForm;

  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  submitting: boolean;
};

const categoriesList = [
  { slug: "crochet", label: "Crochet Creations" },
  { slug: "paintings", label: "Paintings & Artworks" },
  { slug: "flowers", label: "Flowers & Bouquets" },
  { slug: "accessories", label: "Earrings & Accessories" },
  { slug: "rakhis", label: "Rakhis & Rakhi Gifts" },
  { slug: "pipe-cleaner", label: "Pipe Cleaner Crafts" },
  { slug: "gifts", label: "Customised Gifts" },
  { slug: "custom", label: "Creative Art & Crafts" },
];

export default function ProductFormModal({
  isModalOpen,
  onClose,
  editingProduct,
  form,
  onSubmit,
  submitting,
}: ProductFormModalProps) {
  if (!isModalOpen) return null;

  return (
    <div
      className="
        fixed inset-0 z-[100]
        flex items-end justify-center
        bg-black/30
        backdrop-blur-sm
        sm:items-center sm:p-4
      "
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="
          relative
          flex w-full max-w-2xl flex-col
          overflow-hidden
          rounded-t-3xl sm:rounded-3xl
          bg-card
          hairline
          shadow-2xl

          max-h-[92dvh]
          sm:max-h-[90dvh]

          animate-in
          slide-in-from-bottom
          duration-300

          sm:zoom-in-95
          sm:slide-in-from-bottom-0
        "
      >
        {/* =====================================================
            HEADER
        ====================================================== */}
        <div
          className="
            relative z-20
            shrink-0
            border-b border-border/60
            bg-card/95
            px-5 py-4
            backdrop-blur-md
            sm:px-8 sm:py-5
          "
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close product modal"
            className="
              absolute right-4 top-4
              flex h-9 w-9
              items-center justify-center
              rounded-full
              text-ink
              transition
              hover:bg-secondary
              active:scale-95
            "
          >
            <X className="h-5 w-5 transition-transform duration-300 hover:rotate-90" />
          </button>

          <h2
            id="product-modal-title"
            className="
              pr-12
              font-display
              text-2xl
              text-ink
              sm:text-3xl
            "
          >
            {editingProduct ? "Edit Product" : "Add New Creation"}
          </h2>

          <p className="mt-1 pr-12 text-xs text-muted-foreground">
            {editingProduct
              ? "Update the details of your creation."
              : "Fill in the details below to add a new creation."}
          </p>
        </div>

        {/* =====================================================
            SCROLLABLE CONTENT
        ====================================================== */}
        <div
          className="
            min-h-0
            flex-1
            overflow-y-auto
            overscroll-contain
            scrollbar-thin
          "
        >
          <form onSubmit={onSubmit} className="space-y-5 p-5 sm:p-8">
            {/* =================================================
                IMAGES
            ================================================== */}
            <ImageUploader images={form.images} onChange={form.setImages} maxImages={6} />

            {/* =================================================
                NAME + CATEGORY
            ================================================== */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-ink">Product Name *</label>

                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => form.setName(e.target.value)}
                  placeholder="e.g. Crochet Blossom Bouquet"
                  className="
                    w-full
                    rounded-2xl
                    hairline
                    bg-background
                    px-4 py-2.5
                    text-xs
                    text-foreground
                    outline-none
                    transition
                    focus:ring-2
                    focus:ring-primary/20
                  "
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-ink">Category *</label>

                <select
                  required
                  value={form.category}
                  onChange={(e) => form.setCategory(e.target.value)}
                  className="
                    w-full
                    rounded-2xl
                    hairline
                    bg-background
                    px-4 py-2.5
                    text-xs
                    text-foreground
                    outline-none
                    transition
                    focus:ring-2
                    focus:ring-primary/20
                  "
                >
                  {categoriesList.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* =================================================
                PRICE + MATERIALS
            ================================================== */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-ink">Price (₹) *</label>

                <input
                  type="number"
                  required
                  min={0}
                  value={form.price}
                  onChange={(e) =>
                    form.setPrice(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  placeholder="990"
                  className="
                    w-full
                    rounded-2xl
                    hairline
                    bg-background
                    px-4 py-2.5
                    text-xs
                    text-foreground
                    outline-none
                    transition
                    focus:ring-2
                    focus:ring-primary/20
                  "
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-ink">
                  Materials / Details
                </label>

                <input
                  type="text"
                  value={form.materials}
                  onChange={(e) => form.setMaterials(e.target.value)}
                  placeholder="e.g. Cotton yarn, floral wire, kraft wrap"
                  className="
                    w-full
                    rounded-2xl
                    hairline
                    bg-background
                    px-4 py-2.5
                    text-xs
                    text-foreground
                    outline-none
                    transition
                    focus:ring-2
                    focus:ring-primary/20
                  "
                />
              </div>
            </div>

            {/* =================================================
                DESCRIPTION
            ================================================== */}
            <div>
              <label className="mb-1 block text-xs font-medium text-ink">Description *</label>

              <textarea
                required
                rows={4}
                value={form.description}
                onChange={(e) => form.setDescription(e.target.value)}
                placeholder="Describe the texture, feel, and artistry of this piece..."
                className="
                  w-full
                  resize-none
                  rounded-2xl
                  hairline
                  bg-background
                  px-4 py-2.5
                  text-xs
                  text-foreground
                  outline-none
                  transition
                  focus:ring-2
                  focus:ring-primary/20
                "
              />
            </div>

            {/* =================================================
                TOGGLES
            ================================================== */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* Active */}
              <label
                className="
                  flex cursor-pointer
                  items-center gap-2
                  rounded-2xl
                  hairline
                  bg-background
                  p-3
                  transition
                  hover:bg-secondary/40
                "
              >
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => form.setIsActive(e.target.checked)}
                  className="rounded text-primary focus:ring-rose"
                />

                <span className="text-xs font-medium text-ink">Active (In Shop)</span>
              </label>

              {/* Featured */}
              <label
                className="
                  flex cursor-pointer
                  items-center gap-2
                  rounded-2xl
                  hairline
                  bg-background
                  p-3
                  transition
                  hover:bg-secondary/40
                "
              >
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => form.setFeatured(e.target.checked)}
                  className="rounded text-primary focus:ring-rose"
                />

                <span className="text-xs font-medium text-ink">Featured</span>
              </label>

              {/* Customisable */}
              <label
                className="
                  flex cursor-pointer
                  items-center gap-2
                  rounded-2xl
                  hairline
                  bg-background
                  p-3
                  transition
                  hover:bg-secondary/40
                "
              >
                <input
                  type="checkbox"
                  checked={form.customisable}
                  onChange={(e) => form.setCustomisable(e.target.checked)}
                  className="rounded text-primary focus:ring-rose"
                />

                <span className="text-xs font-medium text-ink">Customisable</span>
              </label>

              {/* Handmade */}
              <label
                className="
                  flex cursor-pointer
                  items-center gap-2
                  rounded-2xl
                  hairline
                  bg-background
                  p-3
                  transition
                  hover:bg-secondary/40
                "
              >
                <input
                  type="checkbox"
                  checked={form.handmade}
                  onChange={(e) => form.setHandmade(e.target.checked)}
                  className="rounded text-primary focus:ring-rose"
                />

                <span className="text-xs font-medium text-ink">100% Handmade</span>
              </label>
            </div>

            {/* =================================================
                FOOTER
            ================================================== */}
            <div
              className="
                sticky bottom-0
                -mx-5 -mb-5
                flex
                justify-end
                gap-3
                border-t
                border-border/60
                bg-card/95
                p-5
                backdrop-blur-md
                sm:-mx-8 sm:-mb-8 sm:p-6
              "
            >
              <button
                type="button"
                onClick={onClose}
                className="
                  rounded-full
                  border
                  border-border
                  px-5 py-2.5
                  text-xs
                  text-muted-foreground
                  transition
                  hover:bg-secondary
                  active:scale-95
                "
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  bg-primary
                  px-6 py-2.5
                  text-xs
                  font-medium
                  text-primary-foreground
                  shadow-sm
                  transition
                  hover:scale-[1.02]
                  active:scale-95
                  disabled:pointer-events-none
                  disabled:opacity-70
                "
              >
                {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}

                <span>{editingProduct ? "Save Changes" : "Create Product"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
