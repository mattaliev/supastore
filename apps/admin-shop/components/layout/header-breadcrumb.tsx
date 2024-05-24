"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

const pathnames: Record<string, string[]> = {
  "": ["Dashboard"],
  products: ["Dashboard", "Products"],
  orders: ["Dashboard", "Orders"],
  "orders/edit": ["Dashboard", "Orders", "Edit"],
  "products/create": ["Dashboard", "Products", "Create"],
  "products/edit": ["Dashboard", "Products", "Edit"],
  customers: ["Dashboard", "Customers"],
  "customers/detail": ["Dashboard", "Customers", "Detail"],
  "payment-systems": ["Dashboard", "Payment Systems"],
  analytics: ["Settings"],
  settings: ["Dashboard", "Settings"]
};

export default function HeaderBreadcrumb({ pathname }: { pathname: string }) {
  const formattedPathname = pathname.split("/").slice(3, 5).join("/");
  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        {pathnames[formattedPathname].map((path, index) => (
          <div key={index} className={"inline-flex items-center gap-3"}>
            {index < pathnames[formattedPathname].length - 1 ? (
              <>
                <BreadcrumbItem>{path}</BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            ) : (
              <BreadcrumbItem>
                <BreadcrumbPage>{path}</BreadcrumbPage>
              </BreadcrumbItem>
            )}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
