import Image from "next/image";

import Link from "@/components/navigation/link";
import { cn } from "@/lib/utils";

export default function ProductVariants({
  variants,
  selectedVariantId
}: {
  variants: {
    id: string;
    name: string;
    images: string[];
  }[];
  selectedVariantId: string;
}) {
  return (
    <div className="flex gap-2">
      {variants.map((variant) => (
        <div
          key={variant.id}
          className={cn("w-16 rounded-md", {
            "border-2 border-telegram-button-color":
              variant.id === selectedVariantId
          })}
        >
          <Link href={`/product/${variant.id}`}>
            <Image
              src={variant.images[0]}
              alt={variant.name}
              width={100}
              height={100}
              className={"object-contain rounded-md"}
            />
          </Link>
        </div>
      ))}
    </div>
  );
}
