import { customersPaginated } from "@ditch/lib";
import { notFound } from "next/navigation";

import { authenticated } from "@/auth";
import WithAuth, { WithAuthProps } from "@/components/auth/with-auth";
import CustomerList from "@/components/customer/customer-list";
import CustomerListHeader from "@/components/customer/customer-list-header";
import TopCustomers from "@/components/customer/top-customers";

type CustomersPageProps = {
  params: {
    storeId: string;
  };
  searchParams: {
    page?: string;
    limit?: string;
    sortByTop?: "TOTAL_SALES" | "TOTAL_VISITS";
  };
};

const defaultLimit = 10;

async function CustomersPage({
  params: { storeId },
  searchParams: { page: selectedPage, limit, sortByTop },
  accessToken
}: WithAuthProps<CustomersPageProps>) {
  const paginatedCustomers = await authenticated(
    accessToken,
    customersPaginated,
    {
      storeId: storeId,
      page: selectedPage ? parseInt(selectedPage) : 1,
      limit: limit ? parseInt(limit) : defaultLimit
    }
  );

  if (!paginatedCustomers) {
    notFound();
  }

  return (
    <div className="grid flex-1 items-start gap-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3 mx-auto">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <CustomerListHeader />
        <CustomerList
          customersPaginated={paginatedCustomers}
          limit={defaultLimit}
        />
      </div>
      <TopCustomers
        storeId={storeId}
        sortBy={sortByTop || "TOTAL_SALES"}
        accessToken={accessToken}
      />
    </div>
  );
}

export default WithAuth<CustomersPageProps>(CustomersPage);
