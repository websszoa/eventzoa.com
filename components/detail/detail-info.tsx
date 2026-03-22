import type { Event } from "@/lib/types";
import { formatDateRange, getEventDuration } from "@/lib/utils";
import {
  Calendar,
  MapPin,
  Tag,
  Users,
  PartyPopper,
  Clock,
  Building2,
  Phone,
  Mail,
} from "lucide-react";

export default function DetailInfo({ event }: { event: Event }) {
  const dateRange = formatDateRange(event.event_start_at, event.event_end_at);
  const duration = getEventDuration(event.event_start_at, event.event_end_at);

  const rows = [
    {
      icon: <Calendar className="h-4 w-4 text-blue-500 shrink-0" />,
      label: "행사 기간",
      value: dateRange,
      extra: duration ? <span className="ml-1">({duration})</span> : null,
    },
    {
      icon: <MapPin className="h-4 w-4 text-pink-500 shrink-0" />,
      label: "장소",
      value: [event.region, event.location?.place].filter(Boolean).join(" · "),
    },
    {
      icon: <Tag className="h-4 w-4 text-indigo-500 shrink-0" />,
      label: "유형",
      value: event.event_type,
    },
    {
      icon: <Users className="h-4 w-4 text-green-500 shrink-0" />,
      label: "규모",
      value: event.event_scale
        ? `${event.event_scale.toLocaleString()}명`
        : null,
    },
    {
      icon: <PartyPopper className="h-4 w-4 text-rose-500 shrink-0" />,
      label: "프로그램",
      value: event.event_program,
    },
    {
      icon: <Building2 className="h-4 w-4 text-indigo-400 shrink-0" />,
      label: "주최",
      value: event.hosts?.organizer,
    },
    {
      icon: <Building2 className="h-4 w-4 text-blue-400 shrink-0" />,
      label: "주관",
      value: event.hosts?.manage,
    },
    {
      icon: <Phone className="h-4 w-4 text-amber-500 shrink-0" />,
      label: "전화",
      value: event.hosts?.phone,
    },
    {
      icon: <Mail className="h-4 w-4 text-purple-500 shrink-0" />,
      label: "이메일",
      value: event.hosts?.email,
    },
  ].filter(({ value }) => Boolean(value));

  return (
    <div className="detail__info h-full border border-gray-200 rounded-2xl p-5">
      <h3 className="flex items-center gap-2 font-paperlogy font-semibold text-lg mb-4">
        <Clock className="w-5 h-5 text-brand shrink-0" />
        이벤트 정보
      </h3>

      <ul className="space-y-3 font-anyvid text-sm">
        {rows.map(({ icon, label, value, extra }) => (
          <li key={label} className="flex items-start gap-3">
            <span className="mt-0.5">{icon}</span>
            <span className="w-16 shrink-0 text-muted-foreground">{label}</span>
            <span className="flex-1 text-slate-800 break-keep">
              {value}
              {extra}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
