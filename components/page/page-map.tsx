"use client";

import Link from "next/link";
import Script from "next/script";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LocateFixed, MapPin, Search } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type MapFestival = {
  slug: string;
  title: string;
  region: string;
  venue: string;
  startDate: string;
  endDate: string;
  latitude: number;
  longitude: number;
};

type Coordinates = {
  latitude: number;
  longitude: number;
};

function getDistanceInKilometers(from: Coordinates, to: Coordinates) {
  const earthRadius = 6371;
  const toRadians = (degree: number) => (degree * Math.PI) / 180;
  const latitudeDistance = toRadians(to.latitude - from.latitude);
  const longitudeDistance = toRadians(to.longitude - from.longitude);
  const fromLatitude = toRadians(from.latitude);
  const toLatitude = toRadians(to.latitude);
  const value =
    Math.sin(latitudeDistance / 2) ** 2 +
    Math.cos(fromLatitude) *
      Math.cos(toLatitude) *
      Math.sin(longitudeDistance / 2) ** 2;

  return earthRadius * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}

function formatDistance(distance: number) {
  return distance < 1
    ? `${Math.round(distance * 1000)}m`
    : `${distance.toFixed(distance < 10 ? 1 : 0)}km`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export default function PageMap({
  festivals,
  clientId,
}: {
  festivals: MapFestival[];
  clientId?: string;
}) {
  const mapElementRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<naver.maps.Map | null>(null);
  const markersRef = useRef<naver.maps.Marker[]>([]);
  const userMarkerRef = useRef<naver.maps.Marker | null>(null);
  const festivalListRef = useRef<HTMLDivElement>(null);
  const festivalItemRefs = useRef(new Map<string, HTMLAnchorElement>());
  const [mapReady, setMapReady] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [region, setRegion] = useState("전체");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(null);
  const [locationStatus, setLocationStatus] = useState<
    "loading" | "ready" | "unavailable"
  >("loading");

  const requestCurrentLocation = useCallback(() => {
    setLocationStatus("loading");

    if (!("geolocation" in navigator)) {
      queueMicrotask(() => setLocationStatus("unavailable"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setCurrentLocation({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
        setLocationStatus("ready");
      },
      () => setLocationStatus("unavailable"),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    );
  }, []);

  const regions = useMemo(
    () => ["전체", ...Array.from(new Set(festivals.map((item) => item.region))).sort()],
    [festivals],
  );
  const filteredFestivals = useMemo(() => {
    const query = keyword.trim().toLocaleLowerCase("ko-KR");
    const filtered = festivals.filter(
      (festival) =>
        (region === "전체" || festival.region === region) &&
        (!query ||
          festival.title.toLocaleLowerCase("ko-KR").includes(query) ||
          festival.venue.toLocaleLowerCase("ko-KR").includes(query)),
    );

    if (!currentLocation) return filtered;

    return [...filtered].sort(
      (a, b) =>
        getDistanceInKilometers(currentLocation, a) -
        getDistanceInKilometers(currentLocation, b),
    );
  }, [currentLocation, festivals, keyword, region]);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      queueMicrotask(() => setLocationStatus("unavailable"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setCurrentLocation({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
        setLocationStatus("ready");
      },
      () => setLocationStatus("unavailable"),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    );
  }, []);
  const initializeMap = useCallback(() => {
    if (!mapElementRef.current || !window.naver?.maps || mapRef.current) return;

    mapRef.current = new naver.maps.Map(mapElementRef.current, {
      center: new naver.maps.LatLng(36.35, 127.8),
      zoom: 7,
      minZoom: 6,
      zoomControl: true,
      zoomControlOptions: { position: naver.maps.Position.TOP_RIGHT },
    });
    setMapReady(true);
  }, []);

  useEffect(() => {
    if (!mapReady || !mapRef.current) return;

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = filteredFestivals.map((festival) => {
      const marker = new naver.maps.Marker({
        map: mapRef.current!,
        position: new naver.maps.LatLng(festival.latitude, festival.longitude),
        icon: {
          content: `<div class="eventzoa-festival-marker"><span class="eventzoa-festival-marker-dot">축제</span><span class="eventzoa-festival-marker-tooltip">${escapeHtml(festival.title)}</span></div>`,
          anchor: { x: 17, y: 17 },
        },
      });
      naver.maps.Event.addListener(marker, "click", () => {
        setSelectedSlug(festival.slug);
        mapRef.current?.panTo(
          new naver.maps.LatLng(festival.latitude, festival.longitude),
        );
      });
      return marker;
    });
  }, [filteredFestivals, mapReady]);

  useEffect(() => {
    if (!mapReady || !mapRef.current || !currentLocation) return;

    const position = new naver.maps.LatLng(
      currentLocation.latitude,
      currentLocation.longitude,
    );
    mapRef.current.panTo(position);
    mapRef.current.setZoom(11);

    userMarkerRef.current?.setMap(null);
    userMarkerRef.current = new naver.maps.Marker({
      map: mapRef.current,
      position,
      title: "내 위치",
      icon: {
        content:
          '<div class="eventzoa-current-location" aria-label="내 위치"><span class="eventzoa-current-location-pulse"></span><span class="eventzoa-current-location-dot"></span></div>',
        anchor: { x: 18, y: 18 },
      },
    });
  }, [currentLocation, mapReady]);

  useEffect(() => {
    if (!selectedSlug) return;

    const list = festivalListRef.current;
    const item = festivalItemRefs.current.get(selectedSlug);
    if (!list || !item) return;

    const listRect = list.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const isVisible =
      itemRect.top >= listRect.top && itemRect.bottom <= listRect.bottom;

    if (!isVisible) {
      list.scrollTo({
        top: item.offsetTop - list.clientHeight / 2 + item.clientHeight / 2,
        behavior: "smooth",
      });
    }
  }, [selectedSlug]);

  if (!clientId) {
    return (
      <section className="grid min-h-150 place-items-center bg-slate-100 px-6 text-center">
        <div>
          <MapPin className="mx-auto size-10 text-slate-400" aria-hidden="true" />
          <h2 className="mt-4 font-cafe24 text-2xl font-bold text-slate-950">
            지도 API 설정이 필요합니다
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            NEXT_PUBLIC_NAVER_MAP_CLIENT_ID 환경변수를 확인해 주세요.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[calc(100svh-160px)] min-h-175 overflow-hidden border-y border-slate-200 bg-slate-100">
      <Script
        id="naver-maps-sdk"
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`}
        strategy="afterInteractive"
        onReady={initializeMap}
        onLoad={initializeMap}
      />
      <div ref={mapElementRef} className="h-full w-full" aria-label="전국 축제 지도" />

      <div className="pointer-events-none absolute inset-0">
        <div className="relative h-full p-3 sm:p-5">
          <aside className="pointer-events-auto flex max-h-full w-full max-w-95 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white sm:w-95">
            <div className="border-b border-slate-200 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold text-blue-600">전국 축제 지도</p>
                  <h2 className="mt-1 font-cafe24 text-2xl font-bold text-slate-950">
                    축제 {filteredFestivals.length}개
                  </h2>
                  <p className="mt-1 text-xs text-slate-400">
                    {locationStatus === "loading"
                      ? "현재 위치를 확인하고 있습니다"
                      : locationStatus === "ready"
                        ? "내 위치에서 가까운 순"
                        : "위치 권한 허용 시 가까운 순으로 표시됩니다"}
                  </p>
                </div>
                <div className="grid size-10 place-items-center rounded-xl bg-blue-50 text-blue-600">
                  <MapPin className="size-5" aria-hidden="true" />
                </div>
              </div>
              <div className="relative mt-5">
                <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  placeholder="축제명 또는 장소 검색"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pr-4 pl-10 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500"
                />
              </div>
              <Select
                value={region}
                onValueChange={(value) => setRegion(value ?? "전체")}
              >
                <SelectTrigger className="mt-3 h-11! w-full rounded-xl bg-white px-4">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item === "전체" ? "전체 지역" : item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div
              ref={festivalListRef}
              className="min-h-0 flex-1 divide-y divide-slate-100 overflow-y-auto"
            >
              {filteredFestivals.map((festival) => (
                <Link
                  key={festival.slug}
                  href={`/festivals/${festival.slug}`}
                  ref={(element) => {
                    if (element) {
                      festivalItemRefs.current.set(festival.slug, element);
                    } else {
                      festivalItemRefs.current.delete(festival.slug);
                    }
                  }}
                  aria-current={selectedSlug === festival.slug ? "true" : undefined}
                  className={`relative block w-full px-5 py-4 text-left transition-colors hover:bg-blue-50 ${selectedSlug === festival.slug ? "bg-blue-50 before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-blue-600" : "bg-white"}`}
                >
                  <span className="text-xs font-bold text-blue-600">{festival.region}</span>
                  {currentLocation && (
                    <span className="ml-2 text-xs font-bold text-slate-400">
                      {formatDistance(
                        getDistanceInKilometers(currentLocation, festival),
                      )}
                    </span>
                  )}
                  <strong className="mt-1 block break-keep font-cafe24 text-lg text-slate-950">
                    {festival.title}
                  </strong>
                  <span className="mt-1 block truncate text-xs text-slate-500">
                    {festival.venue}
                  </span>
                </Link>
              ))}
            </div>
          </aside>

          <button
            type="button"
            onClick={requestCurrentLocation}
            disabled={locationStatus === "loading"}
            className="pointer-events-auto absolute right-4 bottom-6 inline-flex h-12 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-wait disabled:text-slate-400 sm:right-6"
            aria-label="내 위치로 이동"
          >
            <LocateFixed
              className={`size-5 ${locationStatus === "loading" ? "animate-pulse" : ""}`}
              aria-hidden="true"
            />
            <span>내 위치</span>
          </button>

        </div>
      </div>
    </section>
  );
}
