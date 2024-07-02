import { AnalyticsEvent } from "@ditch/lib";
import { DateTime } from "luxon";
import { getTranslations } from "next-intl/server";
import React from "react";

import AnalyticsEventBadge from "@/components/analytics/analytics-event-badge";
import AnalyticsEventData from "@/components/analytics/analytics-event-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

export default async function CustomerEvents({
  events
}: {
  events: AnalyticsEvent[];
}) {
  const t = await getTranslations("CustomerDetailPage.CustomerEvents");

  const formatDate = (date: string) => {
    return DateTime.fromISO(date).toLocaleString(DateTime.DATE_MED, {
      locale: "en-US"
    });
  };

  const formatTime = (date: string) => {
    return DateTime.fromISO(date).toLocaleString(DateTime.TIME_24_SIMPLE, {
      locale: "en-US"
    });
  };

  const groupedEvents = events.reduce(
    (acc, event) => {
      if (!acc[formatDate(event.created)]) {
        acc[formatDate(event.created)] = [];
      }
      acc[formatDate(event.created)].push(event);
      return acc;
    },
    {} as Record<string, AnalyticsEvent[]>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-2">{t("TableHead.date")}</TableHead>
              <TableHead className="px-2">{t("TableHead.time")}</TableHead>
              <TableHead className="px-2 text-center">
                {t("TableHead.event")}
              </TableHead>
              <TableHead className="hidden sm:table-cell px-2">
                {t("TableHead.details")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(groupedEvents).map(([date, events]) => (
              <React.Fragment key={date}>
                <TableRow>
                  <TableCell rowSpan={events.length} className="px-2">
                    {date}
                  </TableCell>
                  <TableCell className="px-2">
                    {formatTime(events[0].created)}
                  </TableCell>
                  <TableCell className="px-2 text-center">
                    <AnalyticsEventBadge eventType={events[0].eventType} />
                  </TableCell>
                  <TableCell className="px-2 hidden sm:table-cell">
                    <AnalyticsEventData event={events[0]} />
                  </TableCell>
                </TableRow>
                {events.slice(1).map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="px-2">
                      {formatTime(event.created)}
                    </TableCell>
                    <TableCell className="px-2 text-center">
                      <AnalyticsEventBadge eventType={event.eventType} />
                    </TableCell>
                    <TableCell className="px-2 hidden sm:table-cell">
                      <AnalyticsEventData event={event} />
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
