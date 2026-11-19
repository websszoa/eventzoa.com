import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Flower2,
  Landmark,
  Moon,
  Music,
  PawPrint,
  Search,
  Sparkles,
  Tags,
  Ticket,
  UtensilsCrossed,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { getFestivalsHref, type FestivalFilters } from "@/lib/festival-filters";

// ④ 테마별 큐레이션: 각 테마는 축제 페이지의 필터 주소로 연결된다.
const themes: {
  label: string;
  description: string;
  emoji: string;
  icon: typeof Ticket;
  filters: Partial<FestivalFilters>;
  iconClassName: string;
}[] = [
  {
    label: "무료 축제",
    description: "부담 없이 즐기는 나들이",
    emoji: "🎟️",
    icon: Ticket,
    filters: { price: "무료" },
    iconClassName: "text-emerald-600",
  },
  {
    label: "불꽃축제",
    description: "밤하늘을 수놓는 순간",
    emoji: "🎆",
    icon: Sparkles,
    filters: { keyword: "불꽃" },
    iconClassName: "text-orange-500",
  },
  {
    label: "꽃축제",
    description: "계절마다 피어나는 풍경",
    emoji: "🌸",
    icon: Flower2,
    filters: { keyword: "꽃" },
    iconClassName: "text-pink-500",
  },
  {
    label: "먹거리 축제",
    description: "지역 특산물과 미식 여행",
    emoji: "🍢",
    icon: UtensilsCrossed,
    filters: { keyword: "먹거리" },
    iconClassName: "text-amber-500",
  },
  {
    label: "야간 축제",
    description: "불빛 가득한 밤 산책",
    emoji: "🌙",
    icon: Moon,
    filters: { keyword: "야간" },
    iconClassName: "text-indigo-600",
  },
  {
    label: "음악·공연",
    description: "무대 위의 생생한 감동",
    emoji: "🎵",
    icon: Music,
    filters: { keyword: "음악" },
    iconClassName: "text-violet-600",
  },
  {
    label: "전통문화",
    description: "역사와 전통을 체험해요",
    emoji: "🏮",
    icon: Landmark,
    filters: { keyword: "전통" },
    iconClassName: "text-sky-600",
  },
  {
    label: "반려동물",
    description: "댕냥이와 함께 가요",
    emoji: "🐶",
    icon: PawPrint,
    filters: { keyword: "반려" },
    iconClassName: "text-teal-600",
  },
];

// 하단 흐르는 띠: 끊김 없이 반복되도록 같은 목록을 두 번 이어 붙인다.
function ThemeMarquee() {
  const items = [...themes, ...themes];

  return (
    <div
      className="relative border-t border-white/15 bg-white/5 py-4"
      aria-hidden="true"
    >
      <div className="main-theme-marquee flex w-max items-center">
        {items.map((theme, index) => (
          <span
            key={`${theme.label}-${index}`}
            className="flex items-center gap-2 px-6 font-cafe24 text-lg whitespace-nowrap text-white/80 sm:text-xl"
          >
            <span className="text-2xl">{theme.emoji}</span>
            {theme.label}
            <span className="ml-6 size-1.5 rounded-full bg-white/40" />
          </span>
        ))}
      </div>
    </div>
  );
}

export default function MainThemeLinks() {
  return (
    <section
      aria-labelledby="main-theme-title"
      className="relative overflow-hidden bg-linear-135 from-indigo-700 via-blue-600 to-sky-500 text-white"
    >
      <div
        className="festival-hero-orb-one absolute -top-28 -right-20 size-80 rounded-full bg-white/10 blur-2xl"
        aria-hidden="true"
      />
      <div
        className="festival-hero-orb-two absolute -bottom-36 left-1/3 size-72 rounded-full bg-pink-300/25 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-size-[36px_36px] opacity-[0.07]"
        aria-hidden="true"
      />

      <div className="relative container py-16 sm:py-20 lg:py-24">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-bold tracking-wide text-white/90 uppercase backdrop-blur-sm">
              <Tags className="size-3.5" aria-hidden="true" />
              Theme Pick
            </p>
            <h2
              id="main-theme-title"
              className="mt-5 font-cafe24 text-4xl leading-tight font-bold tracking-tight break-keep sm:text-5xl"
            >
              오늘은 어떤 축제가
              <br />
              끌리세요?
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 break-keep text-white/75 sm:text-base">
              취향에 맞는 테마를 고르면 딱 맞는 축제만 모아서 보여드려요.
            </p>
          </div>

          <Button
            nativeButton={false}
            render={<Link href="/festivals" />}
            className="h-11 w-fit rounded-full bg-white px-5 font-bold text-blue-700 hover:bg-blue-50"
          >
            <Search className="size-4" aria-hidden="true" />
            조건으로 검색하기
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {themes.map(
            ({
              label,
              description,
              emoji,
              icon: Icon,
              filters,
              iconClassName,
            }) => (
              <li key={label}>
                <Link
                  href={getFestivalsHref(filters)}
                  className="group relative flex h-full min-h-36 flex-col justify-between overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:min-h-40 sm:p-5"
                >
                  <span
                    className="pointer-events-none absolute -right-3 -bottom-4 text-7xl opacity-30 transition-all duration-500 group-hover:-rotate-12 group-hover:opacity-100 sm:text-8xl"
                    aria-hidden="true"
                  >
                    {emoji}
                  </span>

                  <span className="relative flex items-start justify-between">
                    <span
                      className={`grid size-11 place-items-center rounded-2xl bg-white ${iconClassName}`}
                    >
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <ArrowUpRight
                      className="size-5 text-white/50 transition-colors group-hover:text-blue-600"
                      aria-hidden="true"
                    />
                  </span>

                  <span className="relative mt-6 block">
                    <span className="block font-cafe24 text-lg font-bold sm:text-2xl">
                      {label}
                    </span>
                    <span className="mt-0.5 hidden truncate text-sm text-white/70 transition-colors group-hover:text-slate-500 sm:block">
                      {description}
                    </span>
                  </span>
                </Link>
              </li>
            ),
          )}
        </ul>
      </div>

      <ThemeMarquee />
    </section>
  );
}
