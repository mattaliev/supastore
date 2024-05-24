import { paymentMethodsList } from "@ditch/lib";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authenticated, authOptions } from "@/auth";
import PaymentMethodCreate from "@/components/payment/payment-method-create";
import PaymentMethodDelete from "@/components/payment/payment-method-delete";
import PaymentMethodUpdateDialogDrawer from "@/components/payment/payment-method-update";
import { ProductBadge } from "@/components/product/product-badges";
import { StoreProvider } from "@/components/store/store-context";
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

export const dynamic = "force-dynamic";

type PaymentSystemsPageProps = {
  params: {
    storeId: string;
  };
};

export default async function PaymentSystemsPage({
  params
}: PaymentSystemsPageProps) {
  const { storeId } = params;
  const session = await getServerSession(authOptions);

  if (!session || !session.user.accessToken) {
    redirect(
      `/auth/signIn?callbackUrl=${encodeURIComponent(`/store/${storeId}/payment-systems`)}`
    );
  }

  const paymentMethods = await authenticated(
    session.user.accessToken,
    paymentMethodsList,
    { storeId }
  );

  return (
    <div className="grid grid-cols-1 max-w-[59rem] mx-auto w-full auto-rows-max gap-4">
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Payment Systems</CardTitle>
            <CardDescription>
              Connect 40+ payment gateways to your store and accept payment from
              all over the world.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[75%] sm:w-fit">Name</TableHead>
                  <TableHead className={"hidden sm:table-cell"}>
                    Status
                  </TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentMethods?.map((paymentMethod) => (
                  <TableRow key={paymentMethod.id}>
                    <TableCell>{paymentMethod.name}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <ProductBadge state={paymentMethod.state} />
                    </TableCell>
                    <TableCell>
                      <StoreProvider storeId={storeId}>
                        <div className="flex gap-2">
                          <PaymentMethodUpdateDialogDrawer
                            paymentMethod={paymentMethod}
                          />
                          <PaymentMethodDelete
                            paymentMethodId={paymentMethod.id}
                          />
                        </div>
                      </StoreProvider>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <StoreProvider storeId={storeId}>
          <PaymentMethodCreate />
        </StoreProvider>
      </div>
    </div>
  );
}
