"use client";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";

import { useRouter } from "@/components/i18n/i18n-navigation";
import ProductDeleteDialog from "@/components/product/product-delete-dialog";
import { useStore } from "@/components/store/store-context";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export default function ProductAdminActions({
  id,
  title
}: {
  id: string;
  title: string;
}) {
  const storeId = useStore();
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);

  const onDialogChange = () => {
    setDialogOpen((prevState) => !prevState);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button aria-haspopup="true" size="icon" variant="ghost">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onSelect={() =>
              router.push(`/store/${storeId}/products/edit/${id}`)
            }
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem>
            <DialogTrigger>Delete</DialogTrigger>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ProductDeleteDialog
        title={title}
        productId={id}
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        isProductsPage={true}
      />
    </Dialog>
  );
}
