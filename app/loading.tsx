import { LoaderCircle, PartyPopper } from "lucide-react";

export default function Loading() {
  return (
    <section
      className="grid min-h-[40vh] place-items-center px-4 py-12"
      aria-label="페이지를 불러오는 중"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center text-center" role="status">
        <div className="relative grid size-14 place-items-center rounded-2xl bg-blue-50 ring-1 ring-blue-100">
          <LoaderCircle
            className="absolute size-11 animate-spin text-blue-200 motion-reduce:animate-none"
            strokeWidth={1.25}
            aria-hidden="true"
          />
          <PartyPopper
            className="size-5 text-blue-600"
            strokeWidth={1.75}
            aria-hidden="true"
          />
        </div>
        <p className="mt-3 text-xs font-bold text-slate-500">
          불러오는 중...
        </p>
      </div>
    </section>
  );
}
