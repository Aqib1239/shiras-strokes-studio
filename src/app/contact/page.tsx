"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Instagram, Mail, MessageCircle, ChevronDown, Check } from "lucide-react";
import { PageTransition, Reveal } from "@/components/motion-primitives";
import { BrushDivider, FloatingGarden } from "@/components/Decor";
import { EMAIL, INSTAGRAM_URL, WHATSAPP_URL, faqs } from "@/lib/site-data";
import { getWhatsAppCustomOrderUrl } from "@/lib/whatsapp";
import { toast } from "sonner";

const enquiries = [
  "Product Enquiry",
  "Custom Order",
  "Bulk Order",
  "Gift Recommendation",
  "General Question",
  "Other",
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState("Custom Order");
  const [message, setMessage] = useState("");

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
    toast.success("Message sent with love!", {
      description: "We usually reply within 24 hours.",
    });

    setTimeout(() => setSent(false), 6000);
  };

  return (
    <PageTransition>
      <section className="relative overflow-hidden px-4 pb-4 pt-14 sm:px-6 sm:pt-20">
        <FloatingGarden />
        <Reveal className="relative mx-auto max-w-3xl text-center">
          <p className="eyebrow">Say Hello</p>
          <h1 className="mt-3 font-display text-4xl leading-tight sm:text-6xl text-ink">
            Let&rsquo;s Create Something Special.
          </h1>
          <div className="mt-4 flex justify-center">
            <BrushDivider />
          </div>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Have a question, want to place a custom order, or simply want to say hello? We&rsquo;d
            love to hear from you.
          </p>
        </Reveal>
      </section>

      {/* Quick Contact Cards */}
      <section className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: MessageCircle,
              label: "WhatsApp",
              value: "Chat directly with us",
              href: WHATSAPP_URL,
              isExternal: true,
            },
            {
              icon: Mail,
              label: "Email",
              value: EMAIL,
              href: `mailto:${EMAIL}`,
              isExternal: false,
            },
            {
              icon: Instagram,
              label: "Instagram",
              value: "@shirasstrokes",
              href: INSTAGRAM_URL,
              isExternal: true,
            },
          ].map((c, i) => (
            <Reveal key={c.label} delay={i * 0.04}>
              <a
                href={c.href}
                target={c.isExternal ? "_blank" : undefined}
                rel="noreferrer"
                className="flex h-full items-center gap-4 rounded-3xl hairline bg-card p-5 transition-transform hover:-translate-y-1 paper"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                  <c.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <span className="block text-sm font-medium text-ink">{c.label}</span>
                  <span className="block text-sm text-muted-foreground">{c.value}</span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Contact Form */}
      <section className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        <Reveal className="rounded-[2.5rem] hairline bg-card p-6 grain paper sm:p-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
            <div>
              <h2 className="font-display text-3xl text-ink">Send a Message</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Tell us about your occasion, favourite colours, or custom ideas.
              </p>
            </div>
            <a
              href={getWhatsAppCustomOrderUrl()}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-secondary/50 px-4 py-2 text-xs font-medium text-primary hover:bg-secondary transition-colors shrink-0"
            >
              <MessageCircle className="h-3.5 w-3.5 text-[#25D366]" />
              <span>Or WhatsApp Us</span>
            </a>
          </div>

          <form className="space-y-5" onSubmit={submit}>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="c-name" className="mb-1.5 block text-sm font-medium text-ink">
                  Name
                </label>
                <input
                  id="c-name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-2xl hairline bg-background px-4 py-3 text-sm focus:outline-none"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="c-email" className="mb-1.5 block text-sm font-medium text-ink">
                  Email
                </label>
                <input
                  id="c-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl hairline bg-background px-4 py-3 text-sm focus:outline-none"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="c-type" className="mb-1.5 block text-sm font-medium text-ink">
                Enquiry Type
              </label>
              <select
                id="c-type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-2xl hairline bg-background px-4 py-3 text-sm focus:outline-none text-foreground"
              >
                {enquiries.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="c-msg" className="mb-1.5 block text-sm font-medium text-ink">
                Your Message / Custom Details
              </label>
              <textarea
                id="c-msg"
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-2xl hairline bg-background px-4 py-3 text-sm focus:outline-none"
                placeholder="Share dates, colours, specific items, or occasion..."
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02] active:scale-95 shadow-md"
            >
              Send Message
            </button>
          </form>

          <AnimatePresence>
            {sent && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-5 rounded-2xl bg-secondary p-4 text-center text-sm text-secondary-foreground flex items-center justify-center gap-2"
              >
                <Check className="h-4 w-4 text-rose" />
                Thank you! We received your message and will reply soon.
              </motion.div>
            )}
          </AnimatePresence>
        </Reveal>
      </section>

      {/* Frequently Asked Questions */}
      <section className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6">
        <Reveal className="text-center mb-8">
          <p className="eyebrow">Questions & Answers</p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl text-ink">
            Frequently Asked Questions
          </h2>
        </Reveal>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const open = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-3xl hairline bg-card overflow-hidden paper"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(open ? null : idx)}
                  className="flex w-full items-center justify-between p-5 text-left text-base font-medium text-ink hover:text-primary transition-colors"
                  aria-expanded={open}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 transition-transform duration-300 ${
                      open ? "rotate-180 text-primary" : "text-muted-foreground"
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-5 pb-5 pt-0 text-sm leading-relaxed text-muted-foreground border-t border-border/40 mt-1">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>
    </PageTransition>
  );
}
