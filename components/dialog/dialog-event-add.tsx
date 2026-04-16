"use client";

import { useEffect, useTransition } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { eventAddSchema } from "@/lib/validations";
import type { EventAddFormValues } from "@/lib/types";
import { addEventByAdmin } from "@/lib/actions/action-event-add";
import { toIsoString } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Minus, Plus } from "lucide-react";

type EventAddDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdded?: (event: import("@/lib/types").Event) => void;
};

const defaultValues: EventAddFormValues = {
  name: "",
  slug: "",
  description: "",
  country: "",
  region: "",
  place: "",
  lat: "",
  lng: "",
  eventType: "",
  eventScale: "",
  eventSite: "",
  eventProgram: "",
  eventStartAt: "",
  eventEndAt: "",
  registrationStatus: undefined,
  registrationFee: "무료",
  registrationStartAt: "",
  registrationEndAt: "",
  registrationAddStartAt: "",
  registrationAddEndAt: "",
  registrationPrice: [],
  imagesCover: [{ src: "" }],
  imagesDetail: [{ src: "" }],
  hostsOrganizer: "",
  hostsManage: "",
  hostsPhone: "",
  hostsEmail: "",
  snsKakao: "",
  snsInstagram: "",
  snsBlog: "",
  snsYoutube: "",
};

export default function DialogEventAdd({
  open,
  onOpenChange,
  onAdded,
}: EventAddDialogProps) {
  const [isPending, startTransition] = useTransition();

  const {
    handleSubmit,
    reset,
    control,
    watch,
    formState: {},
  } = useForm<EventAddFormValues>({
    resolver: zodResolver(eventAddSchema),
    defaultValues,
    mode: "onChange",
  });

  const watchedStatus = watch("registrationStatus");
  const watchedFee = watch("registrationFee");

  // 입장료
  const priceFields = useFieldArray({ control, name: "registrationPrice" });
  // 커버 이미지
  const coverFields = useFieldArray({ control, name: "imagesCover" });
  // 디테일 이미지
  const detailFields = useFieldArray({ control, name: "imagesDetail" });

  useEffect(() => {
    if (!open) reset(defaultValues);
  }, [open, reset]);

  const onSubmit = (data: EventAddFormValues) => {
    const eventStartDate = new Date(data.eventStartAt);

    startTransition(async () => {
      try {
        const added = await addEventByAdmin({
          year: eventStartDate.getFullYear(),
          month: eventStartDate.getMonth() + 1,
          name: data.name.trim(),
          slug: data.slug.trim(),
          description: data.description.trim(),
          country: data.country.trim(),
          region: data.region.trim(),
          event_start_at: eventStartDate.toISOString(),
          event_end_at: toIsoString(data.eventEndAt),
          event_scale: data.eventScale ? Number(data.eventScale) : null,
          event_type: data.eventType?.trim() || null,
          event_site: data.eventSite?.trim() || null,
          event_program: data.eventProgram?.trim() || null,
          location: {
            country: data.country.trim(),
            region: data.region.trim(),
            place: data.place?.trim() || null,
            lat: data.lat ? Number(data.lat) : null,
            lng: data.lng ? Number(data.lng) : null,
          },
          registration_status: data.registrationStatus || null,
          registration_start_at: toIsoString(data.registrationStartAt),
          registration_end_at: toIsoString(data.registrationEndAt),
          registration_add_start_at: toIsoString(data.registrationAddStartAt),
          registration_add_end_at: toIsoString(data.registrationAddEndAt),
          registration_price: data.registrationPrice?.length
            ? data.registrationPrice.map((p) => ({
                distance: p.distance,
                price: p.price ? Number(p.price) : null,
              }))
            : null,
          images: {
            cover: data.imagesCover?.map((i) => i.src).filter(Boolean),
            detail: data.imagesDetail?.map((i) => i.src).filter(Boolean),
          },
          hosts: {
            organizer: data.hostsOrganizer?.trim() || null,
            manage: data.hostsManage?.trim() || null,
            phone: data.hostsPhone?.trim() || null,
            email: data.hostsEmail?.trim() || null,
          },
          sns: {
            kakao: data.snsKakao?.trim() || null,
            instagram: data.snsInstagram?.trim() || null,
            blog: data.snsBlog?.trim() || null,
            youtube: data.snsYoutube?.trim() || null,
          },
        });

        onAdded?.(added);
        toast.success("이벤트가 저장되었습니다.");
        onOpenChange(false);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "이벤트 저장 중 오류가 발생했습니다.",
        );
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-xl text-brand">이벤트 추가</DialogTitle>
          <DialogDescription>
            이벤트 기본 정보, 일정, 접수 정보를 입력할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldSet className="gap-6">
            {/* 기본 정보 */}
            <FieldGroup className="rounded-xl border bg-muted/20 p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Controller
                  control={control}
                  name="name"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        이벤트명 <span className="star">*</span>
                      </FieldLabel>
                      <FieldContent>
                        <Input
                          id={field.name}
                          placeholder="예: 서울 봄꽃 페스티벌"
                          aria-invalid={fieldState.invalid}
                          disabled={isPending}
                          {...field}
                        />
                        <FieldError errors={[fieldState.error]} />
                      </FieldContent>
                    </Field>
                  )}
                />

                <Controller
                  control={control}
                  name="slug"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        슬러그 <span className="star">*</span>
                      </FieldLabel>
                      <FieldContent>
                        <Input
                          id={field.name}
                          placeholder="예: seoul-spring-festival-2026"
                          aria-invalid={fieldState.invalid}
                          disabled={isPending}
                          {...field}
                        />
                        <FieldError errors={[fieldState.error]} />
                      </FieldContent>
                    </Field>
                  )}
                />
              </div>

              <Controller
                control={control}
                name="description"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      설명 <span className="star">*</span>
                    </FieldLabel>
                    <FieldContent>
                      <Textarea
                        id={field.name}
                        rows={5}
                        placeholder="이벤트를 소개하는 짧은 설명을 입력해주세요."
                        aria-invalid={fieldState.invalid}
                        disabled={isPending}
                        {...field}
                      />
                      <FieldError errors={[fieldState.error]} />
                    </FieldContent>
                  </Field>
                )}
              />
            </FieldGroup>

            {/* 일정 정보 */}
            <FieldGroup className="rounded-xl border bg-muted/20 p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Controller
                  control={control}
                  name="eventStartAt"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        이벤트 시작일시 <span className="star">*</span>
                      </FieldLabel>
                      <FieldContent>
                        <DateTimePicker
                          id={field.name}
                          value={field.value}
                          onChange={field.onChange}
                          aria-invalid={fieldState.invalid}
                          disabled={isPending}
                        />
                        <FieldError errors={[fieldState.error]} />
                      </FieldContent>
                    </Field>
                  )}
                />

                <Controller
                  control={control}
                  name="eventEndAt"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        이벤트 종료일시
                      </FieldLabel>
                      <FieldContent>
                        <DateTimePicker
                          id={field.name}
                          value={field.value}
                          onChange={field.onChange}
                          aria-invalid={fieldState.invalid}
                          disabled={isPending}
                        />
                      </FieldContent>
                    </Field>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Controller
                  control={control}
                  name="eventType"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>이벤트 타입</FieldLabel>
                      <FieldContent>
                        <Input
                          id={field.name}
                          placeholder="예: 축제, 공연, 전시"
                          aria-invalid={fieldState.invalid}
                          disabled={isPending}
                          {...field}
                        />
                      </FieldContent>
                    </Field>
                  )}
                />

                <Controller
                  control={control}
                  name="eventScale"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>이벤트 규모</FieldLabel>
                      <FieldContent>
                        <Input
                          id={field.name}
                          type="number"
                          min="0"
                          placeholder="예: 5000"
                          aria-invalid={fieldState.invalid}
                          disabled={isPending}
                          {...field}
                        />
                      </FieldContent>
                    </Field>
                  )}
                />
              </div>

              <Controller
                control={control}
                name="eventSite"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>이벤트 사이트</FieldLabel>
                    <FieldContent>
                      <Input
                        id={field.name}
                        type="url"
                        placeholder="https://"
                        aria-invalid={fieldState.invalid}
                        disabled={isPending}
                        {...field}
                      />
                    </FieldContent>
                  </Field>
                )}
              />

              <Controller
                control={control}
                name="eventProgram"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>이벤트 프로그램</FieldLabel>
                    <FieldContent>
                      <Input
                        id={field.name}
                        placeholder="예: 공연, 체험, 포토존, 먹거리 부스"
                        aria-invalid={fieldState.invalid}
                        disabled={isPending}
                        {...field}
                      />
                    </FieldContent>
                  </Field>
                )}
              />
            </FieldGroup>

            {/* 접수 정보 */}
            <FieldGroup className="rounded-xl border bg-muted/20 p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Controller
                  control={control}
                  name="registrationStatus"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>접수 상태</FieldLabel>
                      <FieldContent>
                        <Select
                          value={field.value ?? ""}
                          onValueChange={field.onChange}
                          disabled={isPending}
                        >
                          <SelectTrigger id={field.name} className="w-full">
                            <SelectValue placeholder="상태 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="접수대기">접수대기</SelectItem>
                            <SelectItem value="접수중">접수중</SelectItem>
                            <SelectItem value="추가접수">추가접수</SelectItem>
                            <SelectItem value="접수마감">접수마감</SelectItem>
                          </SelectContent>
                        </Select>
                      </FieldContent>
                    </Field>
                  )}
                />

                <Controller
                  control={control}
                  name="registrationFee"
                  render={({ field }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>접수 요금</FieldLabel>
                      <FieldContent>
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);

                            if (value === "유료" && priceFields.fields.length === 0) {
                              priceFields.append({ distance: "", price: "" });
                            }

                            if (value === "무료" && priceFields.fields.length > 0) {
                              priceFields.replace([]);
                            }
                          }}
                          disabled={isPending}
                        >
                          <SelectTrigger id={field.name} className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="무료">무료</SelectItem>
                            <SelectItem value="유료">유료</SelectItem>
                          </SelectContent>
                        </Select>
                      </FieldContent>
                    </Field>
                  )}
                />
              </div>

              {watchedStatus && (
                <div className="grid gap-4 md:grid-cols-2">
                  <Controller
                    control={control}
                    name="registrationStartAt"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                          접수 시작 일시
                        </FieldLabel>
                        <FieldContent>
                          <DateTimePicker
                            value={field.value}
                            onChange={field.onChange}
                            aria-invalid={fieldState.invalid}
                            disabled={isPending}
                          />
                        </FieldContent>
                      </Field>
                    )}
                  />

                  <Controller
                    control={control}
                    name="registrationEndAt"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                          접수 마감 일시
                        </FieldLabel>
                        <FieldContent>
                          <DateTimePicker
                            value={field.value}
                            onChange={field.onChange}
                            aria-invalid={fieldState.invalid}
                            disabled={isPending}
                          />
                        </FieldContent>
                      </Field>
                    )}
                  />
                </div>
              )}

              {/* 추가접수 선택 시 추가 일정 */}
              {watchedStatus === "추가접수" && (
                <div className="grid gap-4 md:grid-cols-2">
                  <Controller
                    control={control}
                    name="registrationAddStartAt"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                          추가 접수 시작 일시
                        </FieldLabel>
                        <FieldContent>
                          <DateTimePicker
                            value={field.value}
                            onChange={field.onChange}
                            aria-invalid={fieldState.invalid}
                            disabled={isPending}
                          />
                        </FieldContent>
                      </Field>
                    )}
                  />

                  <Controller
                    control={control}
                    name="registrationAddEndAt"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                          추가 접수 마감 일시
                        </FieldLabel>
                        <FieldContent>
                          <DateTimePicker
                            value={field.value}
                            onChange={field.onChange}
                            aria-invalid={fieldState.invalid}
                            disabled={isPending}
                          />
                        </FieldContent>
                      </Field>
                    )}
                  />
                </div>
              )}

              {/* 입장료 - 유료일 때만 표시 */}
              {watchedFee === "유료" && (
                <Field>
                  <FieldLabel>입장료</FieldLabel>
                  <FieldContent>
                    <div className="space-y-2">
                      {priceFields.fields.map((item, index) => {
                        const isLast = index === priceFields.fields.length - 1;
                        return (
                          <div
                            key={item.id}
                            className="flex items-center gap-2"
                          >
                            <Controller
                              control={control}
                              name={`registrationPrice.${index}.distance`}
                              render={({ field: f, fieldState }) => (
                                <Input
                                  placeholder="예: R석, S석"
                                  aria-invalid={fieldState.invalid}
                                  disabled={isPending}
                                  {...f}
                                />
                              )}
                            />
                            <Controller
                              control={control}
                              name={`registrationPrice.${index}.price`}
                              render={({ field: f, fieldState }) => (
                                <Input
                                  type="number"
                                  min="0"
                                  placeholder="예: 가격 (원)"
                                  aria-invalid={fieldState.invalid}
                                  disabled={isPending}
                                  {...f}
                                />
                              )}
                            />
                            {isLast ? (
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                  priceFields.append({
                                    distance: "",
                                    price: "",
                                  })
                                }
                                disabled={isPending}
                                className="w-10 h-10"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => priceFields.remove(index)}
                                disabled={isPending}
                                className="w-10 h-10"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </FieldContent>
                </Field>
              )}
            </FieldGroup>

            {/* 위치 정보 */}
            <FieldGroup className="rounded-xl border bg-muted/20 p-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Controller
                  control={control}
                  name="country"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        국가 <span className="star">*</span>
                      </FieldLabel>
                      <FieldContent>
                        <Input
                          id={field.name}
                          placeholder="예: 한국"
                          aria-invalid={fieldState.invalid}
                          disabled={isPending}
                          {...field}
                        />
                        <FieldError errors={[fieldState.error]} />
                      </FieldContent>
                    </Field>
                  )}
                />

                <Controller
                  control={control}
                  name="region"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        지역 <span className="star">*</span>
                      </FieldLabel>
                      <FieldContent>
                        <Input
                          id={field.name}
                          placeholder="예: 서울"
                          aria-invalid={fieldState.invalid}
                          disabled={isPending}
                          {...field}
                        />
                        <FieldError errors={[fieldState.error]} />
                      </FieldContent>
                    </Field>
                  )}
                />

                <Controller
                  control={control}
                  name="place"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>장소</FieldLabel>
                      <FieldContent>
                        <Input
                          id={field.name}
                          placeholder="예: 여의도 한강공원"
                          aria-invalid={fieldState.invalid}
                          disabled={isPending}
                          {...field}
                        />
                      </FieldContent>
                    </Field>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Controller
                  control={control}
                  name="lat"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>위도</FieldLabel>
                      <FieldContent>
                        <Input
                          id={field.name}
                          type="number"
                          step="any"
                          placeholder="예: 37.5665"
                          aria-invalid={fieldState.invalid}
                          disabled={isPending}
                          {...field}
                        />
                      </FieldContent>
                    </Field>
                  )}
                />

                <Controller
                  control={control}
                  name="lng"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>경도</FieldLabel>
                      <FieldContent>
                        <Input
                          id={field.name}
                          type="number"
                          step="any"
                          placeholder="예: 126.9780"
                          aria-invalid={fieldState.invalid}
                          disabled={isPending}
                          {...field}
                        />
                      </FieldContent>
                    </Field>
                  )}
                />
              </div>
            </FieldGroup>

            {/* 이미지 정보 */}
            <FieldGroup className="rounded-xl border bg-muted/20 p-4">
              {/* 커버 이미지 */}
              {coverFields.fields.map((item, index) => {
                const isLast = index === coverFields.fields.length - 1;
                return (
                  <div key={item.id} className="flex items-center gap-2">
                    <div className="w-24 shrink-0 text-sm font-anyvid text-muted-foreground">
                      커버 이미지
                    </div>
                    <Controller
                      control={control}
                      name={`imagesCover.${index}.src`}
                      render={({ field: f, fieldState }) => (
                        <Input
                          className="flex-1"
                          placeholder="예: https://"
                          aria-invalid={fieldState.invalid}
                          disabled={isPending}
                          {...f}
                        />
                      )}
                    />
                    {isLast ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => coverFields.append({ src: "" })}
                        disabled={isPending}
                        className="w-10 h-10"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => coverFields.remove(index)}
                        disabled={isPending}
                        className="w-10 h-10"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                );
              })}

              {/* 디테일 이미지 */}
              {detailFields.fields.map((item, index) => {
                const isLast = index === detailFields.fields.length - 1;
                return (
                  <div key={item.id} className="flex items-center gap-2">
                    <div className="w-24 shrink-0 text-sm font-anyvid text-muted-foreground">
                      디테일 이미지
                    </div>
                    <Controller
                      control={control}
                      name={`imagesDetail.${index}.src`}
                      render={({ field: f, fieldState }) => (
                        <Input
                          className="flex-1"
                          placeholder="예: https://"
                          aria-invalid={fieldState.invalid}
                          disabled={isPending}
                          {...f}
                        />
                      )}
                    />
                    {isLast ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => detailFields.append({ src: "" })}
                        disabled={isPending}
                        className="w-10 h-10"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => detailFields.remove(index)}
                        disabled={isPending}
                        className="w-10 h-10"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </FieldGroup>

            {/* 주최자 정보 */}
            <FieldGroup className="rounded-xl border bg-muted/20 p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Controller
                  control={control}
                  name="hostsOrganizer"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>주최</FieldLabel>
                      <FieldContent>
                        <Input
                          id={field.name}
                          aria-invalid={fieldState.invalid}
                          disabled={isPending}
                          placeholder="예: 주최사명"
                          {...field}
                        />
                      </FieldContent>
                    </Field>
                  )}
                />

                <Controller
                  control={control}
                  name="hostsManage"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>주관</FieldLabel>
                      <FieldContent>
                        <Input
                          id={field.name}
                          aria-invalid={fieldState.invalid}
                          disabled={isPending}
                          placeholder="예: 주관사명"
                          {...field}
                        />
                      </FieldContent>
                    </Field>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Controller
                  control={control}
                  name="hostsPhone"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>전화번호</FieldLabel>
                      <FieldContent>
                        <Input
                          id={field.name}
                          type="tel"
                          aria-invalid={fieldState.invalid}
                          disabled={isPending}
                          placeholder="예: 02-123-4567"
                          {...field}
                        />
                      </FieldContent>
                    </Field>
                  )}
                />

                <Controller
                  control={control}
                  name="hostsEmail"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>이메일</FieldLabel>
                      <FieldContent>
                        <Input
                          id={field.name}
                          type="email"
                          aria-invalid={fieldState.invalid}
                          disabled={isPending}
                          placeholder="예: example@email.com"
                          {...field}
                        />
                      </FieldContent>
                    </Field>
                  )}
                />
              </div>
            </FieldGroup>

            {/* SNS 정보 */}
            <FieldGroup className="rounded-xl border bg-muted/20 p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Controller
                  control={control}
                  name="snsKakao"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>카카오</FieldLabel>
                      <FieldContent>
                        <Input
                          id={field.name}
                          type="url"
                          placeholder="예: https://"
                          aria-invalid={fieldState.invalid}
                          disabled={isPending}
                          {...field}
                        />
                      </FieldContent>
                    </Field>
                  )}
                />

                <Controller
                  control={control}
                  name="snsInstagram"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>인스타그램</FieldLabel>
                      <FieldContent>
                        <Input
                          id={field.name}
                          type="url"
                          placeholder="예: https://"
                          aria-invalid={fieldState.invalid}
                          disabled={isPending}
                          {...field}
                        />
                      </FieldContent>
                    </Field>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Controller
                  control={control}
                  name="snsBlog"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>블로그</FieldLabel>
                      <FieldContent>
                        <Input
                          id={field.name}
                          type="url"
                          placeholder="예: https://"
                          aria-invalid={fieldState.invalid}
                          disabled={isPending}
                          {...field}
                        />
                      </FieldContent>
                    </Field>
                  )}
                />

                <Controller
                  control={control}
                  name="snsYoutube"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>유튜브</FieldLabel>
                      <FieldContent>
                        <Input
                          id={field.name}
                          type="url"
                          placeholder="예: https://"
                          aria-invalid={fieldState.invalid}
                          disabled={isPending}
                          {...field}
                        />
                      </FieldContent>
                    </Field>
                  )}
                />
              </div>
            </FieldGroup>
          </FieldSet>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              닫기
            </Button>
            <Button
              type="submit"
              variant="destructive"
              size="sm"
              disabled={isPending}
            >
              {isPending ? "저장 중..." : "저장"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
