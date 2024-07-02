"use client";
import { PanelLeft, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

import AdminDropdownMenu from "@/components/admin/admin-dropdown-menu";
import Link from "@/components/navigation/link";
import { Input } from "@/components/ui/input";
import Logo from "@/components/ui/logo";
import { getNavOptions } from "@/config/side-nav";

export default function Header() {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const storeId = pathname.split("/")[2];
  const { data } = useSession();
  const navOptions = getNavOptions();

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
              <span className="sr-only">{t("toggle")}</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="sm:max-w-xs">
            <nav className="grid gap-6 text-lg font-medium">
              <Logo />
              {navOptions.map((navOption) => {
                return (
                  <Link
                    key={navOption.href}
                    href={navOption.href}
                    className={
                      navOption.selected
                        ? sheetItemSelectedClass
                        : sheetItemClass
                    }
                  >
                    {navOption.icon}
                    {t(navOption.label)}
                  </Link>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>
        {/*<HeaderBreadcrumb pathname={pathname} />*/}
        <div className="relative ml-auto flex-1 md:grow-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("search-placeholder")}
            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
          />
        </div>
        <AdminDropdownMenu />
      </header>
    </div>
  );
}
