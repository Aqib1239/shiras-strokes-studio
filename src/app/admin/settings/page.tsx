"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { getWhatsAppNumber, getWhatsAppEnquiryUrl, getWhatsAppReviewUrl, getWhatsAppCustomOrderUrl } from "@/lib/whatsapp";
import {
  Lock,
  MessageCircle,
  Shield,
  KeyRound,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Database,
  Cloud,
  Layers,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const { admin } = useAuth();

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    setUpdatingPassword(true);
    try {
      await api.updatePassword(currentPassword, newPassword);
      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err.message || "Failed to update password");
    } finally {
      setUpdatingPassword(false);
    }
  };

  const currentWaNumber = getWhatsAppNumber();

  return (
    <AdminLayout
      title="Studio Settings"
      subtitle="Manage your credentials, WhatsApp integrations, and system configuration."
    >
      <div className="max-w-4xl space-y-8">
        {/* Admin Profile Overview */}
        <div className="rounded-3xl hairline bg-card p-6 sm:p-8 paper">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Shield className="h-7 w-7" />
            </div>
            <div>
              <h2 className="font-display text-2xl text-ink font-semibold">{admin?.name || "Studio Admin"}</h2>
              <p className="text-xs text-muted-foreground">{admin?.email}</p>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-secondary text-[0.65rem] font-semibold uppercase tracking-wider text-primary">
                {admin?.role || "Administrator"}
              </span>
            </div>
          </div>
        </div>

        {/* Change Password Form */}
        <div className="rounded-3xl hairline bg-card p-6 sm:p-8 paper">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-xl bg-secondary text-primary">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-xl text-ink font-semibold">Update Admin Password</h3>
              <p className="text-xs text-muted-foreground">Change your security password for admin portal access.</p>
            </div>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-medium text-ink mb-1">Current Password *</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-2xl hairline bg-background px-4 py-2.5 text-xs text-foreground focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-ink mb-1">New Password *</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full rounded-2xl hairline bg-background px-4 py-2.5 text-xs text-foreground focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-ink mb-1">Confirm New Password *</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full rounded-2xl hairline bg-background px-4 py-2.5 text-xs text-foreground focus:outline-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={updatingPassword}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs font-medium text-primary-foreground hover:scale-[1.02] active:scale-95 disabled:opacity-70 transition-transform shadow-sm"
              >
                {updatingPassword && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <span>Save New Password</span>
              </button>
            </div>
          </form>
        </div>

        {/* WhatsApp Central Configuration Preview */}
        <div className="rounded-3xl hairline bg-card p-6 sm:p-8 paper">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-xl bg-[#25D366]/10 text-[#25D366]">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-xl text-ink font-semibold">WhatsApp Communication Flow</h3>
              <p className="text-xs text-muted-foreground">
                All store enquiries and customer reviews route through your configured WhatsApp number.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-secondary/50 p-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <p className="text-xs text-muted-foreground">Active WhatsApp Business Number</p>
                <p className="font-display text-lg text-ink font-semibold">+{currentWaNumber}</p>
              </div>
              <span className="text-[0.7rem] text-muted-foreground">
                Configured via <code className="text-primary font-mono">NEXT_PUBLIC_WHATSAPP_NUMBER</code> in <code className="text-primary font-mono">.env</code>
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold text-ink">Test Pre-filled WhatsApp Actions:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <a
                href={getWhatsAppEnquiryUrl("Crochet Flower Bouquet", 1290)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-2xl hairline bg-background p-3 hover:bg-secondary/40 transition-colors text-xs text-ink"
              >
                <span>Product Enquiry</span>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
              </a>

              <a
                href={getWhatsAppCustomOrderUrl()}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-2xl hairline bg-background p-3 hover:bg-secondary/40 transition-colors text-xs text-ink"
              >
                <span>Custom Order Form</span>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
              </a>

              <a
                href={getWhatsAppReviewUrl()}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-2xl hairline bg-background p-3 hover:bg-secondary/40 transition-colors text-xs text-ink"
              >
                <span>Review Submission</span>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
              </a>
            </div>
          </div>
        </div>

        {/* Database & Cloud Architecture Overview */}
        <div className="rounded-3xl hairline bg-card p-6 sm:p-8 paper">
          <h3 className="font-display text-xl text-ink font-semibold mb-4">Architecture & Production Ready</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl hairline bg-background">
              <div className="flex items-center gap-2 text-ink font-medium mb-1">
                <Database className="h-4 w-4 text-primary" />
                <span>MongoDB & Mongoose</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Full CRUD operations for Products, Reviews, and Admins. Supports MongoDB Atlas cloud connection string or local MongoDB URI in <code className="text-primary">.env</code>.
              </p>
            </div>

            <div className="p-4 rounded-2xl hairline bg-background">
              <div className="flex items-center gap-2 text-ink font-medium mb-1">
                <Cloud className="h-4 w-4 text-primary" />
                <span>Cloudinary / Local File Storage</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Seamless multi-image upload handler. When Cloudinary credentials are set in <code className="text-primary">.env</code>, images are automatically uploaded to Cloudinary; otherwise, local file storage in <code className="text-primary">public/uploads</code> is used.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
