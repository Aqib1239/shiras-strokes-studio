"use client";

import { useEffect, useRef, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { api, type ReviewData } from "@/lib/api";
import {
  Plus,
  Star,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Sparkles,
  Loader2,
  MessageSquareHeart,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { toast } from "sonner";

// Drawer height bounds (as vh) for the mobile bottom-sheet resize handle
const MIN_DRAWER_VH = 40;
const MAX_DRAWER_VH = 92;
const DEFAULT_DRAWER_VH = 75;

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal / Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); // drives the slide-up transition
  const [editingReview, setEditingReview] = useState<ReviewData | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Resizable mobile drawer height (in vh)
  const [drawerHeight, setDrawerHeight] = useState(DEFAULT_DRAWER_VH);
  const dragState = useRef<{ startY: number; startHeight: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [occasion, setOccasion] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [photo, setPhoto] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await api.getReviews({ includeUnpublished: true });
      if (res.success && res.data) {
        setReviews(res.data);
      }
    } catch (err: any) {
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Drive the slide-up / fade-in transition once the modal mounts, and
  // reset the drawer to its default height each time it opens.
  useEffect(() => {
    if (isModalOpen) {
      setDrawerHeight(DEFAULT_DRAWER_VH);
      const raf = requestAnimationFrame(() => setIsModalVisible(true));
      return () => cancelAnimationFrame(raf);
    }
    setIsModalVisible(false);
  }, [isModalOpen]);

  // Prevent background scroll while the drawer/modal is open
  useEffect(() => {
    if (isModalOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isModalOpen]);

  const openAddModal = () => {
    setEditingReview(null);
    setName("");
    setOccasion("");
    setRating(5);
    setText("");
    setPhoto("");
    setIsPublished(true);
    setIsFeatured(false);
    setIsModalOpen(true);
  };

  const openEditModal = (r: ReviewData) => {
    setEditingReview(r);
    setName(r.name);
    setOccasion(r.occasion || "");
    setRating(r.rating);
    setText(r.text);
    setPhoto(r.photo || "");
    setIsPublished(r.isPublished !== undefined ? r.isPublished : true);
    setIsFeatured(Boolean(r.isFeatured));
    setIsModalOpen(true);
  };

  const closeModal = () => {
    // Play the slide-down animation, then unmount
    setIsModalVisible(false);
    window.setTimeout(() => {
      setIsModalOpen(false);
      setEditingReview(null);
    }, 250);
  };

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) {
      toast.error("Customer name and review text are required.");
      return;
    }

    setSubmitting(true);
    try {
      const payload: Partial<ReviewData> = {
        name: name.trim(),
        occasion: occasion.trim(),
        rating: Number(rating),
        text: text.trim(),
        photo: photo.trim(),
        isPublished,
        isFeatured,
      };

      if (editingReview && editingReview._id) {
        await api.updateReview(editingReview._id, payload);
        toast.success("Review updated successfully!");
      } else {
        await api.createReview(payload);
        toast.success("Review recorded from WhatsApp!");
      }

      closeModal();
      fetchReviews();
    } catch (err: any) {
      toast.error(err.message || "Failed to save review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePublish = async (r: ReviewData) => {
    const id = r._id;
    if (!id) return;
    try {
      const updatedValue = !r.isPublished;
      await api.updateReview(id, { isPublished: updatedValue });
      setReviews((prev) =>
        prev.map((item) => (item._id === id ? { ...item, isPublished: updatedValue } : item)),
      );
      toast.success(updatedValue ? "Review published to website!" : "Review hidden from website.");
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    }
  };

  const handleToggleFeatured = async (r: ReviewData) => {
    const id = r._id;
    if (!id) return;
    try {
      const updatedValue = !r.isFeatured;
      await api.updateReview(id, { isFeatured: updatedValue });
      setReviews((prev) =>
        prev.map((item) => (item._id === id ? { ...item, isFeatured: updatedValue } : item)),
      );
      toast.success(updatedValue ? "Set as Featured review" : "Unset as Featured");
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    }
  };

  const handleDeleteReview = async (id: string) => {
    try {
      await api.deleteReview(id);
      setReviews((prev) => prev.filter((r) => r._id !== id));
      toast.success("Review deleted successfully");
      setDeletingId(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete review");
    }
  };

  // ---- Drawer resize handlers (mobile only; harmless no-ops on desktop) ----
  const clampHeight = (vh: number) => Math.min(MAX_DRAWER_VH, Math.max(MIN_DRAWER_VH, vh));

  const handleDragStart = (clientY: number) => {
    dragState.current = { startY: clientY, startHeight: drawerHeight };
    setIsDragging(true);
  };

  const handleDragMove = (clientY: number) => {
    if (!dragState.current) return;
    const deltaPx = dragState.current.startY - clientY; // dragging up increases height
    const deltaVh = (deltaPx / window.innerHeight) * 100;
    setDrawerHeight(clampHeight(dragState.current.startHeight + deltaVh));
  };

  const handleDragEnd = () => {
    dragState.current = null;
    setIsDragging(false);
  };

  const onHandlePointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    handleDragStart(e.clientY);
  };
  const onHandlePointerMove = (e: React.PointerEvent) => {
    if (!dragState.current) return;
    handleDragMove(e.clientY);
  };
  const onHandlePointerUp = () => handleDragEnd();

  return (
    <AdminLayout
      title="Review Moderation"
      subtitle="Manually add and publish reviews received via WhatsApp."
      action={
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-medium text-primary-foreground hover:scale-[1.02] active:scale-95 transition-transform shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Add WhatsApp Review</span>
        </button>
      }
    >
      <div className="space-y-6">
        {loading ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 rounded-2xl bg-secondary/50" />
            ))}
          </div>
        ) : reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((r) => (
              <div
                key={r._id}
                className="flex flex-col rounded-3xl hairline bg-card p-5 paper hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-lg text-ink">{r.name}</h3>
                      {r.occasion && (
                        <span className="font-hand text-sm text-rose">({r.occasion})</span>
                      )}
                    </div>
                    <div className="flex items-center gap-0.5 mt-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`h-3.5 w-3.5 ${
                            s <= r.rating ? "fill-champagne text-champagne" : "text-border"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(r)}
                      className={`p-1.5 rounded-full transition-all ${
                        r.isFeatured
                          ? "bg-champagne/30 text-amber-800"
                          : "text-border hover:text-muted-foreground"
                      }`}
                      title={r.isFeatured ? "Featured" : "Not featured"}
                    >
                      <Sparkles
                        className={`h-3.5 w-3.5 ${
                          r.isFeatured ? "fill-champagne text-champagne" : ""
                        }`}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleTogglePublish(r)}
                      className={`px-2.5 py-1 rounded-full text-[0.65rem] font-medium transition-all ${
                        r.isPublished
                          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                          : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                      }`}
                    >
                      {r.isPublished ? "Published" : "Hidden"}
                    </button>
                  </div>
                </div>

                <p className="mt-3 flex-1 text-xs leading-relaxed text-foreground/80 italic">
                  &ldquo;{r.text}&rdquo;
                </p>

                {r.photo && (
                  <div className="mt-3 aspect-video w-full rounded-xl overflow-hidden bg-secondary/30">
                    <img src={r.photo} alt={r.name} className="h-full w-full object-cover" />
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs">
                  <span className="text-[0.65rem] text-muted-foreground">
                    {r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-IN") : "Recent"}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditModal(r)}
                      className="p-1.5 rounded-lg hover:bg-secondary text-ink transition-colors"
                      title="Edit review"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => r._id && setDeletingId(r._id)}
                      className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                      title="Delete review"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl hairline bg-card p-12 text-center paper">
            <MessageSquareHeart className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="font-display text-xl text-ink">No customer reviews yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Add positive feedback and testimonials received from WhatsApp buyers.
            </p>
            <button
              type="button"
              onClick={openAddModal}
              className="mt-4 rounded-full bg-primary px-5 py-2.5 text-xs font-medium text-primary-foreground"
            >
              Add First Review
            </button>
          </div>
        )}
      </div>

      {/* ADD / EDIT REVIEW MODAL */}
      {isModalOpen && (
        <div
          className={`fixed inset-0 z-50 bg-black/30 backdrop-blur-sm transition-opacity duration-250 ${
            isModalVisible ? "opacity-100" : "opacity-0"
          }`}
          onClick={closeModal}
        >
          {/* Mobile Drawer / Desktop Modal */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={
              {
                "--drawer-h": `${drawerHeight}vh`,
              } as React.CSSProperties
            }
            className={`
    fixed z-50 flex w-full flex-col
    bg-card hairline shadow-2xl

    /* Mobile drawer */
    inset-x-0 bottom-0
    h-[var(--drawer-h)]
    rounded-t-[2rem]

    ${isDragging ? "" : "transition-transform duration-300 ease-out"}
    ${isModalVisible ? "translate-y-0" : "translate-y-full"}

    /* Desktop modal */
    sm:left-1/2
    sm:top-1/2
    sm:right-auto
    sm:bottom-auto
    sm:inset-x-auto
    sm:h-auto
    sm:max-h-[90vh]
    sm:w-[calc(100%-2rem)]
    sm:max-w-lg
    sm:-translate-x-1/2
    sm:-translate-y-1/2
    sm:rounded-3xl

    sm:transition-[opacity,transform]
    sm:duration-250

    ${isModalVisible ? "sm:scale-100 sm:opacity-100" : "sm:scale-95 sm:opacity-0"}
  `}
          >
            {/* Drag Handle - Mobile (also resizes the drawer) */}
            <div
              className="flex shrink-0 cursor-ns-resize touch-none justify-center py-3 sm:hidden"
              onPointerDown={onHandlePointerDown}
              onPointerMove={onHandlePointerMove}
              onPointerUp={onHandlePointerUp}
              onPointerCancel={onHandlePointerUp}
              role="separator"
              aria-orientation="horizontal"
              aria-label="Resize drawer"
            >
              <div className="h-1.5 w-12 rounded-full bg-muted-foreground/20" />
            </div>

            {/* Header */}
            <div className="relative shrink-0 border-b border-border/60 px-6 py-4 sm:px-8 sm:py-5">
              <button
                type="button"
                onClick={closeModal}
                className="
            absolute right-4 top-4
            rounded-full p-2
            text-ink transition-colors
            hover:bg-secondary
          "
                aria-label="Close modal"
              >
                <X className="h-5 w-5 transition-transform duration-300 hover:rotate-90" />
              </button>

              <h2 className="pr-10 font-display text-2xl text-ink">
                {editingReview ? "Edit Review" : "Add WhatsApp Review"}
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                Enter the testimonial details sent by the customer.
              </p>
            </div>

            {/* Scrollable Content */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-5 sm:px-8">
              <form id="review-form" onSubmit={handleSaveReview} className="space-y-4">
                {/* Customer Name */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-ink">Customer Name *</label>

                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ananya R."
                    className="w-full rounded-2xl hairline bg-background px-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Occasion + Rating */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-ink">
                      Occasion / Item
                      <span className="text-muted-foreground"> (Optional)</span>
                    </label>

                    <input
                      type="text"
                      value={occasion}
                      onChange={(e) => setOccasion(e.target.value)}
                      placeholder="e.g. Birthday bouquet"
                      className="w-full rounded-2xl hairline bg-background px-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-ink">Rating</label>

                    <div className="flex items-center gap-1.5 pt-1.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setRating(s)}
                          className="rounded-lg p-1 transition-transform hover:scale-110"
                        >
                          <Star
                            className={`h-5 w-5 ${
                              s <= rating ? "fill-champagne text-champagne" : "text-border"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Review */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-ink">Review Text *</label>

                  <textarea
                    required
                    rows={4}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Write the customer's testimonial words..."
                    className="w-full resize-none rounded-2xl hairline bg-background px-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Customer Photo */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-ink">
                    Customer Photo URL
                    <span className="text-muted-foreground"> (Optional)</span>
                  </label>

                  <input
                    type="url"
                    value={photo}
                    onChange={(e) => setPhoto(e.target.value)}
                    placeholder="https://... or /assets/..."
                    className="w-full rounded-2xl hairline bg-background px-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Toggles */}
                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:gap-6">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isPublished}
                      onChange={(e) => setIsPublished(e.target.checked)}
                      className="rounded text-primary focus:ring-rose"
                    />
                    <span className="text-xs font-medium text-ink">Publish to Website</span>
                  </label>

                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="rounded text-primary focus:ring-rose"
                    />
                    <span className="text-xs font-medium text-ink">Featured</span>
                  </label>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="shrink-0 border-t border-border/60 rounded-b-full bg-card px-6 py-4 sm:px-8">
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-full border border-border px-5 py-2.5 text-xs text-muted-foreground transition-colors hover:bg-secondary"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  form="review-form"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs font-medium text-primary-foreground shadow-sm transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70"
                >
                  {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}

                  <span>{editingReview ? "Update Review" : "Add Review"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-card p-6 hairline shadow-xl text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-3">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="font-display text-xl text-ink">Delete this review?</h3>
            <p className="text-xs text-muted-foreground mt-1">
              This review will be permanently deleted from the database.
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
                onClick={() => handleDeleteReview(deletingId)}
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
