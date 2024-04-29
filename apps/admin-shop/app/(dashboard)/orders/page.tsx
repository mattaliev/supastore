import {
  EntityState,
  FulfilmentStatus,
  ordersPaginatedGet,
  PaymentStatus,
} from "@ditch/lib";

import OrderAnalytics from "@/components/order/order-analytics";
import OrderList from "@/components/order/order-list";
import OrderPreview from "@/components/order/order-preview";
import Pagination from "@/components/pagination";

type OrderListPageProps = {
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
  searchParams,
}: OrderListPageProps) {
  const {
    objects: orders,
    hasNext,
    hasPrev,
    pages,
    totalItems,
    page,
  } = await ordersPaginatedGet({
    paymentStatus: searchParams.payment_status,
    fulfilmentStatus: searchParams.fulfilment_status,
    state: searchParams.state,
    page: searchParams.page ? parseInt(searchParams.page) : 1,
    limit: searchParams.limit ? parseInt(searchParams.limit) : defaultLimit,
  });

  return (
    <div className="grid flex-1 items-start gap-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3 ">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <OrderAnalytics />
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
