import MainFeaturedEvents from "@/components/main/main-featured-events";
import MainHero from "@/components/main/main-hero";
import MainNewsletterCta from "@/components/main/main-newsletter-cta";
import MainOngoingEvents from "@/components/main/main-ongoing-events";
import MainRegionEvents from "@/components/main/main-region-events";
import MainThemeLinks from "@/components/main/main-theme-links";
import MainUpcomingTimeline from "@/components/main/main-upcoming-timeline";

export default function Home() {
  return (
    <div className="bg-slate-50 text-slate-800">
      <MainHero />
      <MainFeaturedEvents />
      <MainThemeLinks />
      <MainOngoingEvents />
      <MainUpcomingTimeline />
      <MainRegionEvents />
      <MainNewsletterCta />
    </div>
  );
}
