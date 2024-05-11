import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

export default function CustomerListHeader() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
      <div className="grid sm:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Your Customers</CardTitle>
            <CardDescription>
              Manage your customers and their orders. Analyze their sessions and
              sales patterns to imporove your store.
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
  );
}
