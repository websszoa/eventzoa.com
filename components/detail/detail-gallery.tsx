import Image from "next/image";
import { Fan } from "lucide-react";
import type { Event } from "@/lib/types";
import { APP_SITE_IMAGE_URL } from "@/lib/constants";

export default function DetailGallery({ event }: { event: Event }) {
  const coverImages = (event.images?.cover ?? []).map(
    (filename) => `${APP_SITE_IMAGE_URL}${filename}`,
  );

  return (
    <div className="detail__gallery h-full border border-gray-200 rounded-2xl overflow-hidden">
      {coverImages.length > 0 ? (
        <div className="flex flex-col gap-0 p-4">
          {coverImages.map((src, i) => (
            <div key={i} className="relative w-full bg-gray-100">
              <Image
                src={src}
                alt={`${event.name} 이미지 ${i + 1}`}
                width={800}
                height={600}
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="w-full h-auto rounded-lg object-cover"
                priority={i === 0}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-full items-center justify-center bg-gray-50 text-gray-300">
          <Fan className="h-12 w-12 animate-spin" style={{ animationDuration: "3s" }} />
        </div>
      )}
    </div>
  );
}
