"use client";
import {
  CreditCard,
  Home,
  Package,
  Package2,
  PanelLeft,
  Search,
  Settings,
  ShoppingCart,
  Users2
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

import HeaderBreadcrumb from "@/components/layout/header-breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

export default function Header() {
  const pathname = usePathname();
  const storeId = pathname.split("/")[2];
  const { data } = useSession();

  const sheetItemClass =
    "flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground";
  const sheetItemSelectedClass =
    "flex items-center gap-4 px-2.5 text-foreground";

  return (
    <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="sm:hidden">
              <PanelLeft className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="sm:max-w-xs">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="#"
                className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
              >
                <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
                <span className="sr-only">Acme Inc</span>
              </Link>
              <Link
                href={`/store/${storeId}`}
                className={
                  pathname === `/store/${storeId}`
                    ? sheetItemSelectedClass
                    : sheetItemClass
                }
              >
                <Home className="h-5 w-5" />
                Dashboard
              </Link>
              <Link
                href={`/store/${storeId}/orders`}
                className={
                  pathname.startsWith(`/store/${storeId}/orders`)
                    ? sheetItemSelectedClass
                    : sheetItemClass
                }
              >
                <ShoppingCart className="h-5 w-5" />
                Orders
              </Link>
              <Link
                href={`/store/${storeId}/products`}
                className={
                  pathname.startsWith(`/store/${storeId}/products`)
                    ? sheetItemSelectedClass
                    : sheetItemClass
                }
              >
                <Package className="h-5 w-5" />
                Products
              </Link>
              <Link
                href={`/store/${storeId}/customers`}
                className={
                  pathname.startsWith(`/store/${storeId}/customers`)
                    ? sheetItemSelectedClass
                    : sheetItemClass
                }
              >
                <Users2 className="h-5 w-5" />
                Customers
              </Link>
              <Link
                href={`/store/${storeId}/payment-systems`}
                className={
                  pathname.startsWith(`/store/${storeId}/payment-systems`)
                    ? sheetItemSelectedClass
                    : sheetItemClass
                }
              >
                <CreditCard className="h-5 w-5" />
                Payment Systems
              </Link>
              <Link
                href={`/store/${storeId}/settings`}
                className={
                  pathname.startsWith(`/store/${storeId}/settings`)
                    ? sheetItemSelectedClass
                    : sheetItemClass
                }
              >
                <Settings className="h-5 w-5" />
                Settings
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <HeaderBreadcrumb pathname={pathname} />
        <div className="relative ml-auto flex-1 md:grow-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarImage src={data?.user?.photoUrl} alt="User" />
              <AvatarFallback>
                {data?.user &&
                  data?.user?.firstName.charAt(0) +
                    data?.user?.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/*<DropdownMenuItem>Settings</DropdownMenuItem>*/}
            {/*<DropdownMenuItem>Support</DropdownMenuItem>*/}
            <DropdownMenuItem>
              <Link href={`/store`}>Stores</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
    </div>
  );
}
