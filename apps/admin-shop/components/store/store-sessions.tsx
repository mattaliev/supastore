"use client";
import { SessionAnalyticsByHour } from "@ditch/lib";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

import { DatePickerWithPresets } from "@/components/store/sessions-date-picker";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function StoreSessions({
  selectedDate,
  storeSessions
}: {
  selectedDate?: string;
  storeSessions?: SessionAnalyticsByHour;
}) {
  const t = useTranslations("Dashboard");

  if (!storeSessions) {
    return <Skeleton className={"h-64 animate-pulse"} />;
  }

  return (
    <Card>
      <CardHeader className="pb-2 grid gap-2 grid-cols-1 sm:grid-cols-2 justify-between">
        <div>
          <CardDescription className={"pb-2"}>
            {t("store-sessions.header")}
          </CardDescription>
          <CardTitle
            className={"flex items-center justify-start gap-2 text-4xl"}
          >
            {storeSessions.sessionCount}
            <div
              className={cn(
                "text-base flex items-center justify-start font-normal",
                storeSessions.sessionIncreasePercentage >= 0
                  ? "text-primary"
                  : "text-destructive"
              )}
            >
              {storeSessions.sessionIncreasePercentage > 0 ? (
                <ArrowUp size={24} />
              ) : storeSessions.sessionIncreasePercentage < 0 ? (
                <ArrowDown size={24} />
              ) : null}
              <p>%{Math.abs(storeSessions.sessionIncreasePercentage)}</p>
            </div>
          </CardTitle>
        </div>
        <div className={"justify-self-start sm:justify-self-end"}>
          <DatePickerWithPresets
            date={selectedDate ? new Date(selectedDate) : new Date()}
          />
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart
            className={
              "text-muted-foreground text-sm fill-muted-foreground stroke-muted-foreground"
            }
            data={storeSessions.sessions}
            margin={{
              top: 5,
              right: 10,
              left: 10,
              bottom: 0
            }}
          >
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] text-muted-foreground text-sm">
                            {t("store-sessions.tooltip", {
                              value: payload[0].value?.toString()
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              className={"text-primary fill-primary stroke-primary"}
              type="monotone"
              strokeWidth={2}
              dataKey="sessions"
              activeDot={{
                r: 6,
                style: { opacity: 0.25 }
              }}
            />
            <XAxis dataKey="hour" axisLine={false} minTickGap={10} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
