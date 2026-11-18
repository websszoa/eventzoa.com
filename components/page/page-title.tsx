import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

type PageTitleProps = {
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
};

export default function PageTitle({
  eyebrow,
  title,
  highlight,
  description,
}: PageTitleProps) {
  return (
    <section className="relative overflow-hidden bg-[#071b3b] pt-16 pb-24 text-white">
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(59,130,246,0.35),transparent_35%)]"
        aria-hidden="true"
      />
      <div className="container relative">
        <Badge className="mb-2 h-auto rounded-full bg-blue-500/15 px-3 py-1.5 text-blue-200 hover:bg-blue-500/15">
          <Search className="size-3.5" aria-hidden="true" />
          {eyebrow}
        </Badge>
        <h1 className="max-w-3xl font-cafe24 text-5xl leading-tight font-bold tracking-tight break-keep sm:text-6xl">
          {title}
          <br />
          <span className="text-blue-400">{highlight}</span>
        </h1>
        <p className="mt-5 max-w-2xl font-anyvid text-base leading-7 text-blue-100/65 break-keep">
          {description}
        </p>
      </div>
    </section>
  );
}
