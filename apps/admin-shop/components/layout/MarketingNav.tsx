import { PanelLeft } from "lucide-react";
import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";

import { authOptions } from "@/auth";
import AdminDropdownMenu from "@/components/admin/admin-dropdown-menu";
import Link from "@/components/navigation/link";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/logo";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

function MarketingNavOption({
  label,
  href,
  inStore
}: {
  label: string;
  href: string;
  inStore: boolean;
}) {
  return (
    <Link
      href={href}
      inStore={inStore}
      className={
        "hidden sm:block text-sm text-muted-foreground hover:text-primary transition ease-in-out duration-300 hover:-translate-y-1"
      }
    >
      {label}
    </Link>
  );
}

function MobileMarketingNavOption({
  label,
  href,
  inStore
}: {
  label: string;
  href: string;
  inStore: boolean;
}) {
  return (
    <Link
      href={href}
      inStore={inStore}
      localized={false}
      className={
        "flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
      }
    >
      {label}
    </Link>
  );
}

export default async function MarketingNav() {
  const session = await getServerSession(authOptions);
  const t = await getTranslations("LandingPage.Nav");

  const marketingNavOptions = [
    {
      label: t("guides"),
      href: "https://guides.ditch-concept.com",
      inStore: false
    },
    {
      label: t("pricing"),
      href: "/",
      inStore: false
    },
    {
      label: t("contact"),
      href: "https://t.me/matveyaliev",
      inStore: false
    }
  ];

  return (
    <nav className={"flex items-center justify-between p-6"}>
      <div className={"flex gap-2 sm:gap-8 justify-start items-center"}>
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="ghost" className="sm:hidden">
              <PanelLeft className="h-5 w-5" />
              <span className="sr-only">Toggle</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="sm:max-w-xs">
            <nav className="grid gap-6 text-lg font-medium">
              <Logo />
              {marketingNavOptions.map((option) => (
                <MobileMarketingNavOption
                  key={option.label}
                  label={option.label}
                  href={option.href}
                  inStore={option.inStore}
                />
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        <Logo />
        {marketingNavOptions.map((option) => (
          <MarketingNavOption
            key={option.label}
            label={option.label}
            href={option.href}
            inStore={option.inStore}
          />
        ))}
      </div>
      <div className={"flex gap-4"}>
        {session ? (
          <AdminDropdownMenu />
        ) : (
          <Link href={"/auth/signIn"} inStore={false} localized={false}>
            <Button size={"sm"}>{t("signIn")}</Button>
          </Link>
        )}
      </div>
    </nav>
  );
}
