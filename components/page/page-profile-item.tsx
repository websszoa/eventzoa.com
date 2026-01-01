"use client";

import { Separator } from "@/components/ui/separator";
import { formatDate, getDisplayName } from "@/lib/utils";
import { Mail, UserIcon, Calendar, Shield } from "lucide-react";
import type { User } from "@supabase/supabase-js";

interface PageProfileItemProps {
  user: User;
}

export default function PageProfileItem({ user }: PageProfileItemProps) {
  const userMetadata = user.user_metadata;
  const displayName = getDisplayName(userMetadata, "이름 없음");
  const email = user.email || "이메일 없음";
  const createdAt = user.created_at
    ? formatDate(user.created_at)
    : "알 수 없음";
  const isEmailConfirmed = user.email_confirmed_at
    ? "이메일 인증 완료"
    : "이메일 인증 필요";

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
          <UserIcon className="w-5 h-5 text-orange-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground font-nanumNeo mb-1">
            이름
          </p>
          <p className="text-sm font-nanumNeo text-gray-900">{displayName}</p>
        </div>
      </div>

      <Separator />

      <div className="flex items-start gap-4">
        <div className="shrink-0 w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
          <Mail className="w-5 h-5 text-red-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground font-nanumNeo mb-1">
            이메일
          </p>
          <p className="text-sm font-nanumNeo text-gray-900 break-all">
            {email}
          </p>
        </div>
      </div>

      <Separator />

      <div className="flex items-start gap-4">
        <div className="shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
          <Calendar className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground font-nanumNeo mb-1">
            가입일
          </p>
          <p className="text-sm font-nanumNeo text-gray-900">{createdAt}</p>
        </div>
      </div>

      <Separator />

      <div className="flex items-start gap-4">
        <div className="shrink-0 w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
          <Shield className="w-5 h-5 text-purple-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground font-nanumNeo mb-1">
            이메일 인증
          </p>
          <p className="text-sm font-nanumNeo text-gray-900">
            {isEmailConfirmed}
          </p>
        </div>
      </div>
    </div>
  );
}
