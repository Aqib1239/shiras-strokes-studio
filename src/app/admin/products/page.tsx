"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { api, type ProductData } from "@/lib/api";
import { formatPrice, shopFilters } from "@/lib/site-data";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Check,
  X,
  Sparkles,
  Loader2,
  Package,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import ProductFormModal from "@/components/admin/ProductFormModal";

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

function AdminProductsContent() {
  const searchParams = useSearchParams();
  const initialAction = searchParams.get("action");

  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");

  // Form / Modal states
  const [isModalOpen, setIsModalOpen] = useState(initialAction === "new");
  const [editingProduct, setEditingProduct] = useState<ProductData | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [category, setCategory] = useState("crochet");
  const [price, setPrice] = useState<number | "">(990);
  const [description, setDescription] = useState("");
  const [materials, setMaterials] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [customisable, setCustomisable] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [handmade, setHandmade] = useState(true);
  const [isActive, setIsActive] = useState(true);

  const productForm = {
    images,
    setImages,
    name,
    setName,
    category,
    setCategory,
    price,
    setPrice,
    materials,
    setMaterials,
    description,
    setDescription,
    isActive,
    setIsActive,
    featured,
    setFeatured,
    customisable,
    setCustomisable,
    handmade,
    setHandmade,
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.getProducts({ includeInactive: true });
      if (res.success && res.data) {
        setProducts(res.data);
      }
    } catch (err: any) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setName("");
    setCategory("crochet");
    setPrice(990);
    setDescription("");
    setMaterials("");
    setImages([]);
    setCustomisable(true);
    setFeatured(false);
    setHandmade(true);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (p: ProductData) => {
    setEditingProduct(p);
    setName(p.name);
    setCategory(p.category);
    setPrice(p.price);
    setDescription(p.description);
    setMaterials(p.materials || "");
    const imgList = p.images && p.images.length > 0 ? p.images : p.image ? [p.image] : [];
    setImages(imgList);
    setCustomisable(p.customisable !== undefined ? p.customisable : true);
    setFeatured(Boolean(p.featured));
    setHandmade(p.handmade !== undefined ? p.handmade : true);
    setIsActive(p.isActive !== undefined ? p.isActive : true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !category || price === "" || !description.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (images.length === 0) {
      toast.error("Please provide at least one product image.");
      return;
    }

    setSubmitting(true);
    try {
      const payload: Partial<ProductData> = {
        name: name.trim(),
        category,
        categoryLabel:
          categoriesList.find((c) => c.slug === category)?.label || "Handmade Creation",
        price: Number(price),
        description: description.trim(),
        materials: materials.trim() || "Artisan handcrafted materials",
        image: images[0],
        images,
        customisable,
        featured,
        handmade,
        isActive,
      };

      if (editingProduct && editingProduct._id) {
        await api.updateProduct(editingProduct._id, payload);
        toast.success("Product updated successfully!");
      } else {
        await api.createProduct(payload);
        toast.success("Product added to catalog!");
      }

      closeModal();
      fetchProducts();
    } catch (err: any) {
      toast.error(err.message || "Failed to save product");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (p: ProductData, field: "isActive" | "featured") => {
    const id = p._id || p.id;
    if (!id) return;
    try {
      const updatedValue = !p[field];
      await api.updateProduct(id, { [field]: updatedValue });
      setProducts((prev) =>
        prev.map((item) =>
          (item._id || item.id) === id ? { ...item, [field]: updatedValue } : item,
        ),
      );
      toast.success(
        field === "isActive"
          ? updatedValue
            ? "Product is now Active in store"
            : "Product disabled in store"
          : updatedValue
          ? "Marked as Featured"
          : "Removed from Featured",
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await api.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => (p._id || p.id) !== id));
      toast.success("Product deleted successfully");
      setDeletingId(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete product");
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory = filterCat === "all" || p.category === filterCat;
    const matchesSearch =
      !search.trim() ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <AdminLayout
      title="Product Management"
      subtitle="Add, edit, organise, and feature handmade creations."
      action={
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-medium text-primary-foreground hover:scale-[1.02] active:scale-95 transition-transform shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Add Product</span>
        </button>
      }
    >
      <div className="space-y-6">
        {/* Controls: Search and Category Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl hairline bg-card pl-10 pr-4 py-2.5 text-xs text-foreground focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              Filter Category:
            </span>
            <select
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value)}
              className="rounded-2xl hairline bg-card px-3 py-2 text-xs text-foreground focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categoriesList.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

               {/* Product Table / Cards */}
               {loading ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 rounded-2xl bg-secondary/50" />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <>
            {/* MOBILE: Card layout (below md) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
              {filteredProducts.map((p) => {
                const pid = p._id || p.id || "";
                return (
                  <div
                    key={pid}
                    className="rounded-3xl hairline bg-card paper p-4 flex flex-col gap-3"
                  >
                    {/* Image + Name/Description */}
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image || (p.images && p.images[0]) || "/assets/cat-crafts.jpg"}
                        alt={p.name}
                        className="h-14 w-14 rounded-xl object-cover shrink-0 bg-secondary/30"
                      />
                      <div className="min-w-0">
                        <p className="font-medium text-sm text-ink truncate">{p.name}</p>
                        <p className="text-[0.7rem] text-muted-foreground line-clamp-1">
                          {p.description}
                        </p>
                      </div>
                    </div>

                    {/* Category + Price */}
                    <div className="flex items-center justify-between">
                      <span className="capitalize px-2.5 py-1 rounded-full bg-secondary text-ink text-[0.7rem]">
                        {p.category}
                      </span>
                      <span className="font-display font-semibold text-sm text-ink">
                        {formatPrice(p.price)}
                      </span>
                    </div>

                    {/* Status + Featured */}
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(p, "isActive")}
                        className={`px-3 py-1 rounded-full text-[0.65rem] font-medium transition-all ${
                          p.isActive
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {p.isActive ? "Active" : "Disabled"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleStatus(p, "featured")}
                        className={`p-1.5 rounded-full transition-all ${
                          p.featured
                            ? "bg-champagne/30 text-amber-800"
                            : "text-border hover:text-muted-foreground"
                        }`}
                        title={p.featured ? "Featured on Home" : "Not featured"}
                      >
                        <Sparkles
                          className={`h-4 w-4 ${
                            p.featured ? "fill-champagne text-champagne" : ""
                          }`}
                        />
                      </button>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 pt-1 border-t border-border/60">
                      <button
                        type="button"
                        onClick={() => openEditModal(p)}
                        className="p-2 rounded-xl hover:bg-secondary text-ink transition-colors"
                        title="Edit product"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingId(pid)}
                        className="p-2 rounded-xl hover:bg-destructive/10 text-destructive transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* DESKTOP: Table layout (md and up) */}
            <div className="hidden md:block rounded-3xl hairline bg-card paper overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-secondary/60 text-muted-foreground uppercase text-[0.65rem] tracking-wider border-b border-border/70">
                    <tr>
                      <th className="px-6 py-4">Product</th>
                      <th className="px-4 py-4">Category</th>
                      <th className="px-4 py-4">Price</th>
                      <th className="px-4 py-4 text-center">Status</th>
                      <th className="px-4 py-4 text-center">Featured</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filteredProducts.map((p) => {
                      const pid = p._id || p.id || "";
                      return (
                        <tr key={pid} className="hover:bg-secondary/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.image || (p.images && p.images[0]) || "/assets/cat-crafts.jpg"}
                                alt={p.name}
                                className="h-12 w-12 rounded-xl object-cover shrink-0 bg-secondary/30"
                              />
                              <div className="min-w-0">
                                <p className="font-medium text-sm text-ink truncate max-w-xs">
                                  {p.name}
                                </p>
                                <p className="text-[0.7rem] text-muted-foreground line-clamp-1">
                                  {p.description}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="capitalize px-2.5 py-1 rounded-full bg-secondary text-ink text-[0.7rem]">
                              {p.category}
                            </span>
                          </td>
                          <td className="px-4 py-4 font-display font-semibold text-sm text-ink">
                            {formatPrice(p.price)}
                          </td>
                          <td className="px-4 py-4 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(p, "isActive")}
                              className={`px-3 py-1 rounded-full text-[0.65rem] font-medium transition-all ${
                                p.isActive
                                  ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                            >
                              {p.isActive ? "Active" : "Disabled"}
                            </button>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(p, "featured")}
                              className={`p-1.5 rounded-full transition-all ${
                                p.featured
                                  ? "bg-champagne/30 text-amber-800"
                                  : "text-border hover:text-muted-foreground"
                              }`}
                              title={p.featured ? "Featured on Home" : "Not featured"}
                            >
                              <Sparkles
                                className={`h-4 w-4 ${
                                  p.featured ? "fill-champagne text-champagne" : ""
                                }`}
                              />
                            </button>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => openEditModal(p)}
                                className="p-2 rounded-xl hover:bg-secondary text-ink transition-colors"
                                title="Edit product"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingId(pid)}
                                className="p-2 rounded-xl hover:bg-destructive/10 text-destructive transition-colors"
                                title="Delete product"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="rounded-3xl hairline bg-card p-12 text-center paper">
            <Package className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="font-display text-xl text-ink">No products found</p>
            <p className="text-xs text-muted-foreground mt-1">
              {search || filterCat !== "all"
                ? "Try adjusting your search query or category filter."
                : "Your studio catalog is empty. Add your first creation!"}
            </p>
            <button
              type="button"
              onClick={openAddModal}
              className="mt-4 rounded-full bg-primary px-5 py-2.5 text-xs font-medium text-primary-foreground"
            >
              Add First Product
            </button>
          </div>
        )}

      {/* ADD / EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <ProductFormModal
          isModalOpen={isModalOpen}
          onClose={closeModal}
          editingProduct={editingProduct}
          form={productForm}
          onSubmit={handleSaveProduct}
          submitting={submitting}
        />
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-brightness-50 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-card p-6 hairline shadow-xl text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-3">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="font-display text-xl text-ink">Delete this creation?</h3>
            <p className="text-xs text-muted-foreground mt-1">
              This action cannot be undone. This product will be removed from your catalog.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="rounded-full border border-border px-4 py-2 text-xs text-muted-foreground hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteProduct(deletingId)}
                className="rounded-full bg-destructive px-5 py-2 text-xs font-medium text-white hover:bg-destructive/90"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-3" />
            {/* Fluent-style dot ring spinner */}
            <div className="relative h-14 w-14">
              {Array.from({ length: 8 }).map((_, i) => (
                <span
                  key={i}
                  className="absolute left-1/2 top-1/2 -ml-[5px] -mt-[5px] h-[10px] w-[10px] rounded-full"
                  style={{
                    transform: `rotate(${i * 45}deg) translateY(-22px)`,
                  }}
                >
                  <span
                    className="block h-full w-full rounded-full bg-primary animate-[fluent-pulse_1.2s_ease-in-out_infinite]"
                    style={{
                      animationDelay: `${i * 0.15}s`,
                    }}
                  />
                </span>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <AdminProductsContent />
    </Suspense>
  );
}
