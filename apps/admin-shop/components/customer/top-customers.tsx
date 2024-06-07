import { customersPaginated } from "@ditch/lib";

import { authenticated } from "@/auth";
import TopCustomerSort from "@/components/customer/top-customer-sort";
import { Link } from "@/components/i18n/i18n-navigation";
import {
  Card,
  CardContent,
  CardDescription,
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

export default async function TopCustomers({
  storeId,
  sortBy,
  accessToken
}: {
  storeId: string;
  sortBy?: "TOTAL_SALES" | "TOTAL_VISITS";
  accessToken: string;
}) {
  const topCustomersResponse = await authenticated(
    accessToken,
    customersPaginated,
    {
      storeId,
      page: 1,
      limit: 5,
      sortBy
    }
  );

  if (!topCustomersResponse) {
    return null;
  }

  const { objects: topCustomers } = topCustomersResponse;

  return (
    <Card>
      <CardHeader className="bg-muted/50 mb-4">
        <CardTitle>Top Customers</CardTitle>
        <CardDescription>
          Check out the customers who interact with your shop the most
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          <TopCustomerSort sortBy={sortBy} />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Sales</TableHead>
                <TableHead>Visits</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topCustomers.map((customer, index) => (
                <TableRow key={customer.id}>
                  <TableCell className="h-8 py-2">
                    <div className="flex flex-col items-start text-sm">
                      <Link
                        href={`/store/${storeId}/customers/detail/${customer.id}`}
                      >
                        <div>
                          {customer.firstName} {customer.lastName}
                        </div>
                      </Link>
                      <div className="text-muted-foreground hidden md:block">
                        {customer.username ? "@" + customer.username : ""}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-2">
                    ${customer.amountSpent}
                  </TableCell>
                  <TableCell className="py-2">
                    {customer.totalVisitCount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
