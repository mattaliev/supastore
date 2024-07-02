import { Paginated, TelegramUserList } from "@ditch/lib";
import { DateTime } from "luxon";
import { useTranslations } from "next-intl";

import Link from "@/components/navigation/link";
import Pagination from "@/components/pagination";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CustomerList({
  customersPaginated,
  limit
}: {
  customersPaginated: Paginated<TelegramUserList>;
  limit: number;
}) {
  const t = useTranslations("CustomerListPage.CustomerListTable");

  const formatDate = (date: string) => {
    return DateTime.fromISO(date).toLocaleString(DateTime.DATE_SHORT, {
      locale: "en-US"
    });
  };

  const {
    objects: customers,
    page,
    pages,
    hasPrev,
    hasNext,
    totalItems
  } = customersPaginated;

  const firstProductIndex = (page - 1) * limit + 1;
  const lastProductIndex = Math.min(page * limit, totalItems);

  return (
    <div className="grid gap-3">
      <Tabs defaultValue={"all"}>
        <TabsList>
          <TabsTrigger value="all">{t("Tabs.all")}</TabsTrigger>
          <TabsTrigger value="new">{t("Tabs.new")}</TabsTrigger>
          <TabsTrigger value="return">{t("Tabs.returning")}</TabsTrigger>
          <TabsTrigger value="made-sale">{t("Tabs.madePurchase")}</TabsTrigger>
        </TabsList>
      </Tabs>
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("TableHead.customer")}</TableHead>
                <TableHead>{t("TableHead.status")}</TableHead>
                <TableHead className="hidden sm:table-cell">
                  {t("TableHead.lastVisit")}
                </TableHead>
                <TableHead>{t("TableHead.orders")}</TableHead>
                <TableHead>{t("TableHead.amountSpent")}</TableHead>
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
                      {customer.isNew ? t("Tabs.new") : t("Tabs.returning")}
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
            {t("TableFooter.showing") + " "}
            <strong>
              {firstProductIndex} - {lastProductIndex}
            </strong>{" "}
            {t("TableFooter.of")}{" "}
            <strong>{customersPaginated.totalItems}</strong>{" "}
            {t("TableFooter.customer")}
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
