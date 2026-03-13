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
 * Renders an auction item image. Tries proxy first, falls back to direct URL on error.
 */
export default function AuctionImage({
  imageUrl,
  alt,
  className = "",
  proxyUrl,
}: AuctionImageProps) {
  const [useDirect, setUseDirect] = useState(false);
  const [errored, setErrored] = useState(false);

  if (!imageUrl || !proxyUrl) {
    return (
      <div className={`flex items-center justify-center bg-[#0A0A0F] ${className}`}>
        <ImageIcon size={48} className="text-[#2A2A40]" />
      </div>
    );
  }

  const src = useDirect ? imageUrl : proxyUrl;

  return (
    <>
      {!errored ? (
        <img
          src={src}
          alt={alt}
          className={className}
          loading="lazy"
          onError={() => {
            if (!useDirect) {
              setUseDirect(true);
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
