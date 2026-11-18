import Link from "next/link";
import { CalendarDays, Home, SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="grid min-h-[70vh] place-items-center bg-slate-50 px-4 py-16">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white px-6 py-12 text-center sm:px-12 sm:py-16">
        <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
          <SearchX className="size-8" aria-hidden="true" />
        </div>
        <p className="mt-6 text-sm font-black tracking-[0.2em] text-blue-600">404</p>
        <h1 className="mt-2 font-cafe24 text-4xl font-bold text-slate-950 sm:text-5xl">
          찾으시는 페이지가 없어요
        </h1>
        <p className="mx-auto mt-4 max-w-md font-anyvid text-sm leading-7 text-slate-500 break-keep sm:text-base">
          주소가 변경되었거나 삭제된 페이지입니다. 홈으로 돌아가거나 다른 축제를 둘러보세요.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button size="lg" nativeButton={false} render={<Link href="/" />} className="rounded-full bg-blue-600 px-6 font-bold text-white hover:bg-blue-700">
            <Home className="size-4" aria-hidden="true" />
            홈으로 이동
          </Button>
          <Button variant="outline" size="lg" nativeButton={false} render={<Link href="/festivals" />} className="rounded-full border-slate-200 px-6 font-bold text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">
            <CalendarDays className="size-4" aria-hidden="true" />
            축제 둘러보기
          </Button>
        </div>
      </div>
    </section>
  );
}
