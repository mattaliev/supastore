"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

const pathnames: Record<string, string[]> = {
  "/": ["Dashboard"],
  "/products": ["Dashboard", "Products"],
  "/orders": ["Dashboard", "Orders"],
  "/orders/edit": ["Dashboard", "Orders", "Edit"],
  "/products/create": ["Dashboard", "Products", "Create"],
  "/products/edit": ["Dashboard", "Products", "Edit"],
  "/customers": ["Dashboard", "Customers"],
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
            <>
              {index < formattedPathname.split("/").length - 1 ? (
                <div key={path} className="inline-flex items-center gap-3">
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href={`/${path}`}>
                        {pathnames[formattedPathname][index]}
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </div>
              ) : (
                <BreadcrumbItem key={path}>
                  <BreadcrumbPage>
                    {pathnames[formattedPathname][index]}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              )}
            </>
          ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
