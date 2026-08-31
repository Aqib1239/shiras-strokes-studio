"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Lock, Mail, Eye, EyeOff, ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { BrushDivider, FloatingGarden } from "@/components/Decor";
import { PageTransition, Reveal } from "@/components/motion-primitives";

export default function AdminLoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/admin/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);

    try {
      await login(email, password);
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid credentials. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="relative min-h-[85vh] flex items-center justify-center px-4 py-12 sm:px-6">
        <FloatingGarden />

        <div className="relative w-full max-w-md">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-primary mb-6 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to store
          </Link>

          <Reveal className="rounded-[2.5rem] hairline bg-card p-8 grain paper sm:p-10 shadow-lg">
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-primary mb-3">
                <Lock className="h-6 w-6" />
              </div>
              <h1 className="font-display text-3xl text-ink">Admin Portal</h1>
              <p className="font-hand text-base text-rose mt-0.5">Shira&rsquo;s Strokes Studio</p>
              <div className="mt-3 flex justify-center">
                <BrushDivider className="w-28" />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Sign in to manage products, customer reviews, and studio settings.
              </p>
            </div>

            {errorMsg && (
              <div className="mt-5 rounded-2xl bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive text-center">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-ink mb-1">Admin Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@shirasstrokes.com"
                    className="w-full rounded-2xl hairline bg-background pl-10 pr-4 py-3 text-sm focus:outline-none text-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-ink mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-2xl hairline bg-background pl-10 pr-10 py-3 text-sm focus:outline-none text-foreground"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-70 shadow-md"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <span>Sign In to Dashboard</span>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 rounded-2xl bg-secondary/40 p-3 text-center text-[0.7rem] text-muted-foreground">
              <span className="font-semibold text-ink">Default Demo Login:</span>
              <br />
              email: <code className="text-primary">admin@shirasstrokes.com</code>
              <br />
              password: <code className="text-primary">Admin@Shira2025!</code>
            </div>
          </Reveal>
        </div>
      </div>
    </PageTransition>
  );
}
