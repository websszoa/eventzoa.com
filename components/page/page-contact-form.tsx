"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Send } from "lucide-react";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import { submitInquiry, type ContactActionResult } from "@/app/contact/actions";
import ContactSuccessDialog from "@/components/dialog/contact-success-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  contactSchema,
  inquiryFormCopy,
  type ContactFormValues,
  type InquiryType,
} from "@/lib/contact";

function getDefaultValues(type: InquiryType): ContactFormValues {
  return {
  type,
  name: "",
  email: "",
  subject: "",
  relatedUrl: "",
  message: "",
  privacyAccepted: false,
  website: "",
  };
}

export default function ContactForm({ initialType }: { initialType: InquiryType }) {
  const [result, setResult] = useState<ContactActionResult | null>(null);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const defaultValues = getDefaultValues(initialType);
  const copy = inquiryFormCopy[initialType];
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues,
  });
  const messageLength =
    useWatch({ control, name: "message", defaultValue: "" }).length;

  const onSubmit = handleSubmit(async (values) => {
    setResult(null);
    const response = await submitInquiry({ ...values, type: initialType });
    if (response.success) {
      reset(getDefaultValues(initialType));
      setIsSuccessOpen(true);
      return;
    }

    setResult(response);
  });

  return (
    <>
    <div id="inquiry-form" className="scroll-mt-28 rounded-3xl bg-white p-6 ring-1 ring-slate-200 sm:p-8 lg:p-10">
      <div className="border-b border-slate-100 pb-7">
        <p className="text-sm font-bold tracking-widest text-blue-600 uppercase">{copy.eyebrow}</p>
        <h2 className="mt-2 font-cafe24 text-3xl font-bold text-slate-950 sm:text-4xl">{copy.title}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-500">{copy.description} 필수 항목을 작성해 보내주시면 입력한 이메일로 답변드리겠습니다.</p>
      </div>

      <form onSubmit={onSubmit} noValidate className="mt-8">
        <FieldGroup>
          <div className="grid gap-7 sm:grid-cols-2">
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="name">이름 <Required /></FieldLabel>
              <Input id="name" autoComplete="name" placeholder="이름을 입력해 주세요" aria-invalid={!!errors.name} className="h-12 rounded-xl px-4" {...register("name")} />
              <FieldError errors={[errors.name]} />
            </Field>
            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor="email">이메일 <Required /></FieldLabel>
              <Input id="email" type="email" autoComplete="email" placeholder="hello@example.com" aria-invalid={!!errors.email} className="h-12 rounded-xl px-4" {...register("email")} />
              <FieldError errors={[errors.email]} />
            </Field>
          </div>

          <Field data-invalid={!!errors.subject}>
            <FieldLabel htmlFor="subject">제목 <Required /></FieldLabel>
            <Input id="subject" placeholder={copy.subjectPlaceholder} aria-invalid={!!errors.subject} className="h-12 rounded-xl px-4" {...register("subject")} />
            <FieldError errors={[errors.subject]} />
          </Field>

          <Field data-invalid={!!errors.relatedUrl}>
            <FieldLabel htmlFor="related-url">관련 페이지 주소</FieldLabel>
            <Input id="related-url" type="url" placeholder="https://eventzoa.com/... (선택)" aria-invalid={!!errors.relatedUrl} className="h-12 rounded-xl px-4" {...register("relatedUrl")} />
            <FieldError errors={[errors.relatedUrl]} />
          </Field>

          <Field data-invalid={!!errors.message}>
            <FieldLabel htmlFor="message">문의 내용 <Required /></FieldLabel>
            <Textarea id="message" maxLength={3000} placeholder={copy.messagePlaceholder} aria-invalid={!!errors.message} className="min-h-44 resize-y rounded-xl px-4 py-3" {...register("message")} />
            <div className="flex items-start justify-between gap-4"><FieldError errors={[errors.message]} /><span className={`ml-auto text-xs tabular-nums ${messageLength >= 3000 ? "font-bold text-red-500" : "text-slate-400"}`} aria-live="polite">{messageLength.toLocaleString("ko-KR")} / 3,000자</span></div>
          </Field>

          <Controller
            name="privacyAccepted"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="privacy-accepted" className="w-full items-start gap-3 rounded-2xl bg-slate-50 p-4">
                  <Checkbox className="mt-1" id="privacy-accepted" checked={field.value} onCheckedChange={field.onChange} aria-invalid={fieldState.invalid} />
                  <span className="text-sm leading-6 text-slate-600"><Link href="/privacy" target="_blank" className="font-bold text-blue-600 underline underline-offset-4">개인정보처리방침</Link>에 동의합니다. <Required /></span>
                </FieldLabel>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <div className="hidden" aria-hidden="true"><label htmlFor="website">웹사이트</label><input id="website" tabIndex={-1} autoComplete="off" {...register("website")} /></div>

          {result && (
            <div role="alert" className="flex items-start gap-3 rounded-2xl bg-red-50 p-4 text-sm leading-6 text-red-700">
              <p>{result.message}</p>
            </div>
          )}

          <Button type="submit" size="lg" disabled={isSubmitting} className="h-13! w-full rounded-xl text-base sm:w-auto sm:min-w-44">
            {isSubmitting ? <><LoaderCircle className="size-4 animate-spin" />접수 중...</> : <><Send className="size-4" />{copy.submitLabel}</>}
          </Button>
        </FieldGroup>
      </form>
    </div>
    <ContactSuccessDialog
      open={isSuccessOpen}
      onOpenChange={setIsSuccessOpen}
    />
    </>
  );
}

function Required() {
  return <span className="text-red-500" aria-label="필수">*</span>;
}
