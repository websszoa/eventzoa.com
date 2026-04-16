"use client";

import { useState } from "react";
import { format, isValid } from "date-fns";
import { ko } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type DateTimePickerProps = {
  id?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  "aria-invalid"?: boolean;
  className?: string;
};

export function DateTimePicker({
  id,
  value,
  onChange,
  disabled,
  "aria-invalid": ariaInvalid,
  className,
}: DateTimePickerProps) {
  const [open, setOpen] = useState(false);

  // value는 "YYYY-MM-DDTHH:mm" 또는 ISO 문자열
  const parsed = value ? new Date(value) : undefined;
  const date = parsed && isValid(parsed) ? parsed : undefined;

  const timeString = date ? format(date, "HH:mm") : "00:00";

  const handleDateSelect = (selected: Date | undefined) => {
    if (!selected) return;
    const [h, m] = timeString.split(":").map(Number);
    const next = new Date(selected);
    next.setHours(h, m, 0, 0);
    onChange?.(format(next, "yyyy-MM-dd'T'HH:mm"));
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = e.target.value;
    if (!t) return;
    const [h, m] = t.split(":").map(Number);
    const base = date ? new Date(date) : new Date();
    base.setHours(h, m, 0, 0);
    onChange?.(format(base, "yyyy-MM-dd'T'HH:mm"));
  };

  return (
    <Popover
      open={open}
      onOpenChange={disabled ? undefined : setOpen}
      modal={false}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          id={id}
          disabled={disabled}
          aria-invalid={ariaInvalid}
          className={cn(
            "w-full justify-start text-left font-anyvid font-normal h-10",
            !date && "text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
          {date
            ? format(date, "yyyy년 M월 d일(EEE) HH:mm", { locale: ko })
            : "날짜 선택"}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0"
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          locale={ko}
          captionLayout="dropdown"
          startMonth={new Date(2020, 0)}
          endMonth={new Date(2030, 11)}
        />
        {/* 시간 선택 */}
        <div className="font-anyvid flex items-center gap-2 border-t px-4 py-3">
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          <input
            type="time"
            value={timeString}
            onChange={handleTimeChange}
            disabled={disabled}
            className={cn(
              "flex-1 rounded border border-input bg-transparent px-2 py-1 text-sm",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
