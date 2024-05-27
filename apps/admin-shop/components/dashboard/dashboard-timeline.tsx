import { StoreCheckpoints } from "@ditch/lib";
import Link from "next/link";
import React from "react";

import MarkConnectToTelegramAsDone from "@/components/store/connect-to-telegram";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Timeline,
  TimelineContent,
  TimelineDot,
  TimelineHeading,
  TimelineItem,
  TimelineLine,
} from "@/components/ui/timeline";

type CheckpointField = {
  status: "done" | "current" | "default";
  title: string;
  link?: string;
  description: string;
  button: React.ReactNode | false;
  id?: string;
};

export default function DashboardTimeline({
  storeId,
  adminCheckpoints,
}: {
  adminCheckpoints: StoreCheckpoints;
  storeId: string;
}) {
  const checkpointFields: CheckpointField[] = [
    {
      status: adminCheckpoints.hasProducts ? "done" : "current",
      title: "Create Products",
      link: `/store/${storeId}/products`,
      description:
        "Start by creating a list of products that you want to sell in your store. Include detailed descriptions, high-quality images, and accurate pricing. Organize your products into categories and collections to make it easier for customers to browse and find what they're looking for.",
      button: false,
    },
    {
      status: adminCheckpoints.isConnectedToTelegram
        ? "done"
        : adminCheckpoints.hasProducts
          ? "current"
          : "default",
      link: undefined,
      title: "Connect your Store to Telegram",
      description:
        "Connect your store to Telegram to enable clients to access it. Once you've connected your store you can attach to the menu button in your bot, pin it in your telegram channel, and start receiving orders.",
      button: <MarkConnectToTelegramAsDone storeId={storeId} />,
    },
    {
      status: adminCheckpoints.hasBotToken
        ? "done"
        : adminCheckpoints.isConnectedToTelegram
          ? "current"
          : "default",
      link: `/store/${storeId}/settings`,
      title: "Set Bot Token To Your Store",
      description:
        "Set your bot token to your store to enable communication between your store and the client. This allows you to send notifications, updates, and other information to your customers through the Telegram bot.",
      button: false,
    },
    {
      status: adminCheckpoints.hasConnectedPaymentSystem
        ? "done"
        : adminCheckpoints.hasBotToken
          ? "current"
          : "default",
      link: `/store/${storeId}/payment-systems`,
      title: "Connect Payment System",
      description:
        "Choose a payment system that suits your needs and integrate it into your store. Make sure to test the payment system to ensure that it works correctly and that customers can make purchases without any issues.",
      button: false,
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
      title: "Done!",
      description:
        "You are all set! Your store is now ready to launch. Make sure to test all the features and functionalities to ensure that everything is working as expected. If you encounter any errors, feel free to reach out to our support team for assistance.",
      button: false,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Checklist</CardTitle>
        <CardDescription>
          A list of tasks to complete before launching your store.
        </CardDescription>
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
                {checkpointField.title !== "Done!" && (
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
