"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { z } from "zod";
import { Heart, MailCheck, PartyPopper, Send, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { subscribeNewsletter } from "@/app/newsletter/actions";
import { APP_ENG_NAME } from "@/lib/constants";
import {
  newsletterAcquisitionSources,
  newsletterAges,
  newsletterSchema,
  type NewsletterInput,
  type NewsletterSubscriptionSource,
} from "@/lib/newsletter";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type NewsletterField = keyof NewsletterInput;
type NewsletterErrors = Partial<Record<NewsletterField, string>>;
type NewsletterStatus = "form" | "submitting" | "success" | "error";

type DialogNewsletterProps = {
  children: ReactNode;
  className?: string;
  subscriptionSource: NewsletterSubscriptionSource;
};

export default function DialogNewsletter({
  children,
  className,
  subscriptionSource,
}: DialogNewsletterProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [age, setAge] = useState<string | null>(null);
  const [acquisitionSource, setAcquisitionSource] = useState<string | null>(
    null,
  );
  const [contentPreference, setContentPreference] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<NewsletterStatus>("form");
  const [errors, setErrors] = useState<NewsletterErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  // 로그인한 사용자는 계정 이메일을 미리 채워 준다.
  useEffect(() => {
    if (!open) return;

    let active = true;
    void createClient()
      .auth.getUser()
      .then(({ data: { user } }) => {
        if (active && user?.email) {
          setEmail((current) => current || user.email || "");
        }
      });

    return () => {
      active = false;
    };
  }, [open]);

  const openDialog = () => {
    setEmail("");
    setAge(null);
    setAcquisitionSource(null);
    setContentPreference("");
    setConsent(false);
    setStatus("form");
    setErrors({});
    setSubmitError(null);
    setOpen(true);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") return;

    const validation = newsletterSchema.safeParse({
      email,
      age: age ?? "",
      acquisitionSource: acquisitionSource ?? "",
      contentPreference,
      subscriptionSource,
      consent,
    });

    if (!validation.success) {
      const fieldErrors = z.flattenError(validation.error).fieldErrors;
      setErrors(
        Object.fromEntries(
          Object.entries(fieldErrors).map(([field, messages]) => [
            field,
            messages?.[0],
          ]),
        ) as NewsletterErrors,
      );
      return;
    }

    setErrors({});
    setSubmitError(null);
    setStatus("submitting");

    try {
      const result = await subscribeNewsletter(validation.data);

      if (result.success) {
        setStatus("success");
        return;
      }

      setSubmitError(result.message);
    } catch {
      setSubmitError("서버에 연결하지 못했어요. 잠시 후 다시 시도해 주세요.");
    }

    setStatus("error");
  };

  const isSuccess = status === "success";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button type="button" className={className} onClick={openDialog}>
        {children}
      </Button>

      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl sm:max-w-md">
        <DialogHeader
          className={cn(
            "items-center text-center",
            !isSuccess && "border-b border-slate-100 pb-4",
          )}
        >
          <div className="flex items-center gap-2 font-cafe24 text-lg font-bold text-blue-600">
            <PartyPopper className="size-6" aria-hidden="true" />
            {APP_ENG_NAME}
          </div>
          <DialogTitle className="font-cafe24 text-2xl font-bold text-slate-950">
            {isSuccess
              ? "구독 신청이 완료됐어요! 🎉"
              : "놓치기 아쉬운 축제 소식 💌"}
          </DialogTitle>
          <DialogDescription className="leading-6 break-keep text-slate-500">
            {isSuccess
              ? "설레는 축제 소식을 정성껏 모아 보내드릴게요."
              : "필요한 소식만 골라서 가볍게 보내드릴게요."}
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <NewsletterSuccess onClose={() => setOpen(false)} />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="space-y-2">
              <Label htmlFor="newsletter-email">
                이메일 <span className="text-blue-600">*</span>
              </Label>
              <Input
                id="newsletter-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                aria-invalid={Boolean(errors.email)}
                placeholder="festival@example.com"
                className="h-11"
              />
              <FieldMessage message={errors.email} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <NewsletterSelect
                label="나이대"
                value={age}
                onValueChange={setAge}
                items={newsletterAges}
                error={errors.age}
              />
              <NewsletterSelect
                label="알게 된 경로"
                value={acquisitionSource}
                onValueChange={setAcquisitionSource}
                items={newsletterAcquisitionSources}
                error={errors.acquisitionSource}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newsletter-preference">
                가장 받고 싶은 정보{" "}
                <span className="font-normal text-slate-400">(선택)</span>
              </Label>
              <Input
                id="newsletter-preference"
                value={contentPreference}
                onChange={(event) => setContentPreference(event.target.value)}
                maxLength={500}
                aria-invalid={Boolean(errors.contentPreference)}
                placeholder="예: 서울 지역 불꽃축제 소식"
                className="h-11"
              />
              <FieldMessage message={errors.contentPreference} />
            </div>

            <div>
              <label className="flex cursor-pointer items-start gap-2.5 rounded-xl bg-blue-50 p-3 text-sm leading-5 text-slate-700">
                <Checkbox
                  checked={consent}
                  onCheckedChange={(checked) => setConsent(checked === true)}
                  aria-invalid={Boolean(errors.consent)}
                  className="mt-0.5"
                />
                <span>
                  <strong className="font-bold text-blue-600">(필수)</strong>{" "}
                  개인정보 수집 및 뉴스레터 수신에 동의합니다.
                </span>
              </label>
              <FieldMessage message={errors.consent} />
            </div>

            {status === "error" && submitError && (
              <p
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 p-3 text-center text-sm text-red-700"
              >
                {submitError}
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={status === "submitting"}
              className="h-11 w-full rounded-xl font-bold"
            >
              {status === "submitting" ? "신청 중..." : "뉴스레터 구독하기"}
              <Send className="size-4" aria-hidden="true" />
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

function NewsletterSelect({
  label,
  value,
  onValueChange,
  items,
  error,
}: {
  label: string;
  value: string | null;
  onValueChange: (value: string | null) => void;
  items: readonly string[];
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <Label>
        {label} <span className="text-blue-600">*</span>
      </Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="h-11 w-full" aria-invalid={Boolean(error)}>
          <SelectValue placeholder="선택해 주세요" />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldMessage message={error} />
    </div>
  );
}

function FieldMessage({ message }: { message?: string }) {
  return message ? (
    <p className="mt-1.5 text-sm text-destructive">{message}</p>
  ) : null;
}

// 구독 완료: 편지가 날아와 도착하는 애니메이션
function NewsletterSuccess({ onClose }: { onClose: () => void }) {
  return (
    <div className="space-y-5 text-center">
      <div
        className="relative mx-auto flex h-36 w-52 items-center justify-center overflow-hidden"
        aria-hidden="true"
      >
        <span className="newsletter-success-cloud absolute bottom-5 left-5 h-7 w-16 rounded-full bg-sky-100" />
        <span className="newsletter-success-cloud newsletter-success-cloud--right absolute right-3 bottom-8 h-6 w-14 rounded-full bg-blue-100" />
        <div className="newsletter-success-mail relative z-10 flex size-20 items-center justify-center rounded-3xl border border-blue-200 bg-linear-to-br from-white to-blue-50 ring-4 ring-blue-50">
          <MailCheck className="size-10 text-blue-600" />
        </div>
        <Sparkles className="newsletter-success-spark absolute top-6 left-8 size-5 text-amber-400" />
        <Heart className="newsletter-success-spark newsletter-success-spark--two absolute top-4 right-8 size-4 fill-rose-300 text-rose-300" />
      </div>
      <Button
        type="button"
        size="lg"
        onClick={onClose}
        className="h-11 w-full rounded-xl font-bold"
      >
        확인
      </Button>
    </div>
  );
}
