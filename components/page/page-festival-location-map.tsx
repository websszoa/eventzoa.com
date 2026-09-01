"use client";

import Script from "next/script";
import { Check, Copy, ExternalLink, MapPin } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PageFestivalLocationMapProps = {
  title: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  clientId?: string;
  naverMapUrl: string;
  kakaoMapUrl: string;
};

export default function PageFestivalLocationMap({
  title,
  address,
  latitude,
  longitude,
  clientId,
  naverMapUrl,
  kakaoMapUrl,
}: PageFestivalLocationMapProps) {
  const normalizedAddress = address?.trim() || null;
  const mapElementRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<naver.maps.Map | null>(null);
  const isInitializingRef = useRef(false);
  const [mapError, setMapError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shouldLoadMap, setShouldLoadMap] = useState(false);

  const copyAddress = useCallback(async () => {
    if (!normalizedAddress) return;

    try {
      await navigator.clipboard.writeText(normalizedAddress);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [normalizedAddress]);

  const renderMap = useCallback(
    (position: naver.maps.LatLng) => {
      if (!mapElementRef.current || mapRef.current) return;

      const map = new naver.maps.Map(mapElementRef.current, {
        center: position,
        zoom: 16,
        zoomControl: true,
        zoomControlOptions: {
          position: naver.maps.Position.TOP_RIGHT,
          style: naver.maps.ZoomControlStyle.SMALL,
        },
      });

      new naver.maps.Marker({ map, position, title });
      mapRef.current = map;
    },
    [title],
  );

  const initializeMap = useCallback(async () => {
    if (!window.naver?.maps || mapRef.current || isInitializingRef.current)
      return;

    isInitializingRef.current = true;

    if (latitude !== null && longitude !== null) {
      renderMap(new naver.maps.LatLng(latitude, longitude));
      return;
    }

    try {
      if (!normalizedAddress) throw new Error("Address is unavailable");

      const response = await fetch(
        `/api/maps/geocode?address=${encodeURIComponent(normalizedAddress)}`,
      );
      if (!response.ok) throw new Error("Geocoding failed");

      const location = (await response.json()) as {
        latitude: number;
        longitude: number;
      };
      renderMap(new naver.maps.LatLng(location.latitude, location.longitude));
    } catch {
      setMapError(true);
      isInitializingRef.current = false;
    }
  }, [latitude, longitude, normalizedAddress, renderMap]);

  useEffect(() => {
    if (!clientId || mapError || shouldLoadMap) return;

    const mapElement = mapElementRef.current;
    if (!mapElement || typeof IntersectionObserver === "undefined") {
      setShouldLoadMap(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setShouldLoadMap(true);
        observer.disconnect();
      },
      { rootMargin: "300px 0px" },
    );

    observer.observe(mapElement);
    return () => observer.disconnect();
  }, [clientId, mapError, shouldLoadMap]);

  return (
    <section className="overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200">
      <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="flex items-center gap-2 font-cafe24 text-2xl font-bold text-slate-950">
          <MapPin className="size-5 text-pink-600" aria-hidden="true" />
          오시는 길
        </h2>
        <div className="flex flex-wrap gap-2">
          <a
            href={naverMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "rounded-xl border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
            )}
          >
            네이버 지도
            <ExternalLink className="size-3" aria-hidden="true" />
          </a>
          <a
            href={kakaoMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "rounded-xl",
            )}
          >
            카카오맵
            <ExternalLink className="size-3" aria-hidden="true" />
          </a>
        </div>
      </div>

      {!clientId || mapError ? (
        <div className="grid min-h-80 place-items-center bg-slate-50 px-6 text-center">
          <div>
            <MapPin
              className="mx-auto size-9 text-slate-300"
              aria-hidden="true"
            />
            <p className="mt-3 text-sm text-slate-500">
              {!clientId
                ? "지도 API 설정이 필요합니다."
                : "지도에서 위치를 찾을 수 없습니다."}
            </p>
          </div>
        </div>
      ) : (
        <>
          {shouldLoadMap && (
            <Script
              id="naver-maps-sdk"
              src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}&submodules=geocoder`}
              strategy="afterInteractive"
              onReady={() => void initializeMap()}
              onLoad={() => void initializeMap()}
            />
          )}
          <div
            ref={mapElementRef}
            className="h-80 w-full bg-slate-100 sm:h-96"
            aria-label={`${title} 위치 지도`}
          />
        </>
      )}

      {normalizedAddress && (
        <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <p className="flex min-w-0 items-start gap-2 break-keep text-sm leading-6 text-slate-600">
            <MapPin
              className="mt-1 size-4 shrink-0 text-pink-600"
              aria-hidden="true"
            />
            <span>{normalizedAddress}</span>
          </p>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className="shrink-0 rounded-xl border-none p-2"
            onClick={() => void copyAddress()}
            aria-label={copied ? "주소 복사 완료" : "주소 복사"}
            title={copied ? "복사 완료" : "주소 복사"}
          >
            {copied ? (
              <Check className="size-4 text-emerald-600" aria-hidden="true" />
            ) : (
              <Copy className="size-4" aria-hidden="true" />
            )}
          </Button>
        </div>
      )}
    </section>
  );
}
