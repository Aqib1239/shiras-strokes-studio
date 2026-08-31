export const getWhatsAppNumber = (): string => {
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_WHATSAPP_NUMBER) {
    return process.env.NEXT_PUBLIC_WHATSAPP_NUMBER.replace(/\D/g, "");
  }
  return "919000000000";
};

export const getWhatsAppEnquiryUrl = (productName: string, price?: number): string => {
  const num = getWhatsAppNumber();
  const priceText = price ? ` (₹${price.toLocaleString("en-IN")})` : "";
  const text = `Hi Shira's Strokes! 🌸\n\nI am interested in "${productName}"${priceText}.\n\nCould you please share details on availability, customisation options, and delivery timeline?`;
  return `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
};

export const getWhatsAppCustomOrderUrl = (notes?: string): string => {
  const num = getWhatsAppNumber();
  const text = `Hi Shira's Strokes! ✨\n\nI'd like to request a Custom Order.\n\n• Occasion / Person:\n• Preferred item (Crochet/Painting/Bouquet/Rakhi/Gifts):\n• Colours / Theme:\n• Needed by date:\n\n${notes ? `Notes: ${notes}` : "Looking forward to creating something beautiful together!"}`;
  return `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
};

export const getWhatsAppReviewUrl = (): string => {
  const num = getWhatsAppNumber();
  const text = `Hi Shira's Strokes! 💖\n\nI'd love to share my experience with my handmade piece:\n\n• Name:\n• Rating (1 to 5 Stars):\n• Occasion / Item:\n• My Review:\n\n(Attaching a photo of my handmade creation!)`;
  return `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
};

export const getWhatsAppGeneralUrl = (): string => {
  const num = getWhatsAppNumber();
  const text = `Hi Shira's Strokes! I'd love to know more about your handmade creations.`;
  return `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
};
