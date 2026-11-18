"use client";

import Image from "next/image";
import { LoaderCircle, PartyPopper } from "lucide-react";
import { useState } from "react";

type PageFestivalImageProps = {
  src?: string | null;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  loading?: "eager" | "lazy";
  sizes?: string;
  className?: string;
};

export default function PageFestivalImage({
  src,
  alt,
  fill = false,
  width,
  height,
  loading,
  sizes,
  className,
}: PageFestivalImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);

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

  const loaded = loadedSrc === src;

  return (
    <span
      className={
        fill ? "absolute inset-0" : "relative block overflow-hidden rounded-xl"
      }
    >
      {!loaded && (
        <span
          className="absolute inset-0 grid place-items-center bg-blue-50"
          aria-label={`${alt} 불러오는 중`}
          role="status"
        >
          <LoaderCircle
            className="size-8 animate-spin text-blue-500 motion-reduce:animate-none"
            strokeWidth={1.75}
            aria-hidden="true"
          />
        </span>
      )}
      <Image
        src={src}
        alt={alt}
        fill={fill || undefined}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        loading={loading}
        sizes={sizes}
        unoptimized
        className={`${className ?? ""} transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setLoadedSrc(src)}
        onError={() => setFailedSrc(src)}
      />
    </span>
  );
}
