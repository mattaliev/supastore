import { Paginated, TelegramUserList } from "@ditch/lib";
import { DateTime } from "luxon";
import Link from "next/link";

import Pagination from "@/components/pagination";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CustomerList({
  customersPaginated,
  limit,
}: {
  customersPaginated: Paginated<TelegramUserList>;
  limit: number;
}) {
  const formatDate = (date: string) => {
    return DateTime.fromISO(date).toLocaleString(DateTime.DATE_SHORT, {
      locale: "en-US",
    });
  };

  const {
    objects: customers,
    page,
    pages,
    hasPrev,
    hasNext,
    totalItems,
  } = customersPaginated;

  const firstProductIndex = (page - 1) * limit + 1;
  const lastProductIndex = Math.min(page * limit, totalItems);

  return (
    <div className="grid gap-3">
      <Tabs defaultValue={"all"}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="return">Returning</TabsTrigger>
          <TabsTrigger value="made-sale">Made a Purchase</TabsTrigger>
          {/*<TabsTrigger value="draft">Draft</TabsTrigger>*/}
        </TabsList>
      </Tabs>
      <Card>
        <CardHeader>
          <CardTitle>Customers</CardTitle>
          <CardDescription>Recent customers from your store</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">
                  Last Visit
                </TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Amount spent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer, index) => (
                <TableRow key={customer.id}>
                  <TableCell className="h-8">
                    <div className="flex flex-col items-start text-sm">
                      <Link
                        href={`/customers/detail/${customer.id}`}
                        className="hover:underline"
                      >
                        {customer.firstName} {customer.lastName}
                      </Link>
                      <div className="text-muted-foreground  md:block">
                        {customer.username ? "@" + customer.username : ""}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="">
                    <Badge variant={customer.isNew ? "success" : "outline"}>
                      {customer.isNew ? "New" : "Returning"}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {formatDate(customer.lastVisit)}
                  </TableCell>
                  <TableCell className="">{customer.orderCount}</TableCell>
                  <TableCell>${customer.amountSpent}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing{" "}
            <strong>
              {firstProductIndex} - {lastProductIndex}
            </strong>{" "}
            of <strong>{customersPaginated.totalItems}</strong> customer
          </div>
        </CardFooter>
      </Card>
      <Pagination
        page={page}
        totalPages={pages}
        hasNext={hasNext}
        hasPrev={hasPrev}
        limit={limit}
      />
    </div>
  );
}
