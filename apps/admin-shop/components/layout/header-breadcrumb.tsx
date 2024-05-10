"use client";
import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const pathnames: Record<string, string[]> = {
  "/": ["Dashboard"],
  "/products": ["Dashboard", "Products"],
  "/orders": ["Dashboard", "Orders"],
  "/orders/edit": ["Dashboard", "Orders", "Edit"],
  "/products/create": ["Dashboard", "Products", "Create"],
  "/products/edit": ["Dashboard", "Products", "Edit"],
  "/customers": ["Dashboard", "Customers"],
  "/customers/detail": ["Dashboard", "Customers", "Detail"],
  "/payment-systems": ["Dashboard", "Payment Systems"],
  "/analytics": ["Settings"],
};

export default function HeaderBreadcrumb({ pathname }: { pathname: string }) {
  const formattedPathname = pathname.split("/").slice(0, 3).join("/");
  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        {formattedPathname
          .split("/")
          .slice(0, 3)
          .map((path, index) => (
            <div key={index} className={"inline-flex items-center gap-3"}>
              {index < formattedPathname.split("/").length - 1 ? (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href={`/${path}`}>
                        {pathnames[formattedPathname][index]}
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </>
              ) : (
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {pathnames[formattedPathname][index]}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              )}
            </div>
          ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
