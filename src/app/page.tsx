"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { PageTransition, Reveal, Stagger, staggerChild } from "@/components/motion-primitives";
import { BrushDivider, FloatingGarden, FloralLine } from "@/components/Decor";
import { ProductCard } from "@/components/ProductCard";
import { ProductDialog } from "@/components/ProductDialog";
import {
  categories,
  occasions,
  products as initialProducts,
  reviews as initialReviews,
} from "@/lib/site-data";
import { api, type ProductData, type ReviewData } from "@/lib/api";
import ImageWithLoader from "@/components/ImageWithLoader";

const steps = [
  {
    n: "01",
    t: "Share Your Idea",
    d: "Tell us the occasion, the colours, the person — even a rough thought is enough.",
  },
  {
    n: "02",
    t: "We Create With Love",
    d: "We sketch, choose materials and make your piece by hand, sharing updates along the way.",
  },
  {
    n: "03",
    t: "You Receive Something Special",
    d: "It arrives wrapped, tagged and made for exactly one person in the world.",
  },
];

export default function HomePage() {
  const [productsList, setProductsList] = useState<ProductData[]>(initialProducts as any);
  const [reviewsList, setReviewsList] = useState<ReviewData[]>(initialReviews as any);
  const [selected, setSelected] = useState<ProductData | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchLatest = async () => {
      try {
        const [prodRes, revRes] = await Promise.all([
          api.getProducts({ featured: true }).catch(() => null),
          api.getReviews().catch(() => null),
        ]);

        if (isMounted) {
          if (prodRes && prodRes.success && prodRes.data && prodRes.data.length > 0) {
            setProductsList(prodRes.data);
          }
          if (revRes && revRes.success && revRes.data && revRes.data.length > 0) {
            setReviewsList(revRes.data);
          }
        }
      } catch (err) {
        // Fallback already rendered seamlessly
      }
    };

    fetchLatest();
    return () => {
      isMounted = false;
    };
  }, []);

  const featured = productsList.filter((p) => p.featured).slice(0, 6);

  return (
    <PageTransition>
      {/* HERO */}
      <section className="relative overflow-hidden px-4 pb-10 pt-10 sm:px-6 sm:pt-16">
        <FloatingGarden />
        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full hairline bg-card px-4 py-2 text-xs tracking-[0.18em] uppercase text-muted-foreground animate-glow-pulse">
                <Sparkles className="h-3.5 w-3.5 text-champagne animate-sparkle-glow" aria-hidden="true" />
                Handcrafted Since 2025 ♡
              </span>
            </Reveal>
            <Reveal delay={0.04}>
              <h1 className="mt-6 font-display text-[2.6rem] leading-[1.05] sm:text-6xl lg:text-7xl text-ink">
                Turning Creativity Into{" "}
                <span className="italic text-rose">Handmade Happiness.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="mt-5">
                <BrushDivider />
              </div>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
                Beautiful handmade and customised creations, crafted with love, creativity, and
                attention to detail.
              </p>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/shop"
                  prefetch={true}
                  className="rounded-full bg-primary px-6 py-4 text-center text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03] active:scale-95 shadow-sm"
                >
                  Explore Our Shop
                </Link>
                <Link
                  href="/contact"
                  prefetch={true}
                  className="rounded-full border border-primary/30 px-6 py-4 text-center text-sm text-primary transition-colors hover:bg-secondary active:scale-95"
                >
                  Create Something Custom
                </Link>
              </div>
            </Reveal>
          </div>

          <div className="relative">
            <div className="relative z-10 w-full overflow-hidden rounded-[2.5rem] lift grain">
              <ImageWithLoader
                src="/assets/hero-collage.jpg"
                alt="A flat lay of handmade crochet flowers, paintings, bouquets, earrings, and gifts"
                width={1408}
                height={1104}
                priority
                sizes="(max-width: 640px) 100vw, 1152px"
                className="h-auto z-10 w-full object-contain"
              />
            </div>
            <FloralLine className="absolute -left-6 -bottom-8 hidden h-28 w-28 opacity-45 sm:block pointer-events-none" />
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="px-4 py-14 sm:px-6">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">Where Art Meets Heart</p>
          <h2 className="mt-4 font-display text-3xl leading-snug sm:text-4xl text-ink">
            Born in 2025, Shira&rsquo;s Strokes began with a simple idea — to turn creativity into
            something people can hold, gift, cherish, and remember.
          </h2>
          <Link
            href="/our-story"
            prefetch={true}
            className="group mt-7 inline-flex items-center gap-2 text-sm text-primary font-medium"
          >
            Discover Our Story
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </Reveal>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <Reveal className="text-center">
          <p className="eyebrow">The Studio Shelves</p>
          <h2 className="mt-3 font-display text-3xl sm:text-5xl text-ink">
            Made With Love, Created For You
          </h2>
        </Reveal>

        <Stagger className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {categories.map((c) => (
            <div key={c.slug}>
              <Link
                href={`/shop?category=${c.slug}`}
                prefetch={true}
                className="group block overflow-hidden rounded-3xl hairline bg-card paper transition-transform hover:-translate-y-1 duration-300"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-secondary/30">
                  <ImageWithLoader
                    src={c.image}
                    alt={c.name}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 25vw"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-display text-lg leading-tight text-ink">{c.name}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground line-clamp-1">
                    {c.blurb}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </Stagger>

        <Reveal className="mt-10 text-center">
          <Link
            href="/shop"
            prefetch={true}
            className="inline-flex rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03] active:scale-95"
          >
            View All Creations
          </Link>
        </Reveal>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        <Reveal className="max-w-xl">
          <p className="eyebrow">Featured</p>
          <h2 className="mt-3 font-display text-3xl sm:text-5xl text-ink">
            Little Creations, Big Feelings.
          </h2>
          <div className="mt-4">
            <BrushDivider />
          </div>
        </Reveal>

        <div className="mt-9 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProductCard key={p._id || p.id} product={p} onOpen={setSelected} />
          ))}
        </div>
      </section>

      {/* CUSTOM ORDER STORY */}
      <section className="px-4 py-10 sm:px-6">
        <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-[2.5rem] hairline bg-card grain paper">
          <div className="grid gap-0 lg:grid-cols-[1fr_1.1fr]">
            <div className="h-64 w-full lg:h-full overflow-hidden bg-secondary/30">
              <img
                src="/assets/story-1.jpg"
                alt="Hands crocheting a pastel flower in a sunlit studio"
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-6 sm:p-10">
              <Reveal>
                <p className="eyebrow">Custom Orders</p>
                <h2 className="mt-3 font-display text-3xl sm:text-4xl text-ink">
                  Have an Idea? Let&rsquo;s Make It Real.
                </h2>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  Have something special in mind? Tell us your idea, colours, theme or occasion, and
                  we&rsquo;ll turn it into something uniquely yours.
                </p>
              </Reveal>

              <ol className="mt-8 space-y-5">
                {steps.map((s, i) => (
                  <Reveal as="li" key={s.n} delay={i * 0.04} className="flex gap-4">
                    <span className="font-display text-2xl text-rose">{s.n}</span>
                    <span>
                      <span className="block font-display text-xl text-ink">{s.t}</span>
                      <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                        {s.d}
                      </span>
                    </span>
                  </Reveal>
                ))}
              </ol>

              <Reveal delay={0.1}>
                <Link
                  href="/contact"
                  prefetch={true}
                  className="mt-8 inline-flex rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03] active:scale-95"
                >
                  Request a Custom Order
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* OCCASIONS */}
      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        <Reveal className="text-center">
          <p className="eyebrow">Occasions</p>
          <h2 className="mt-3 font-display text-3xl sm:text-5xl text-ink">
            Made For Every Beautiful Moment
          </h2>
        </Reveal>
        <div className="mt-9 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {occasions.map((o) => (
            <div
              key={o}
              className="flex min-h-24 items-center justify-center rounded-3xl hairline bg-card px-4 py-6 text-center paper transition-transform hover:-translate-y-1 duration-300"
            >
              <span className="font-display text-lg leading-tight text-ink">{o}</span>
            </div>
          ))}
        </div>
      </section>

      {/* REVIEWS PREVIEW */}
      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <Reveal className="text-center">
          <p className="eyebrow">Reviews</p>
          <h2 className="mt-3 font-display text-3xl sm:text-5xl text-ink">
            Kind Words From Happy Hearts
          </h2>
        </Reveal>
        <div className="mt-9 grid gap-5 sm:grid-cols-3">
          {reviewsList.slice(0, 3).map((r, i) => (
            <blockquote
              key={r._id || `${r.name}-${i}`}
              className="flex flex-col rounded-3xl hairline bg-card p-6 paper"
            >
              <p className="flex-1 text-base leading-relaxed text-foreground/85">
                &ldquo;{r.text}&rdquo;
              </p>
              <footer className="mt-5">
                <span className="block font-display text-lg text-ink font-medium">{r.name}</span>
                {r.occasion && <span className="font-hand text-base text-rose">{r.occasion}</span>}
              </footer>
            </blockquote>
          ))}
        </div>
        <Reveal className="mt-9 text-center">
          <Link
            href="/reviews"
            prefetch={true}
            className="inline-flex rounded-full border border-primary/30 px-6 py-3.5 text-sm font-medium text-primary transition-colors hover:bg-secondary"
          >
            Read All Reviews
          </Link>
        </Reveal>
      </section>

      {/* FINAL CTA */}
      <section className="px-4 py-16 sm:px-6">
        <Reveal className="relative mx-auto max-w-4xl overflow-hidden rounded-[2.5rem] warm-gradient px-6 py-16 text-center grain sm:px-12">
          <FloatingGarden />
          <h2 className="relative font-display text-3xl leading-tight sm:text-5xl text-ink">
            Let&rsquo;s Create Something Beautiful Together.
          </h2>
          <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/shop"
              prefetch={true}
              className="rounded-full bg-primary px-6 py-4 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03] active:scale-95"
            >
              Shop Handmade
            </Link>
            <Link
              href="/contact"
              prefetch={true}
              className="rounded-full bg-card px-6 py-4 text-sm font-medium text-primary transition-transform hover:scale-[1.03] active:scale-95 shadow-sm"
            >
              Get in Touch
            </Link>
          </div>
        </Reveal>
      </section>

      <ProductDialog
        product={selected}
        allProducts={productsList}
        onClose={() => setSelected(null)}
        onSelect={setSelected}
      />
    </PageTransition>
  );
}
