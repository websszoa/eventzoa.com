export default function Loading() {
  return (
    <section className="min-h-[70vh] bg-slate-50 px-4 py-16" aria-label="페이지를 불러오는 중" aria-live="polite">
      <div className="container">
        <div className="animate-pulse">
          <div className="h-5 w-28 rounded-full bg-blue-100" />
          <div className="mt-4 h-12 max-w-xl rounded-2xl bg-slate-200" />
          <div className="mt-3 h-5 max-w-md rounded-lg bg-slate-200" />
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
                <div className="h-56 bg-slate-200" />
                <div className="space-y-4 p-6">
                  <div className="h-4 w-24 rounded bg-blue-100" />
                  <div className="h-7 w-4/5 rounded-lg bg-slate-200" />
                  <div className="h-4 w-full rounded bg-slate-100" />
                  <div className="h-4 w-2/3 rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <span className="sr-only">페이지를 불러오고 있습니다.</span>
      </div>
    </section>
  );
}
