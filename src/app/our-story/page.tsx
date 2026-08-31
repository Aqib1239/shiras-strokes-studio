"use client";

import Link from "next/link";
import { PageTransition, Reveal } from "@/components/motion-primitives";
import { BrushDivider, FloralLine } from "@/components/Decor";

const chapters = [
  {
    year: "2025",
    title: "Where It Began",
    body: "Shira's Strokes started in 2025 with a table full of yarn, paint and half-finished ideas. What began as a way to spend quiet evenings slowly became something people asked for — a flower that wouldn't wilt, a painting with someone's name on it, a small gift that felt like a hug.",
    image: "/assets/story-1.jpg",
    quote: "Made slowly.",
  },
  {
    year: "The middle",
    title: "Growing Through Creativity",
    body: "One craft led to another. Crochet led to bouquets, bouquets led to earrings, earrings led to rakhis and pipe cleaner flowers. Every experiment taught us something about texture, colour and patience — and every mistake became part of the technique.",
    image: "/assets/story-2.jpg",
    quote: "Made thoughtfully.",
  },
  {
    year: "Today",
    title: "Made For You",
    body: "Most of what we make now begins with a message: a colour, an occasion, a person to celebrate. Customised creations are the heart of the studio — pieces designed for one person, and made only once.",
    image: "/assets/story-3.jpg",
    quote: "Made with love.",
  },
];

export default function StoryPage() {
  return (
    <PageTransition>
      <section className="relative overflow-hidden px-4 pb-6 pt-14 sm:px-6 sm:pt-20">
        <FloralLine className="absolute -right-6 top-6 h-40 w-40 opacity-30 pointer-events-none" />
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="eyebrow">Since 2025</p>
            <h1 className="mt-3 font-display text-4xl leading-tight sm:text-6xl text-ink">
              Every Stroke Has a Story.
            </h1>
            <div className="mt-4 flex justify-center">
              <BrushDivider />
            </div>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              From a creative idea in 2025 to handmade creations made with love.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6" aria-label="Our timeline">
        <ol className="space-y-16 sm:space-y-24">
          {chapters.map((c, i) => (
            <li key={c.title}>
              <Reveal>
                <div
                  className={`grid items-center gap-6 md:grid-cols-2 md:gap-12 ${
                    i % 2 === 1 ? "md:[&>figure]:order-2" : ""
                  }`}
                >
                  <figure className="relative">
                    <img
                      src={c.image}
                      alt={c.title}
                      loading="lazy"
                      decoding="async"
                      width={1000}
                      height={800}
                      className="aspect-[5/4] w-full rounded-3xl object-cover lift"
                    />
                    <figcaption className="font-hand absolute -bottom-4 left-5 rounded-full bg-card px-4 py-1.5 text-lg text-rose paper">
                      {c.quote}
                    </figcaption>
                  </figure>
                  <div>
                    <p className="eyebrow">{c.year}</p>
                    <h2 className="mt-2 font-display text-3xl sm:text-4xl text-ink">{c.title}</h2>
                    <p className="mt-4 text-base leading-relaxed text-muted-foreground">{c.body}</p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <section className="px-4 py-12 sm:px-6">
        <Reveal className="mx-auto max-w-3xl rounded-[2.5rem] hairline bg-card px-6 py-12 text-center grain paper sm:px-12">
          <h2 className="font-display text-3xl sm:text-4xl text-ink">Why We Make</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            We believe handmade things carry something that mass-produced products cannot — time,
            thought, creativity and a little piece of the person who made them.
          </p>
          <p className="font-hand mt-6 text-2xl text-rose">Turning creativity into handmade happiness.</p>
          <Link
            href="/shop"
            prefetch={true}
            className="mt-8 inline-flex rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03] active:scale-95 shadow-sm"
          >
            See What We&rsquo;ve Made
          </Link>
        </Reveal>
      </section>
    </PageTransition>
  );
}
