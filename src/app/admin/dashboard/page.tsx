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
      usedBytes: number;
      usedGB: number;
    };
    credits: {
      used: number;
      limit: number;
      percentage: number;
      remaining: number;
    };
    resources: number;
    plan: string | null;
    lastUpdated: string | null;
  } | null>(null);

  const fetchCloudinaryUsage = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cloudinary/usage`
      );
  
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
            <h3 className="font-display text-lg font-semibold text-ink mb-3">
              System & Integrations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="rounded-2xl bg-secondary/50 p-3.5 flex items-center gap-3">
                <Database className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-ink">MongoDB Database</p>
                  <p className="text-emerald-700">● Connected & Active</p>
                </div>
              </div>

              <div className="rounded-2xl bg-secondary/50 p-3.5 flex items-start gap-3">
                <Cloud className="h-5 w-5 text-primary mt-0.5 shrink-0" />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-ink">Image Storage</p>

                    <span
                      className={
                        stats?.system.cloudinaryConfigured ? "text-emerald-700" : "text-amber-700"
                      }
                    >
                      {stats?.system.cloudinaryConfigured ? "● Active" : "● Fallback"}
                    </span>
                  </div>

                  {stats?.system.cloudinaryConfigured ? (
                    cloudinaryUsage ? (
                      <div className="mt-2">
                        {/* Storage */}
                        <div className="flex items-center justify-between text-[0.7rem]">
                          <span className="text-muted-foreground">
                            {cloudinaryUsage.storage.usedGB.toFixed(2)} GB used
                          </span>

                          <span className="font-medium text-ink">
                            {cloudinaryUsage.resources} resources
                          </span>
                        </div>

                        {/* Credits progress */}
                        <div className="mt-2 flex items-center justify-between text-[0.7rem]">
                          <span className="text-muted-foreground">
                            {cloudinaryUsage.credits.used.toFixed(2)} credits used
                          </span>

                          <span className="font-medium text-ink">
                            {cloudinaryUsage.credits.percentage.toFixed(0)}%
                          </span>
                        </div>

                        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-border">
                          <div
                            className="h-full rounded-full bg-primary transition-all duration-500"
                            style={{
                              width: `${Math.min(cloudinaryUsage.credits.percentage, 100)}%`,
                            }}
                          />
                        </div>

                        {/* Credit details */}
                        <div className="mt-1.5 flex justify-between text-[0.65rem] text-muted-foreground">
                          <span>
                            {cloudinaryUsage.credits.remaining.toFixed(2)} credits remaining
                          </span>

                          <span>{cloudinaryUsage.credits.limit.toFixed(2)} credits total</span>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-1 text-muted-foreground">Loading storage...</p>
                    )
                  ) : (
                    <p className="text-amber-700">Local Uploads Fallback Active</p>
                  )}
                </div>
              </div>

              <div className="rounded-2xl bg-secondary/50 p-3.5 flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-ink">Environment</p>
                  <p className="text-muted-foreground capitalize">
                    {stats?.system.nodeEnv || "development"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
