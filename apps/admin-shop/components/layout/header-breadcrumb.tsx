"use client";
import { useTranslations } from "next-intl";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

export default function HeaderBreadcrumb({ pathname }: { pathname: string }) {
  const t = useTranslations("HeaderBreadcrumb");

  const pathnames: Record<string, string[]> = {
    "": [t("dashboard")],
    products: [t("dashboard"), t("products")],
    orders: [t("dashboard"), t("orders")],
    "orders/edit": [t("dashboard"), t("orders"), t("edit")],
    "products/create": [t("dashboard"), t("products"), t("create")],
    "products/edit": [t("dashboard"), t("products"), t("edit")],
    customers: [t("dashboard"), t("customers")],
    "customers/detail": [t("dashboard"), t("customers"), t("details")],
    "payment-systems": [t("dashboard"), t("payment-systems")],
    analytics: [t("settings")],
    settings: [t("dashboard"), t("settings")]
  };

  const formattedPathname = pathname.split("/").slice(4, 6).join("/");
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
