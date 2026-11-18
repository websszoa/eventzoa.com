import MainFeaturedEvents from "@/components/main/main-featured-events";
import MainHero from "@/components/main/main-hero";
import MainRegionEvents from "@/components/main/main-region-events";

export default function Home() {
  return (
    <div className="bg-slate-50 text-slate-800">
      <MainHero />
      <MainFeaturedEvents />
      <MainRegionEvents />
    </div>
  );
}
