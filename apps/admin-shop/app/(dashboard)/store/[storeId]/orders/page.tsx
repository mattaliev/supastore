import {
  EntityState,
  FulfilmentStatus,
  ordersPaginatedGet,
  PaymentStatus
} from "@ditch/lib";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authenticated, authOptions } from "@/auth";
import OrderAnalytics from "@/components/order/order-analytics";
import OrderList from "@/components/order/order-list";
import OrderPreview from "@/components/order/order-preview";
import Pagination from "@/components/pagination";

type OrderListPageProps = {
  params: {
    storeId: string;
  };
  searchParams: {
    payment_status?: PaymentStatus;
    fulfilment_status?: FulfilmentStatus;
    state?: EntityState;
    page?: string;
    limit?: string;
  };
};

export const dynamic = "force-dynamic";

const defaultLimit = 10;

export default async function OrderListPage({
  params,
  searchParams
}: OrderListPageProps) {
  const { storeId } = params;
  const session = await getServerSession(authOptions);

  if (!session || !session.user.accessToken) {
    redirect(
      `/auth/signIn?callbackUrl=/store/${encodeURIComponent(params.storeId)}/orders`
    );
  }

  const paginatedOrders = await authenticated(
    session.user.accessToken,
    ordersPaginatedGet,
    {
      storeId,
      paymentStatus: searchParams.payment_status,
      fulfilmentStatus: searchParams.fulfilment_status,
      state: searchParams.state,
      page: searchParams.page ? parseInt(searchParams.page) : 1,
      limit: searchParams.limit ? parseInt(searchParams.limit) : defaultLimit
    }
  );

  if (!paginatedOrders) {
    redirect("/error");
  }

  const {
    objects: orders,
    hasNext,
    hasPrev,
    pages,
    totalItems,
    page
  } = paginatedOrders;

  return (
    <div className="grid flex-1 items-start gap-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3 ">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <OrderAnalytics storeId={storeId} />
        <div className="grid gap-3">
          <OrderList
            storeId={storeId}
            orders={orders}
            page={page}
            limit={defaultLimit}
            totalOrderCount={totalItems}
          />
          <Pagination
            page={page}
            totalPages={pages}
            limit={defaultLimit}
            hasNext={hasNext}
            hasPrev={hasPrev}
          />
        </div>
      </div>
      <div>
        <OrderPreview
          storeId={storeId}
          orders={orders}
          hasNext={hasNext}
          hasPrev={hasPrev}
          limit={defaultLimit}
          totalItems={totalItems}
          page={page}
        />
      </div>
    </div>
  );
}
