"use client";

import {
  CreditCard,
  Home,
  LineChart,
  Mail,
  Package,
  Settings,
  ShoppingCart,
  Users2,
} from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";

export function getNavOptions() {
  const pathname = usePathname();
  const pathParam = pathname.split("/").slice(4);

  return [
    {
      href: "/",
      icon: <Home className="h-5 w-5" />,
      label: "dashboard",
      selected: pathParam.length === 0,
    },
    {
      href: "/orders",
      icon: <ShoppingCart className="h-5 w-5" />,
      label: "orders",
      selected: pathParam[0] === "orders",
    },
    {
      href: "/products",
      icon: <Package className="h-5 w-5" />,
      label: "products",
      selected: pathParam[0] === "products",
    },
    {
      href: "/customers",
      icon: <Users2 className="h-5 w-5" />,
      label: "customers",
      selected: pathParam[0] === "customers",
    },
    {
      href: "/marketing",
      icon: <Mail className="h-5 w-5" />,
      label: "marketing",
      selected: pathParam[0] === "marketing",
    },
    {
      href: "/payment-systems",
      icon: <CreditCard className="h-5 w-5" />,
      label: "payment-systems",
      selected: pathParam[0] === "payment-systems",
    },
    {
      href: "/analytics",
      icon: <LineChart className="h-5 w-5" />,
      label: "analytics",
      selected: pathParam[0] === "analytics",
    },
    {
      href: "/settings",
      icon: <Settings className="h-5 w-5" />,
      label: "settings",
      selected: pathParam[0] === "settings",
    },
  ];
}
