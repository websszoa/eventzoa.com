"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Script from "next/script";
import { MapPin } from "lucide-react";
import type { Event } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

declare global {
  interface Window {
    naver: any;
  }
}

export default function DetailMap({
  event,
  clientId,
}: {
  event: Event;
  clientId: string | undefined;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const lat = event.location?.lat;
  const lng = event.location?.lng;
  const place = [event.region, event.location?.place]
    .filter(Boolean)
    .join(" · ");

  const initMap = () => {
    if (!mapRef.current || !window.naver?.maps || !lat || !lng) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.destroy();
      mapInstanceRef.current = null;
    }

    const center = new window.naver.maps.LatLng(lat, lng);

    const map = new window.naver.maps.Map(mapRef.current, {
      center,
      zoom: 15,
    });

    mapInstanceRef.current = map;

    new window.naver.maps.Marker({
      position: center,
      map,
      title: place,
      icon: {
        content: `
          <div style="position:relative;width:44px;height:54px;">
            <div style="
              position:absolute;width:40px;height:40px;
              background:white;border:3px solid #0048ef;
              border-radius:50% 50% 50% 0;transform:rotate(-45deg);
              box-shadow:0 2px 8px rgba(0,0,0,0.25);
              display:flex;align-items:center;justify-content:center;
            ">
              <img
                src="/icons/icon192.png"
                style="width:22px;height:22px;transform:rotate(45deg);border-radius:50%;object-fit:cover;"
                alt="marker"
              />
            </div>
          </div>
        `,
        anchor: new window.naver.maps.Point(20, 54),
      },
    });
  };

  useEffect(() => {
    if (window.naver?.maps && mapRef.current) {
      initMap();
    } else if (mapLoaded) {
      initMap();
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }
    };
  }, [mapLoaded, lat, lng]);

  return (
    <div className="detail__map h-full border border-gray-200 rounded-2xl overflow-hidden">
      {/* 헤더 */}
      <div className="h-[60px] flex items-center gap-2 px-5 py-4 border-b border-gray-100">
        <MapPin className="w-5 h-5 text-brand shrink-0" />
        <h3 className="font-paperlogy font-semibold text-lg">행사 위치</h3>
        {place && (
          <span className="hidden md:block text-sm text-muted-foreground font-anyvid truncate">
            {place}
          </span>
        )}
        {lat && lng && (
          <div className="ml-auto shrink-0">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  asChild
                >
                  <a
                    href={`https://map.naver.com/v5/search/${encodeURIComponent(event.location?.place || "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src="/map/navermap.webp"
                      alt="네이버 지도"
                      width={25}
                      height={25}
                      className="rounded"
                    />
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-anyvid">네이버 지도에서 보기</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>

      {/* 지도 영역 */}
      {lat && lng && clientId ? (
        <>
          <Script
            src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`}
            strategy="afterInteractive"
            onLoad={() => setMapLoaded(true)}
          />
          <div className="relative">
            <div ref={mapRef} className="w-full h-[320px] bg-gray-100" />
            <div className="absolute top-3 left-3 bg-white rounded-xl shadow-md px-3 py-2 flex flex-col gap-2">
              <span className="text-[11px] font-anyvid font-semibold text-gray-500 text-center">길찾기</span>
              <div className="flex items-center gap-2">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1 hover:opacity-75 transition-opacity"
                >
                  <Image src="/map/googlemaps.webp" alt="Google Maps" width={28} height={28} className="rounded" />
                  <span className="text-[10px] font-anyvid text-gray-500 leading-none">구글</span>
                </a>
                <a
                  href={`https://tmap.co.kr/tmap2/mobile/route.jsp?goalx=${lng}&goaly=${lat}&goalname=${encodeURIComponent(event.location?.place || "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1 hover:opacity-75 transition-opacity"
                >
                  <Image src="/map/tmap.webp" alt="T맵" width={28} height={28} className="rounded" />
                  <span className="text-[10px] font-anyvid text-gray-500 leading-none">티맵</span>
                </a>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-[320px] bg-gray-50 text-muted-foreground gap-2">
          <MapPin className="h-10 w-10 text-gray-300" />
          <p className="text-sm font-anyvid">
            {!clientId
              ? "지도 API 키가 설정되지 않았습니다."
              : "위치 정보가 없습니다."}
          </p>
          {place && (
            <p className="text-xs font-anyvid text-gray-400">{place}</p>
          )}
        </div>
      )}
    </div>
  );
}
