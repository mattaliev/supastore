import { paymentMethodsList } from "@ditch/lib";
import { getTranslations } from "next-intl/server";

import { authenticated } from "@/auth";
import WithAuth, { WithAuthProps } from "@/components/auth/with-auth";
import PaymentMethodCreate from "@/components/payment/payment-method-create";
import PaymentMethodDelete from "@/components/payment/payment-method-delete";
import PaymentMethodUpdateDialogDrawer from "@/components/payment/payment-method-update";
import { ProductBadge } from "@/components/product/product-badges";
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

async function PaymentSystemsPage({
  params: { storeId },
  accessToken
}: WithAuthProps<PaymentSystemsPageProps>) {
  const paymentMethods = await authenticated(accessToken, paymentMethodsList, {
    storeId
  });
  const t = await getTranslations("PaymentSystemsPage");

  return (
    <div className="grid grid-cols-1 max-w-[59rem] mx-auto w-full auto-rows-max gap-4">
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>{t("title")}</CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[75%] sm:w-fit">
                    {t("TableHead.name")}
                  </TableHead>
                  <TableHead className={"hidden sm:table-cell"}>
                    {t("TableHead.status")}
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
                      <div className="flex gap-2">
                        <PaymentMethodUpdateDialogDrawer
                          paymentMethod={paymentMethod}
                        />
                        <PaymentMethodDelete
                          paymentMethodId={paymentMethod.id}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <PaymentMethodCreate />
      </div>
    </div>
  );
}

export default WithAuth<PaymentSystemsPageProps>(PaymentSystemsPage);
