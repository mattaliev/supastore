"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { twMerge } from "tailwind-merge";

import Link from "@/components/navigation/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getNavOptions } from "@/config/side-nav";

function SideNavOption({
  href,
  icon,
  label,
  selected,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  selected: boolean;
}) {
  const t = useTranslations("Nav");
  const navItemClass =
    "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8";
  const navItemSelectedClass = "bg-accent";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          className={
            selected
              ? twMerge(navItemClass, navItemSelectedClass)
              : navItemClass
          }
        >
          {icon}
          <span className="sr-only">{t(label)}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">{t(label)}</TooltipContent>
    </Tooltip>
  );
}

export default function SideNav() {
  const navOptions = getNavOptions();

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
          href="/"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          inStore={false}
          localized={false}
        >
          <Image
            src={"/supastore logo white.svg"}
            alt={"Supastore logo"}
            width={20}
            height={20}
            className="transition-all group-hover:scale-110 object-contain"
          />
          <span className="sr-only">Acme Inc</span>
        </Link>
        {navOptions.map(
          (option) =>
            option.href !== "/settings" && (
              <SideNavOption key={option.href} {...option} />
            ),
        )}
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        {navOptions
          .filter((option) => option.href === "/settings")
          .map((option) => (
            <SideNavOption key={option.href} {...option} />
          ))}
      </nav>
    </aside>
  );
}
