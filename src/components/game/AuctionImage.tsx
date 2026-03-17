"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";

interface AuctionImageProps {
  imageUrl: string | null | undefined;
  alt: string;
  className?: string;
  proxyUrl: string;
}

/**
 * Renders an auction item image.
 * For full URLs: tries direct first (CDNs allow embedding), falls back to proxy on error.
 * For path-based: uses proxy only.
 */
export default function AuctionImage({
  imageUrl,
  alt,
  className = "",
  proxyUrl,
}: AuctionImageProps) {
  const [useFallback, setUseFallback] = useState(false);
  const [errored, setErrored] = useState(false);

  const isFullUrl = typeof imageUrl === "string" && imageUrl.startsWith("http");
  const primaryUrl = isFullUrl ? imageUrl : proxyUrl;
  const fallbackUrl = isFullUrl ? proxyUrl : null;

  if (!imageUrl && !proxyUrl) {
    return (
      <div className={`flex items-center justify-center bg-[#0A0A0F] ${className}`}>
        <ImageIcon size={48} className="text-[#2A2A40]" />
      </div>
    );
  }

  const src = useFallback && fallbackUrl ? fallbackUrl : primaryUrl;

  return (
    <>
      {!errored ? (
        <img
          src={src}
          alt={alt}
          className={className}
          loading="lazy"
          onError={() => {
            if (!useFallback && fallbackUrl) {
              setUseFallback(true);
            } else {
              setErrored(true);
            }
          }}
        />
      ) : (
        <div className={`flex items-center justify-center bg-[#0A0A0F] ${className}`}>
          <ImageIcon size={48} className="text-[#2A2A40]" />
        </div>
      )}
    </>
  );
}
