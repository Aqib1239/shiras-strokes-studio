"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { api, type DashboardStats } from "@/lib/api";
import { formatPrice } from "@/lib/site-data";
import {
  Package,
  CheckCircle2,
  MessageSquareHeart,
  Sparkles,
  PlusCircle,
  ArrowRight,
  Database,
  Cloud,
  Eye,
  Star,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [cloudinaryUsage, setCloudinaryUsage] = useState<{
    storage: {
      used: number;
      free: number;
      total: number;
      percentage: number;
    };
    resources: number;
    raw?: {
      plan?: string;
      credits?: {
        usage: number;
        limit: number;
        used_percent: number;
      };
    };
  } | null>(null);

  const fetchCloudinaryUsage = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cloudinary/usage`);

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch Cloudinary usage");
      }

      console.log("Cloudinary usage:", data);

      setCloudinaryUsage(data);
    } catch (error) {
      console.error("Failed to fetch Cloudinary usage:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.getDashboardStats();
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (err: any) {
      toast.error("Failed to load dashboard metrics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchCloudinaryUsage();
  }, []);

  return (
    <AdminLayout
      title="Studio Overview"
      subtitle="Monitor your handmade products, reviews, and activity."
    >
      {loading ? (
        <div className="space-y-6 animate-pulse">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 rounded-3xl bg-secondary/50" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-72 rounded-3xl bg-secondary/50" />
            <div className="h-72 rounded-3xl bg-secondary/50" />
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-3xl hairline bg-card p-5 paper flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Package className="h-6 w-6" />
              </div>
              <div>
                <p className="eyebrow">Total Products</p>
                <p className="font-display text-3xl font-semibold text-ink">
                  {stats?.totalProducts || 0}
                </p>
              </div>
            </div>

            <div className="rounded-3xl hairline bg-card p-5 paper flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sage/20 text-emerald-800">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <p className="eyebrow">Active in Shop</p>
                <p className="font-display text-3xl font-semibold text-ink">
                  {stats?.activeProducts || 0}
                </p>
              </div>
            </div>

            <div className="rounded-3xl hairline bg-card p-5 paper flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rose/20 text-rose">
                <MessageSquareHeart className="h-6 w-6" />
              </div>
              <div>
                <p className="eyebrow">Total Reviews</p>
                <p className="font-display text-3xl font-semibold text-ink">
                  {stats?.totalReviews || 0}
                </p>
              </div>
            </div>

            <div className="rounded-3xl hairline bg-card p-5 paper flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-champagne/30 text-amber-800">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <p className="eyebrow">Published Reviews</p>
                <p className="font-display text-3xl font-semibold text-ink">
                  {stats?.publishedReviews || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Recent Products & Recent Reviews */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Products */}
            <div className="rounded-3xl hairline bg-card p-6 paper">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-display text-xl font-semibold text-ink">Recent Products</h2>
                  <p className="text-xs text-muted-foreground">Latest creations added to catalog</p>
                </div>
                <Link
                  href="/admin/products"
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  <span>View all</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              {stats?.recentProducts && stats.recentProducts.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentProducts.map((p) => (
                    <div
                      key={p._id}
                      className="flex items-center justify-between rounded-2xl hairline bg-background p-3 hover:bg-secondary/40 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={p.image || "/assets/cat-crafts.jpg"}
                          alt={p.name}
                          className="h-12 w-12 rounded-xl object-cover shrink-0 bg-secondary/30"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-ink truncate">{p.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{p.category}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-display text-sm font-semibold text-ink">
                          {formatPrice(p.price)}
                        </p>
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[0.65rem] font-medium ${
                            p.isActive
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {p.isActive ? "Active" : "Draft"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground py-6 text-center">No products yet.</p>
              )}
            </div>

            {/* Recent Reviews */}
            <div className="rounded-3xl hairline bg-card p-6 paper">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-display text-xl font-semibold text-ink">Recent Reviews</h2>
                  <p className="text-xs text-muted-foreground">Feedback from WhatsApp enquiries</p>
                </div>
                <Link
                  href="/admin/reviews"
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  <span>Manage</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              {stats?.recentReviews && stats.recentReviews.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentReviews.map((r) => (
                    <div
                      key={r._id}
                      className="rounded-2xl hairline bg-background p-3.5 hover:bg-secondary/40 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-semibold text-ink">{r.name}</p>
                          {r.occasion && (
                            <span className="text-[0.7rem] text-rose font-hand">
                              ({r.occasion})
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`h-3 w-3 ${
                                s <= r.rating ? "fill-champagne text-champagne" : "text-border"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2 italic">
                        &ldquo;{r.text}&rdquo;
                      </p>
                      <div className="mt-2 flex items-center justify-between text-[0.65rem]">
                        <span
                          className={`px-2 py-0.5 rounded-full font-medium ${
                            r.isPublished
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {r.isPublished ? "Published" : "Hidden"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground py-6 text-center">No reviews yet.</p>
              )}
            </div>
          </div>

          {/* System Health / Storage Status */}
          <div className="rounded-3xl hairline bg-card p-6 paper">
            <h3 className="font-display text-lg font-semibold text-ink mb-5">
              System & Integrations
            </h3>

            <div className="divide-y divide-border/60">
              {/* Database */}
              <div className="flex items-center gap-4 py-4 first:pt-0">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary/60 shrink-0">
                  <Database className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0 flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-ink">MongoDB Database</p>
                  <span className="inline-flex items-center gap-1.5 text-[0.7rem] text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Connected
                  </span>
                </div>
              </div>

              {/* Image Storage */}
              <div className="flex items-start gap-4 py-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary/60 shrink-0 mt-0.5">
                  <Cloud className="h-4 w-4 text-primary" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-ink">Image Storage</p>

                    <span
                      className={`inline-flex items-center gap-1.5 text-[0.7rem] ${
                        stats?.system.cloudinaryConfigured ? "text-emerald-700" : "text-amber-700"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          stats?.system.cloudinaryConfigured ? "bg-emerald-500" : "bg-amber-500"
                        }`}
                      />
                      {stats?.system.cloudinaryConfigured ? "Active" : "Fallback"}
                    </span>
                  </div>

                  {stats?.system.cloudinaryConfigured ? (
                    cloudinaryUsage ? (
                      <div className="mt-3 space-y-3">
                        {/* Storage & Images */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="rounded-lg bg-secondary/40 px-3 py-2">
                            <p className="text-[0.65rem] text-muted-foreground">Storage Used</p>

                            <p className="mt-0.5 text-sm font-medium text-ink">
                              {(cloudinaryUsage.storage?.used ?? 0).toFixed(2)} GB
                            </p>
                          </div>

                          <div className="rounded-lg bg-secondary/40 px-3 py-2">
                            <p className="text-[0.65rem] text-muted-foreground">
                              Current Images Stored
                            </p>

                            <p className="mt-0.5 text-sm font-medium text-ink">
                              {cloudinaryUsage.resources ?? 0}
                            </p>
                          </div>
                        </div>

                        {/* Cloudinary Usage */}
                        {cloudinaryUsage.raw?.credits && (
                          <div>
                            <div className="flex items-center justify-between text-[0.7rem]">
                              <span className="text-muted-foreground">Cloudinary usage</span>

                              <span className="font-medium text-ink">
                                {(cloudinaryUsage.raw.credits.used_percent ?? 0).toFixed(1)}%
                              </span>
                            </div>

                            {/* Usage Progress */}
                            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-border/70">
                              <div
                                className="h-full rounded-full bg-primary/80 transition-all duration-500"
                                style={{
                                  width: `${Math.min(
                                    cloudinaryUsage.raw.credits.used_percent ?? 0,
                                    100,
                                  )}%`,
                                }}
                              />
                            </div>

                            {/* Usage Details */}
                            <div className="mt-1.5 flex items-center justify-between text-[0.65rem] text-muted-foreground/80">
                              <span>
                                {(cloudinaryUsage.raw.credits.usage ?? 0).toFixed(2)} used
                              </span>

                              <span>
                                {Math.max(
                                  (cloudinaryUsage.raw.credits.limit ?? 0) -
                                    (cloudinaryUsage.raw.credits.usage ?? 0),
                                  0,
                                ).toFixed(2)}{" "}
                                remaining
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Plan */}
                        {cloudinaryUsage.raw?.plan && (
                          <div className="flex items-center justify-between text-[0.65rem] text-muted-foreground/80">
                            <span>Plan</span>

                            <span className="font-medium text-ink">{cloudinaryUsage.raw.plan}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="mt-2 text-[0.7rem] text-muted-foreground">
                        Loading storage information…
                      </p>
                    )
                  ) : (
                    <p className="mt-2 text-[0.7rem] text-amber-700">
                      Local uploads fallback active
                    </p>
                  )}
                </div>
              </div>

              {/* Environment */}
              <div className="flex items-center gap-4 py-4 last:pb-0">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary/60 shrink-0">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0 flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-ink">Environment</p>
                  <span className="text-[0.7rem] text-muted-foreground capitalize">
                    {stats?.system.nodeEnv || "development"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
