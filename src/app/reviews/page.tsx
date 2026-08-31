"use client";

import { useEffect, useState } from "react";
import { Star, MessageCircle, HeartHandshake, Sparkles } from "lucide-react";
import { PageTransition, Reveal } from "@/components/motion-primitives";
import { BrushDivider, FloatingGarden } from "@/components/Decor";
import { reviews as fallbackReviews } from "@/lib/site-data";
import { api, type ReviewData } from "@/lib/api";
import { getWhatsAppReviewUrl } from "@/lib/whatsapp";

function Stars({ value, className = "" }: { value: number; className?: string }) {
  return (
    <span className={`flex gap-0.5 ${className}`} aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={`h-4 w-4 ${i <= value ? "fill-champagne text-champagne" : "text-border"}`}
        />
      ))}
    </span>
  );
}

export default function ReviewsPage() {
  const [list, setList] = useState<ReviewData[]>(fallbackReviews as any);

  useEffect(() => {
    let isMounted = true;
    const fetchReviews = async () => {
      try {
        const res = await api.getReviews();
        if (isMounted && res.success && res.data && res.data.length > 0) {
          setList(res.data);
        }
      } catch (err) {
        // Fallback rendered instantly
      }
    };

    fetchReviews();
    return () => {
      isMounted = false;
    };
  }, []);

  const averageRating = (
    list.reduce((acc, r) => acc + (r.rating || 5), 0) / (list.length || 1)
  ).toFixed(1);

  return (
    <PageTransition>
      <section className="relative overflow-hidden px-4 pb-4 pt-14 sm:px-6 sm:pt-20">
        <FloatingGarden />
        <Reveal className="relative mx-auto max-w-3xl text-center">
          <p className="eyebrow">Feedback</p>
          <h1 className="mt-3 font-display text-4xl leading-tight sm:text-6xl text-ink">
            What Our Customers Say
          </h1>
          <div className="mt-4 flex justify-center">
            <BrushDivider />
          </div>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Every kind word inspires us to keep creating.
          </p>
        </Reveal>
      </section>

      {/* Rating summary banner */}
      <section className="px-4 py-6 sm:px-6">
        <Reveal className="mx-auto flex max-w-md flex-col items-center rounded-[2rem] hairline bg-card px-8 py-8 text-center paper">
          <p className="eyebrow">Loved by our customers</p>
          <Stars value={5} className="mt-3" />
          <p className="mt-3 font-display text-4xl text-ink font-semibold">{averageRating} / 5</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Based on {list.length} customer review{list.length === 1 ? "" : "s"}
          </p>
        </Reveal>
      </section>

      {/* Reviews list */}
      <section className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6" aria-label="Customer reviews">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((r, i) => (
            <article
              key={r._id || `${r.name}-${i}`}
              className="flex flex-col rounded-3xl hairline bg-card p-6 paper transition-shadow duration-300 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <Stars value={r.rating} />
                {r.isFeatured && (
                  <span className="flex items-center gap-1 rounded-full bg-accent/70 px-2 py-0.5 text-[0.65rem] font-medium text-accent-foreground">
                    <Sparkles className="h-2.5 w-2.5" />
                    Featured
                  </span>
                )}
              </div>
              <p className="mt-4 flex-1 text-base leading-relaxed text-foreground/85">
                &ldquo;{r.text}&rdquo;
              </p>
              {r.photo && (
                <div className="mt-4 overflow-hidden rounded-2xl aspect-video bg-secondary/30">
                  <img
                    src={r.photo}
                    alt={`${r.name}'s review`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <footer className="mt-5 pt-3 border-t border-border/50">
                <p className="font-display text-lg text-ink font-medium">{r.name}</p>
                {r.occasion && (
                  <p className="font-hand text-base text-rose">{r.occasion}</p>
                )}
              </footer>
            </article>
          ))}
        </div>
      </section>

      {/* WHATSAPP REVIEW INVITATION SECTION */}
      <section className="px-4 py-16 sm:px-6">
        <Reveal className="mx-auto max-w-2xl rounded-[2.5rem] hairline bg-card p-8 grain paper sm:p-12 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-primary">
            <HeartHandshake className="h-7 w-7 text-rose" />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-ink">
            Want to share your experience?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            If something we made found a warm place in your home or brought a smile to someone you love,
            we&rsquo;d love to hear from you.
          </p>

          <div className="mt-8">
            <a
              href={getWhatsAppReviewUrl()}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2.5 rounded-full bg-primary px-8 py-4 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03] active:scale-95 shadow-md"
            >
              <MessageCircle className="h-5 w-5 text-[#25D366]" />
              <span>Share Your Review on WhatsApp</span>
            </a>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Opens a pre-filled WhatsApp message where you can send your name, rating, words, and photos.
          </p>
        </Reveal>
      </section>
    </PageTransition>
  );
}
