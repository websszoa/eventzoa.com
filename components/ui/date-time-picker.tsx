"use client";

import { useState } from "react";
import { format, parse, isValid } from "date-fns";
import { ko } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/*
 * datetime-local 형식("2026-04-03T10:00")의 문자열을 value로 받아
 * 날짜(Calendar) + 시간(Input)을 조합해 동일 형식으로 onChange에 전달합니다.
 */
interface DateTimePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  "aria-invalid"?: boolean;
}

export function DateTimePicker({
  value = "",
  onChange,
  disabled = false,
  placeholder = "날짜 선택",
  "aria-invalid": ariaInvalid,
}: DateTimePickerProps) {
  const [open, setOpen] = useState(false);

  // value에서 날짜/시간 파싱
  const dateStr = value.slice(0, 10); // "2026-04-03"
  const timeStr = value.slice(11, 16) || "00:00"; // "10:00"

  const selectedDate =
    dateStr && isValid(new Date(dateStr)) ? new Date(dateStr) : undefined;

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    const newDate = format(date, "yyyy-MM-dd");
    onChange?.(`${newDate}T${timeStr}`);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    if (dateStr) {
      onChange?.(`${dateStr}T${newTime}`);
    }
  };

  const displayValue = selectedDate
    ? `${format(selectedDate, "yyyy년 M월 d일", { locale: ko })} ${timeStr}`
    : "";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          aria-invalid={ariaInvalid}
          className={cn(
            "w-full justify-start text-left font-anyvid font-normal",
            !displayValue && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
          {displayValue || placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          locale={ko}
          initialFocus
        />
        <div className="border-t p-3">
          <Input
            type="time"
            value={timeStr}
            onChange={handleTimeChange}
            className="font-anyvid text-muted-foreground"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
