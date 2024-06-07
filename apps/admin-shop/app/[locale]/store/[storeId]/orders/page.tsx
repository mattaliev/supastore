import {
  EntityState,
  FulfilmentStatus,
  ordersPaginatedGet,
  PaymentStatus
} from "@ditch/lib";
import { redirect } from "next/navigation";

import { authenticated } from "@/auth";
import WithAuth, { WithAuthProps } from "@/components/auth/with-auth";
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

async function OrderListPage({
  params,
  searchParams: {
    payment_status,
    fulfilment_status,
    state,
    page: selectedPage,
    limit
  },
  accessToken
}: WithAuthProps<OrderListPageProps>) {
  const { storeId } = params;

  const paginatedOrders = await authenticated(accessToken, ordersPaginatedGet, {
    storeId,
    paymentStatus: payment_status,
    fulfilmentStatus: fulfilment_status,
    state,
    page: selectedPage ? parseInt(selectedPage) : 1,
    limit: limit ? parseInt(limit) : defaultLimit
  });

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

export default WithAuth<OrderListPageProps>(OrderListPage);
