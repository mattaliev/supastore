import { customerDetail } from "@ditch/lib";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authenticated, authOptions } from "@/auth";
import CustomerDetailHeader from "@/components/customer/customer-detail-header";
import CustomerEvents from "@/components/customer/customer-events";
import CustomerFavoriteProducts from "@/components/customer/customer-favorite-products";
import CustomerInformation from "@/components/customer/customer-information";
import CustomerOrders from "@/components/customer/customer-orders";
import { Button } from "@/components/ui/button";

type CustomerDetailPageProps = {
  params: {
    storeId: string;
    customerId: string;
  };
};

export default async function CustomerDetailPage({
  params
}: CustomerDetailPageProps) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.accessToken) {
    redirect(
      `/auth/signIn?callbackUrl=${encodeURIComponent(`/store/${params.storeId}/customers`)}`
    );
  }

  const { customerId, storeId } = params;

  if (!customerId) {
    notFound();
  }

  const customer = await authenticated(
    session.user.accessToken,
    customerDetail,
    { userId: customerId, storeId }
  );

  if (!customer) {
    notFound();
  }

  return (
    <div className="grid flex-1 auto-rows-max gap-4 max-w-[59rem] mx-auto w-full">
      <CustomerDetailHeader customer={customer} />
      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg-gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8 md:order-first order-last">
          <CustomerOrders customer={customer} storeId={params.storeId} />
          <CustomerEvents events={customer.events} storeId={params.storeId} />
        </div>
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8 order-first md:order-last">
          <CustomerInformation customer={customer} />
          <CustomerFavoriteProducts
            storeId={params.storeId}
            favoriteProducts={customer.favoriteProducts}
          />
        </div>
      </div>
      <div>
        <Button size={"sm"} type={"button"} variant="default">
          Send Personalised Message
        </Button>
      </div>
    </div>
  );
}
