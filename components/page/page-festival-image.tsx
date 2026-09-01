"use client";

import Image from "next/image";
import { PartyPopper } from "lucide-react";
import { useState } from "react";

type PageFestivalImageProps = {
  src?: string | null;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  className?: string;
};

export default function PageFestivalImage({
  src,
  alt,
  fill = false,
  width,
  height,
  priority,
  sizes,
  className,
}: PageFestivalImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (!src || failedSrc === src) {
    return (
      <div
        className={
          fill
            ? "absolute inset-0 grid place-items-center bg-blue-50"
            : "grid aspect-3/4 w-full place-items-center rounded-xl bg-blue-50"
        }
        role="img"
        aria-label={`${alt} 없음`}
      >
        <PartyPopper
          className="size-10 text-blue-400"
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill || undefined}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      priority={priority}
      sizes={sizes}
      className={className}
      onError={() => setFailedSrc(src)}
    />
  );
}
