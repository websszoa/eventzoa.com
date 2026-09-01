import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Building2,
  AtSign,
  ExternalLink,
  Handshake,
  Mail,
  Phone,
  Users,
} from "lucide-react";

type PageFestivalOrganizerProps = {
  organizer?: string | null;
  manager?: string | null;
  sponsor?: string | null;
  phone?: string | null;
  email?: string | null;
  instagram?: string | null;
  site?: string | null;
};

function getInstagramUrl(instagram: string) {
  if (/^https?:\/\//.test(instagram)) return instagram;
  return `https://www.instagram.com/${instagram.replace(/^@/, "")}`;
}

export default function PageFestivalOrganizer({
  organizer,
  manager,
  sponsor,
  phone,
  email,
  instagram,
  site,
}: PageFestivalOrganizerProps) {
  const information = [
    {
      icon: Building2,
      label: "주최",
      value: organizer,
      color: "text-blue-600",
    },
    {
      icon: Users,
      label: "주관",
      value: manager,
      color: "text-emerald-600",
    },
    {
      icon: Handshake,
      label: "스폰서",
      value: sponsor,
      color: "text-amber-600",
    },
  ].filter((item): item is typeof item & { value: string } =>
    Boolean(item.value),
  );

  if (information.length === 0 && !phone && !email && !instagram && !site) {
    return null;
  }

  return (
    <section className="overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200">
      <div className="border-b border-slate-200 px-6 py-4">
        <h2 className="flex items-center gap-2 font-cafe24 text-2xl text-slate-950">
          <Building2 className="size-5 text-blue-600" aria-hidden="true" />
          주최자 정보
        </h2>
      </div>

      <dl className="divide-y divide-slate-100 px-5">
        {information.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="grid grid-cols-[100px_1fr] gap-3 py-3.5">
            <dt className="flex items-start gap-2 text-sm text-slate-500">
              <Icon
                className={`mt-0.5 size-4 shrink-0 ${color}`}
                aria-hidden="true"
              />
              {label}
            </dt>
            <dd className="break-keep text-sm leading-5 text-slate-800">
              {value}
            </dd>
          </div>
        ))}

        {phone && (
          <div className="grid grid-cols-[100px_1fr] gap-3 py-3.5">
            <dt className="flex items-start gap-2 text-sm text-slate-500">
              <Phone
                className="mt-0.5 size-4 shrink-0 text-cyan-600"
                aria-hidden="true"
              />
              연락처
            </dt>
            <dd className="text-sm leading-5">
              <a
                href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                className="text-slate-800 underline decoration-slate-300 underline-offset-4 hover:text-blue-600"
              >
                {phone}
              </a>
            </dd>
          </div>
        )}

        {email && (
          <div className="grid grid-cols-[100px_1fr] gap-3 py-3.5">
            <dt className="flex items-start gap-2 text-sm text-slate-500">
              <Mail
                className="mt-0.5 size-4 shrink-0 text-rose-500"
                aria-hidden="true"
              />
              이메일
            </dt>
            <dd className="min-w-0 text-sm leading-5">
              <a
                href={`mailto:${email}`}
                className="break-all text-slate-800 underline decoration-slate-300 underline-offset-4 hover:text-blue-600"
              >
                {email}
              </a>
            </dd>
          </div>
        )}

        {instagram && (
          <div className="grid grid-cols-[100px_1fr] gap-3 py-3.5">
            <dt className="flex items-start gap-2 text-sm text-slate-500">
              <AtSign
                className="mt-0.5 size-4 shrink-0 text-violet-600"
                aria-hidden="true"
              />
              인스타그램
            </dt>
            <dd className="min-w-0 text-sm leading-5">
              <a
                href={getInstagramUrl(instagram)}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all text-slate-800 underline decoration-slate-300 underline-offset-4 hover:text-blue-600"
              >
                @
                {instagram.replace(/^@/, "").replace(/^https?:\/\/[^/]+\//, "")}
              </a>
            </dd>
          </div>
        )}
      </dl>

      {site && (
        <div className="border-t border-slate-200 p-5">
          <a
            href={site}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants(),
              "h-11 w-full rounded-full bg-blue-600 text-white hover:bg-blue-500",
            )}
          >
            공식 사이트 바로가기
            <ExternalLink className="size-4" aria-hidden="true" />
          </a>
        </div>
      )}
    </section>
  );
}
