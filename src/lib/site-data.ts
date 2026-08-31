import crochet from "@/assets/cat-crochet.jpg";
import paintings from "@/assets/cat-paintings.jpg";
import flowers from "@/assets/cat-flowers.jpg";
import earrings from "@/assets/cat-earrings.jpg";
import rakhi from "@/assets/cat-rakhi.jpg";
import pipecleaner from "@/assets/cat-pipecleaner.jpg";
import gifts from "@/assets/cat-gifts.jpg";
import crafts from "@/assets/cat-crafts.jpg";
import type { StaticImageData } from "next/image";

export const images = {
  crochet,
  paintings,
  flowers,
  earrings,
  rakhi,
  pipecleaner,
  gifts,
  crafts,
};

export type Category = {
  slug: string;
  name: string;
  blurb: string;
  image: StaticImageData;
};

export const categories: Category[] = [
  {
    slug: "crochet",
    name: "Crochet Creations",
    blurb: "Loops of yarn turned into keepsakes.",
    image: crochet,
  },
  {
    slug: "paintings",
    name: "Paintings & Artworks",
    blurb: "Brush strokes with a little soul.",
    image: paintings,
  },
  {
    slug: "flowers",
    name: "Flowers & Bouquets",
    blurb: "Blooms that never fade away.",
    image: flowers,
  },
  {
    slug: "accessories",
    name: "Earrings & Accessories",
    blurb: "Small details, big personality.",
    image: earrings,
  },
  {
    slug: "rakhis",
    name: "Rakhis & Rakhi Gifts",
    blurb: "Threads tied with affection.",
    image: rakhi,
  },
  {
    slug: "pipe-cleaner",
    name: "Pipe Cleaner Crafts",
    blurb: "Playful, soft and full of colour.",
    image: pipecleaner,
  },
  {
    slug: "gifts",
    name: "Customised Gifts",
    blurb: "Made for one person only — yours.",
    image: gifts,
  },
  {
    slug: "custom",
    name: "Creative Art & Crafts",
    blurb: "Little pieces of everyday joy.",
    image: crafts,
  },
];

export type Product = {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  price: number;
  description: string;
  materials: string;
  customisable: boolean;
  featured: boolean;
  newest: number;
  image: StaticImageData;
};

export const products: Product[] = [
  {
    id: "crochet-flower-bouquet",
    name: "Crochet Flower Bouquet",
    category: "crochet",
    categoryLabel: "Crochet Creations",
    price: 1290,
    description:
      "A hand-crocheted bouquet of soft petals that will never wilt — wrapped in cream paper and tied with a blush ribbon.",
    materials: "Cotton yarn, floral wire, kraft wrap, satin ribbon",
    customisable: true,
    featured: true,
    newest: 8,
    image: crochet,
  },
  {
    id: "floral-earrings",
    name: "Handmade Floral Earrings",
    category: "accessories",
    categoryLabel: "Earrings & Accessories",
    price: 480,
    description:
      "Featherlight earrings shaped petal by petal, finished with tiny glass beads and gentle gold-tone hooks.",
    materials: "Thread, glass beads, gold-tone hooks",
    customisable: true,
    featured: true,
    newest: 7,
    image: earrings,
  },
  {
    id: "custom-name-painting",
    name: "Custom Name Painting",
    category: "paintings",
    categoryLabel: "Paintings & Artworks",
    price: 1650,
    description:
      "Your name, hand-lettered and framed with pressed florals — a piece made for one person only.",
    materials: "Cotton canvas, acrylics, pressed flowers, wooden frame",
    customisable: true,
    featured: true,
    newest: 6,
    image: paintings,
  },
  {
    id: "handmade-rakhi",
    name: "Handmade Rakhi Set",
    category: "rakhis",
    categoryLabel: "Rakhis & Rakhi Gifts",
    price: 350,
    description:
      "A pair of pearl-and-thread rakhis, finished by hand and packed with a handwritten note.",
    materials: "Silk thread, pearls, beads, kundan detail",
    customisable: true,
    featured: true,
    newest: 5,
    image: rakhi,
  },
  {
    id: "pipe-cleaner-bouquet",
    name: "Pipe Cleaner Flower Bouquet",
    category: "pipe-cleaner",
    categoryLabel: "Pipe Cleaner Crafts",
    price: 690,
    description:
      "Soft, fuzzy blooms twisted by hand into a cheerful little bouquet — a favourite with younger hearts.",
    materials: "Pipe cleaners, ceramic vase (optional)",
    customisable: true,
    featured: true,
    newest: 4,
    image: pipecleaner,
  },
  {
    id: "custom-gift-box",
    name: "Custom Gift Box",
    category: "gifts",
    categoryLabel: "Customised Gifts",
    price: 1990,
    description:
      "A curated hamper of handmade pieces, dried flowers and a personalised tag, wrapped just for the occasion.",
    materials: "Kraft box, dried flowers, satin ribbon, handmade pieces",
    customisable: true,
    featured: true,
    newest: 9,
    image: gifts,
  },
  {
    id: "dried-flower-bouquet",
    name: "Everlasting Blush Bouquet",
    category: "flowers",
    categoryLabel: "Flowers & Bouquets",
    price: 1450,
    description:
      "Handpicked dried and handmade blooms in dusty rose and lavender, arranged and wrapped by hand.",
    materials: "Dried flowers, handmade petals, paper wrap",
    customisable: false,
    featured: false,
    newest: 3,
    image: flowers,
  },
  {
    id: "watercolour-floral-print",
    name: "Watercolour Floral Study",
    category: "paintings",
    categoryLabel: "Paintings & Artworks",
    price: 950,
    description:
      "An original small-format watercolour on cotton paper — soft washes of peach and rose.",
    materials: "300gsm cotton paper, watercolour",
    customisable: false,
    featured: false,
    newest: 2,
    image: paintings,
  },
  {
    id: "craft-kit",
    name: "Little Makers Craft Kit",
    category: "custom",
    categoryLabel: "Creative Art & Crafts",
    price: 780,
    description:
      "Everything needed for an afternoon of making — ribbons, petals, paints and a simple hand-drawn guide.",
    materials: "Assorted craft supplies, illustrated guide",
    customisable: true,
    featured: false,
    newest: 1,
    image: crafts,
  },
  {
    id: "crochet-keychain",
    name: "Crochet Blossom Keyring",
    category: "crochet",
    categoryLabel: "Crochet Creations",
    price: 260,
    description:
      "A tiny crocheted flower that rides along in your pocket — a small, everyday piece of handmade.",
    materials: "Cotton yarn, metal ring",
    customisable: true,
    featured: false,
    newest: 10,
    image: crochet,
  },
  {
    id: "rakhi-hamper",
    name: "Rakhi Gift Hamper",
    categoryLabel: "Rakhis & Rakhi Gifts",
    category: "rakhis",
    price: 1590,
    description:
      "Two handmade rakhis, a crochet keepsake, sweets box space and a hand-lettered card in one warm bundle.",
    materials: "Handmade rakhis, crochet piece, kraft box",
    customisable: true,
    featured: false,
    newest: 11,
    image: rakhi,
  },
  {
    id: "flower-frame",
    name: "Pressed Flower Frame",
    category: "flowers",
    categoryLabel: "Flowers & Bouquets",
    price: 1120,
    description:
      "Real pressed blooms arranged behind glass — quiet, botanical and made to hang anywhere warm.",
    materials: "Pressed flowers, glass, wooden frame",
    customisable: true,
    featured: false,
    newest: 12,
    image: flowers,
  },
];

export const shopFilters = [
  { slug: "all", label: "All" },
  { slug: "crochet", label: "Crochet" },
  { slug: "paintings", label: "Paintings" },
  { slug: "flowers", label: "Flowers" },
  { slug: "accessories", label: "Accessories" },
  { slug: "rakhis", label: "Rakhis" },
  { slug: "pipe-cleaner", label: "Pipe Cleaner Crafts" },
  { slug: "gifts", label: "Gifts" },
  { slug: "custom", label: "Custom Creations" },
];

export type Review = {
  name: string;
  occasion?: string;
  rating: number;
  text: string;
};

export const reviews: Review[] = [
  {
    name: "Ananya R.",
    occasion: "Birthday gift",
    rating: 5,
    text: "Absolutely loved the handmade bouquet. The details were beautiful and it felt so personal.",
  },
  {
    name: "Meera S.",
    occasion: "Raksha Bandhan",
    rating: 5,
    text: "Such a beautiful gift! You can really see the effort and love behind the work.",
  },
  {
    name: "Kabir J.",
    occasion: "Anniversary",
    rating: 5,
    text: "Everything looked even better in person. Beautifully crafted and thoughtfully packed.",
  },
  {
    name: "Ritika P.",
    occasion: "Home décor",
    rating: 5,
    text: "The pressed flower frame is now the first thing guests notice in our living room. Truly special.",
  },
  {
    name: "Sanya M.",
    occasion: "Custom order",
    rating: 5,
    text: "I described a colour palette and an idea, and what arrived was somehow even better than I imagined.",
  },
  {
    name: "Devika N.",
    occasion: "Just because",
    rating: 5,
    text: "Ordered the crochet keyring on a whim and ended up buying six more as little gifts for friends.",
  },
];

export const occasions = [
  "Birthdays",
  "Anniversaries",
  "Raksha Bandhan",
  "Graduations",
  "Festivals",
  "Home Décor",
  "Special Celebrations",
  "Just Because",
];

export const faqs = [
  {
    q: "How do I place a custom order?",
    a: "Send us a message through the form on this page or on WhatsApp with your idea, occasion and preferred colours. We'll reply with suggestions, a price and a timeline.",
  },
  {
    q: "How long does a custom order take?",
    a: "Most custom pieces take 5–10 days depending on the size and detail. Larger hampers and paintings may take a little longer — we'll always confirm before starting.",
  },
  {
    q: "Can I request specific colours?",
    a: "Absolutely. Colour palettes are one of our favourite parts. Share a shade, a photo or even a mood and we'll match it as closely as handmade allows.",
  },
  {
    q: "Do you make personalised gifts?",
    a: "Yes — names, dates, initials, favourite flowers and handwritten notes can all be added to most creations.",
  },
  {
    q: "How can I enquire about a product?",
    a: "Open any product in the shop and use 'Enquire Now', or simply message us with the product name. We usually reply the same day.",
  },
];

export const WHATSAPP_URL = "https://wa.me/6306964389";
export const INSTAGRAM_URL = "https://instagram.com/shirasstrokes";
export const FACEBOOK_URL = "https://facebook.com/shirasstrokes";
export const EMAIL = "kashfiqureshi@gmail.com";

export const formatPrice = (value: number) => `₹${value.toLocaleString("en-IN")}`;
