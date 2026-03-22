import Image from "next/image";
import { Fan } from "lucide-react";
import type { Event } from "@/lib/types";

export default function DetailGallery({ event }: { event: Event }) {
  const coverImages = event.images?.cover ?? [];

  return (
    <div className="detail__gallery h-full border border-gray-200 rounded-2xl p-5">
      <h3 className="font-paperlogy font-semibold text-lg mb-4">이벤트 이미지</h3>

      {coverImages.length > 0 ? (
        <div className="grid grid-cols-1 gap-3">
          {coverImages.map((src, i) => (
            <div
              key={i}
              className="relative w-full aspect-[4/3] overflow-hidden rounded-xl bg-gray-100"
            >
              <Image
                src={src}
                alt={`${event.name} 이미지 ${i + 1}`}
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover"
                priority={i === 0}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center aspect-[4/3] rounded-xl bg-gray-50 text-gray-300">
          <Fan className="h-12 w-12" />
        </div>
      )}
    </div>
  );
}
