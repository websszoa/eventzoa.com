export default function EventTitle() {
  return (
    <div className="event__title">
      <span className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-500/80">
        EventZoa Calendar
      </span>
      <h2 className="py-1 md:py-2 text-2xl font-bold text-slate-900 md:text-3xl">
        원하는 이벤트 일정을 한눈에
      </h2>
      <p className="text-sm text-muted-foreground">
        월별 · 지역별 필터를 활용해 전국 이벤트를 빠르게 찾아보세요.
      </p>
    </div>
  );
}
