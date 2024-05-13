import { customersPaginated } from "@ditch/lib";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authenticated, authOptions } from "@/auth";
import TopCustomerSort from "@/components/customer/top-customer-sort";
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
  sortBy
}: {
  sortBy?: "TOTAL_SALES" | "TOTAL_VISITS";
}) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.accessToken) {
    redirect("/auth/signIn?callbackUrl=/customers");
  }

  const topCustomersResponse = await authenticated(
    session.user.accessToken,
    customersPaginated,
    {
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
                      <div>
                        {customer.firstName} {customer.lastName}
                      </div>
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
