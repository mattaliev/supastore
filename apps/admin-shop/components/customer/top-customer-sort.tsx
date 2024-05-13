"use client";
import { ArrowDownUp } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

export default function TopCustomerSort({
  sortBy
}: {
  sortBy?: "TOTAL_SALES" | "TOTAL_VISITS";
}) {
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleSelect = (value: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("sortByTop", value);
    replace(`${pathname}?${newSearchParams.toString()}`, { scroll: false });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="ml-auto">
        <Button
          variant={"outline"}
          size="sm"
          className="flex items-center gap-1"
        >
          <ArrowDownUp className="h-3.5 w-3.5" />
          <span className="">Sort</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-4">
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        <Separator />
        <DropdownMenuRadioGroup
          value={sortBy}
          onValueChange={(value) => handleSelect(value)}
        >
          <DropdownMenuRadioItem value={"TOTAL_VISITS"}>
            Total visits
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={"TOTAL_SALES"}>
            Total sales
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
