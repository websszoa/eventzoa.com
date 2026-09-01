"use client";

import { useState, useTransition } from "react";
import { Check, LoaderCircle } from "lucide-react";

import { updateMember } from "@/app/admin/members/actions";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type MemberRole = "user" | "admin";
type MemberStatus = "active" | "suspended" | "withdrawn";

const roleLabels: Record<MemberRole, string> = {
  user: "일반 사용자",
  admin: "관리자",
};

const statusLabels: Record<MemberStatus, string> = {
  active: "정상",
  suspended: "이용 정지",
  withdrawn: "탈퇴",
};

export default function PageAdminMemberSettings({
  memberId,
  initialRole,
  initialStatus,
  isCurrentAdmin,
}: {
  memberId: string;
  initialRole: MemberRole;
  initialStatus: MemberStatus;
  isCurrentAdmin: boolean;
}) {
  const [role, setRole] = useState(initialRole);
  const [status, setStatus] = useState(initialStatus);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const isUnchanged = role === initialRole && status === initialStatus;

  function handleUpdate() {
    setMessage(null);
    startTransition(async () => {
      const result = await updateMember(memberId, role, status);
      setMessage(result.message);
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-bold text-slate-500">회원 등급</label>
        <Select
          value={role}
          onValueChange={(value) => setRole(value as MemberRole)}
          disabled={isPending || isCurrentAdmin}
        >
          <SelectTrigger className="mt-2 h-11! w-full rounded-xl bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(roleLabels) as MemberRole[]).map((item) => (
              <SelectItem key={item} value={item}>
                {roleLabels[item]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-xs font-bold text-slate-500">계정 상태</label>
        <Select
          value={status}
          onValueChange={(value) => setStatus(value as MemberStatus)}
          disabled={isPending || isCurrentAdmin}
        >
          <SelectTrigger className="mt-2 h-11! w-full rounded-xl bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(statusLabels) as MemberStatus[]).map((item) => (
              <SelectItem key={item} value={item}>
                {statusLabels[item]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        type="button"
        onClick={handleUpdate}
        disabled={isPending || isCurrentAdmin || isUnchanged}
        className="h-11 w-full rounded-xl"
      >
        {isPending ? (
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <Check className="size-4" aria-hidden="true" />
        )}
        {isPending ? "변경 중..." : "설정 저장"}
      </Button>

      {isCurrentAdmin && (
        <p className="text-xs leading-5 text-amber-700">
          현재 로그인한 관리자 계정은 이 화면에서 변경할 수 없습니다.
        </p>
      )}
      {message && (
        <p className="text-xs leading-5 text-slate-500" role="status">
          {message}
        </p>
      )}
    </div>
  );
}
