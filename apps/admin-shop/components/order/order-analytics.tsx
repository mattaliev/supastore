import { salesAnalyticsGet } from "@ditch/lib";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default async function OrderAnalytics({ storeId }: { storeId: string }) {
  const {
    salesThisWeek,
    salesThisMonth,
    salesIncreaseThisWeek,
    salesIncreaseThisMonth
  } = await salesAnalyticsGet({ storeId });

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
      <Card className="sm:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle>Your Orders</CardTitle>
          <CardDescription className="max-w-lg text-balance leading-relaxed">
            Introducing Our Dynamic Orders Dashboard for Seamless Management and
            Insightful Analysis.
          </CardDescription>
        </CardHeader>
        {/*<CardFooter>*/}
        {/*  <Button>Create New Order</Button>*/}
        {/*</CardFooter>*/}
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>This Week</CardDescription>
          <CardTitle className="text-4xl">${salesThisWeek}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
            {salesIncreaseThisWeek >= 0
              ? "+" + salesIncreaseThisWeek
              : salesIncreaseThisWeek}
            % from last week
          </div>
        </CardContent>
        <CardFooter>
          <Progress
            value={Math.abs(salesIncreaseThisWeek)}
            aria-label={
              salesIncreaseThisWeek >= 0
                ? "+" + salesIncreaseThisWeek + "% increase"
                : salesIncreaseThisWeek + "% decrease"
            }
            indicatorColor={
              salesIncreaseThisWeek >= 0 ? "bg-primary" : "bg-destructive"
            }
          />
        </CardFooter>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>This Month</CardDescription>
          <CardTitle className="text-4xl">${salesThisMonth}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
            {salesIncreaseThisMonth > 0
              ? "+" + salesIncreaseThisMonth
              : salesIncreaseThisMonth}
            % from last month
          </div>
        </CardContent>
        <CardFooter>
          <Progress
            value={Math.abs(salesIncreaseThisMonth)}
            aria-label={
              salesIncreaseThisMonth > 0
                ? "+" + salesIncreaseThisMonth + "% increase"
                : salesIncreaseThisMonth + "% decrease"
            }
            indicatorColor={
              salesIncreaseThisMonth > 0 ? "bg-primary" : "bg-destructive"
            }
          />
        </CardFooter>
      </Card>
    </div>
  );
}
