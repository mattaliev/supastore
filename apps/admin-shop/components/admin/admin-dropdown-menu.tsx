"use client";

import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

import Link from "@/components/navigation/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export default function AdminDropdownMenu() {
  const t = useTranslations("Nav");
  const { data } = useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarImage src={data?.user?.photoUrl} alt="User" />
          <AvatarFallback>
            {data?.user &&
              data?.user?.firstName.charAt(0) + data?.user?.lastName.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t("dropdown.label")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/*<DropdownMenuItem>Settings</DropdownMenuItem>*/}
        {/*<DropdownMenuItem>Support</DropdownMenuItem>*/}
        <DropdownMenuItem>
          <Link href={`/store`} inStore={false}>
            {t("dropdown.stores")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          {t("dropdown.logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
