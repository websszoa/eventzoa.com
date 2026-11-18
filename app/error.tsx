"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="grid min-h-[70vh] place-items-center bg-slate-50 px-4 py-16">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white px-6 py-12 text-center sm:px-12 sm:py-16">
        <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-red-50 text-red-500 ring-1 ring-red-100">
          <AlertTriangle className="size-8" aria-hidden="true" />
        </div>
        <p className="mt-6 text-sm font-bold tracking-widest text-blue-600 uppercase">
          Something went wrong
        </p>
        <h1 className="mt-2 font-cafe24 text-4xl font-bold text-slate-950 sm:text-5xl">
          페이지를 불러오지 못했어요
        </h1>
        <p className="mx-auto mt-4 max-w-md font-anyvid text-sm leading-7 text-slate-500 break-keep sm:text-base">
          일시적인 오류가 발생했습니다. 잠시 후 다시 시도하거나 홈으로 이동해 주세요.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button type="button" size="lg" onClick={retry} className="rounded-full bg-blue-600 px-6 font-bold text-white hover:bg-blue-700">
            <RotateCcw className="size-4" aria-hidden="true" />
            다시 시도
          </Button>
          <Button variant="outline" size="lg" nativeButton={false} render={<Link href="/" />} className="rounded-full border-slate-200 px-6 font-bold text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">
            <Home className="size-4" aria-hidden="true" />
            홈으로 이동
          </Button>
        </div>
      </div>
    </section>
  );
}
