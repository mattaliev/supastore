import { customersPaginated } from "@ditch/lib";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authenticated, authOptions } from "@/auth";
import CustomerList from "@/components/customer/customer-list";
import CustomerListHeader from "@/components/customer/customer-list-header";
import TopCustomers from "@/components/customer/top-customers";

type CustomersPageProps = {
  searchParams: {
    page?: string;
    limit?: string;
    sortByTop?: "TOTAL_SALES" | "TOTAL_VISITS";
  };
};

const defaultLimit = 10;

export default async function CustomersPage({
  searchParams,
}: CustomersPageProps) {
  const { page: selectedPage, limit, sortByTop } = searchParams;

  const session = await getServerSession(authOptions);

  if (!session || !session.user.accessToken) {
    redirect("/auth/signIn?callbackUrl=/customers");
  }

  const paginatedCustomers = await authenticated(
    session.user.accessToken,
    customersPaginated,
    {
      page: selectedPage ? parseInt(selectedPage) : 1,
      limit: limit ? parseInt(limit) : defaultLimit,
    },
  );

  if (!paginatedCustomers) {
    notFound();
  }

  return (
    <div className="grid flex-1 items-start gap-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <CustomerListHeader />
        <CustomerList
          customersPaginated={paginatedCustomers}
          limit={defaultLimit}
        />
      </div>
      <TopCustomers sortBy={sortByTop || "TOTAL_SALES"} />
    </div>
  );
}
