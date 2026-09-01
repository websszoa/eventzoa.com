"use client";

import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type PageMemberAvatarProps = {
  src?: string | null;
  fallbackSrc?: string;
  name: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
};

export default function PageMemberAvatar({
  src,
  fallbackSrc = "/face/face01.webp",
  name,
  alt,
  className,
  fallbackClassName,
}: PageMemberAvatarProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const remoteImage = src && failedSrc !== src ? src : null;
  const imageSrc = remoteImage || fallbackSrc;

  return (
    <Avatar className={className}>
      <AvatarImage
        src={imageSrc}
        alt={alt}
        referrerPolicy="no-referrer"
        onError={() => {
          if (remoteImage) setFailedSrc(remoteImage);
        }}
      />
      <AvatarFallback className={fallbackClassName}>
        {name.trim().slice(0, 1) || "이"}
      </AvatarFallback>
    </Avatar>
  );
}
