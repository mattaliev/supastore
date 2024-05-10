import Link from "next/link";

import { Button } from "@/components/ui/button";
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

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  return (
    <div className="max-w-[59rem] mx-auto grid gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="md:col-span-2 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard</CardTitle>
              <CardDescription>
                Welcome to your store dashboard. Here you can manage your
                products, orders, customers, and more.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Store Sessions This Week</CardDescription>
            <CardTitle className={"text-4xl"}>240</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={"text-muted-foreground text-xs"}>
              +25% from last week
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Store Sessions This Month</CardDescription>
            <CardTitle className={"text-4xl"}>240</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={"text-muted-foreground text-xs"}>
              +25% from last week
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Checklist</CardTitle>
          <CardDescription>
            A list of tasks to complete before launching your store.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Timeline positions="left">
            <TimelineItem status="done">
              <TimelineHeading side="right">
                <Link href="/products" className="hover:underline">
                  Create Products
                </Link>
              </TimelineHeading>
              <TimelineDot status="done" />
              <TimelineLine done />
              <TimelineContent side="right" className="text-sm">
                Start by creating a list of products that you want to sell in
                your store. Include detailed descriptions, high-quality images,
                and accurate pricing. Organize your products into categories and
                collections to make it easier for customers to browse and find
                what they're looking for.
              </TimelineContent>
            </TimelineItem>
            <TimelineItem status="done">
              <TimelineHeading side="right">
                <Link href="#" className="hover:underline">
                  Connect your Store to Telegram
                </Link>
              </TimelineHeading>
              <TimelineDot status="done" />
              <TimelineLine done />
              <TimelineContent className="text-sm ">
                <div className="flex flex-col space-y-3 justify-center items-start">
                  <div>
                    Connect your store to Telegram to enable clients to access
                    it. Once you've connected your store you can attach to the
                    menu button in your bot, pin it in your telegram channel,
                    and start receiving orders.
                  </div>
                  <Button size={"sm"}>Mark as Done</Button>
                </div>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem status="done">
              <TimelineHeading side="right">
                Set Bot Token To Your Store
              </TimelineHeading>
              <TimelineDot status="current" />
              <TimelineLine />
              <TimelineContent side="right" className="text-sm">
                Set your bot token to your store to enable communication between
                your store and the client. This allows you to send
                notifications, updates, and other information to your customers
                through the Telegram bot.
              </TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineHeading>Connect Payment System</TimelineHeading>
              <TimelineDot />
              <TimelineLine />
              <TimelineContent className="text-sm">
                Choose a payment system that suits your needs and integrate it
                into your store. Make sure to test the payment system to ensure
                that it works correctly and that customers can make purchases
                without any issues.
              </TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineHeading side="right">Done!</TimelineHeading>
              <TimelineDot />
              <TimelineLine />
              <TimelineContent side="right" className="text-sm">
                You are all set! Your store is now ready to launch. Make sure to
                test all the features and functionalities to ensure that
                everything is working as expected. If you encounter any errors,
                feel free to reach out to our support team for assistance.
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        </CardContent>
      </Card>
    </div>
  );
}
