import { StoreCheckpoints } from "@ditch/lib";
import { getTranslations } from "next-intl/server";
import React from "react";

import { Link } from "@/components/i18n/i18n-navigation";
import MarkConnectToTelegramAsDone from "@/components/store/connect-to-telegram";
import { getStoreId } from "@/components/store/helpers";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Timeline,
  TimelineContent,
  TimelineDot,
  TimelineHeading,
  TimelineItem,
  TimelineLine
} from "@/components/ui/timeline";

type CheckpointField = {
  status: "done" | "current" | "default";
  title: string;
  link?: string;
  description: string;
  button: React.ReactNode | false;
  id?: string;
};

export default async function DashboardTimeline({
  adminCheckpoints
}: {
  adminCheckpoints?: StoreCheckpoints;
}) {
  const t = await getTranslations("Dashboard");
  const storeId = getStoreId();

  if (!adminCheckpoints) {
    return null;
  }

  const checkpointFields: CheckpointField[] = [
    {
      status: adminCheckpoints.hasProducts ? "done" : "current",
      title: t("checklist.create-products.header"),
      link: `/store/${storeId}/products`,
      description: t("checklist.create-products.description"),
      button: false
    },
    {
      status: adminCheckpoints.hasBotToken
        ? "done"
        : adminCheckpoints.isConnectedToTelegram
          ? "current"
          : "default",
      link: `/store/${storeId}/settings`,
      title: t("checklist.set-bot-token.header"),
      description: t("checklist.set-bot-token.description"),
      button: false
    },
    {
      status: adminCheckpoints.isConnectedToTelegram
        ? "done"
        : adminCheckpoints.hasProducts
          ? "current"
          : "default",
      link: undefined,
      title: t("checklist.connect-to-telegram.header"),
      description: t("checklist.connect-to-telegram.description"),
      button: <MarkConnectToTelegramAsDone storeId={storeId} />
    },
    {
      status: adminCheckpoints.hasConnectedPaymentSystem
        ? "done"
        : adminCheckpoints.hasBotToken
          ? "current"
          : "default",
      link: `/store/${storeId}/payment-systems`,
      title: t("checklist.connect-payment-system.header"),
      description: t("checklist.connect-payment-system.description"),
      button: false
    },
    {
      status:
        adminCheckpoints.hasProducts &&
        adminCheckpoints.hasBotToken &&
        adminCheckpoints.hasConnectedPaymentSystem &&
        adminCheckpoints.isConnectedToTelegram
          ? "done"
          : "default",
      id: "isDone",
      title: t("checklist.is-done.header"),
      description: t("checklist.is-done.description"),
      button: false
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("checklist.header")}</CardTitle>
        <CardDescription>{t("checklist.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className={"grid"}>
          <Timeline>
            {checkpointFields.map((checkpointField, index) => (
              <TimelineItem key={index}>
                <TimelineHeading>
                  {checkpointField.link ? (
                    <Link
                      href={checkpointField.link}
                      className="hover:underline"
                    >
                      {checkpointField.title}
                    </Link>
                  ) : (
                    checkpointField.title
                  )}
                </TimelineHeading>
                <TimelineDot status={checkpointField.status || "default"} />
                {index !== checkpointFields.length - 1 && (
                  <TimelineLine done={checkpointField.status === "done"} />
                )}
                <TimelineContent className="flex flex-col items-start justify-start text-sm">
                  {checkpointField.description}
                  {checkpointField.status !== "done" && checkpointField.button}
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </div>
      </CardContent>
    </Card>
  );
}
