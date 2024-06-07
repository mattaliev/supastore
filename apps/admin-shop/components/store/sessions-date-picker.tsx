"use client";

import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export function DatePickerWithPresets({ date }: { date: Date }) {
  const t = useTranslations("Dashboard");
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    date
  );
  const { push } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const formatter = useFormatter();

  const onDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);

    if (!date) return;

    const params = new URLSearchParams(searchParams);
    params.set("date", format(date, "yyyy-MM-dd"));
    push(`${pathname}?${params.toString()}`);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? (
            formatter.dateTime(selectedDate, {
              year: "numeric",
              month: "long",
              day: "numeric"
            })
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="flex w-auto flex-col space-y-2 p-2"
      >
        <Select
          onValueChange={(value) =>
            onDateSelect(addDays(new Date(), parseInt(value)))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder={t("store-sessions.select-date")} />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="0">
              {t("store-sessions.relative-date.today")}
            </SelectItem>
            <SelectItem value="-1">
              {t("store-sessions.relative-date.yesterday")}
            </SelectItem>
            <SelectItem value="-7">
              {t("store-sessions.relative-date.week-ago")}
            </SelectItem>
          </SelectContent>
        </Select>
        <div className="rounded-md border">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateSelect}
            disabled={(date) => date > new Date()}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
