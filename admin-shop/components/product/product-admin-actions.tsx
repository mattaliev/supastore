"use client";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import ProductDeleteDialog from "@/components/product/product-delete-dialog";
import { useState } from "react";

export default function ProductAdminActions({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
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
            onSelect={() => router.push(`/products/edit/${id}`)}
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
