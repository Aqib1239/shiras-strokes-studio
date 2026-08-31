"use client";

import Image, { type StaticImageData } from "next/image";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";

type ImageWithLoaderProps = {
  src: string | StaticImageData;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  width?: number;
  height?: number;
};

export default function ImageWithLoader({
  src,
  alt,
  className = "",
  sizes = "100vw",
  priority = false,
  width,
  height,
}: ImageWithLoaderProps) {
  const [loading, setLoading] = useState(true);

  return (
    <div className="relative h-full w-full">
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-secondary/30">
          <LoaderCircle
            className="h-6 w-6 animate-spin text-muted-foreground"
            strokeWidth={1.8}
          />
        </div>
      )}

      <Image
        src={src}
        alt={alt}
        {...(width && height
          ? {
              width,
              height,
            }
          : {
              fill: true,
            })}
        priority={priority}
        sizes={sizes}
        onLoad={() => setLoading(false)}
        onError={() => setLoading(false)}
        className={`
          object-cover
          transition-opacity
          duration-500
          ${loading ? "opacity-0" : "opacity-100"}
          ${className}
        `}
      />
    </div>
  );
}