import { CartItem } from "@ditch/lib";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

import CartItemQuantity from "@/components/cart/cart-item-quantity";
import { NoImage } from "@/components/ui/NoImage";

export default async function CartItems({
  items
}: {
  items: CartItem[];
}): Promise<JSX.Element> {
  const t = await getTranslations("ProductCatalogPage");

  return (
    <>
      {items.map((item) => (
        <div key={item.id}>
          <div className={"flex items-start gap-4"}>
            {item.productVariant.images.length > 0 ? (
              <Image
                src={item.productVariant.images[0]}
                alt={item.productVariant.name}
                width={140}
                height={140}
                className={"aspect-square rounded-lg object-cover"}
              />
            ) : (
              <NoImage
                iconSize={"sm"}
                className={"aspect-square w-[140px] rounded-lg object-cover"}
              />
            )}
            <div className={"grid gap-2"}>
              <div>
                <div className="font-semibold text-telegram-text-color">
                  {item.productVariant.name}
                </div>
                {item.size.sizeEn && (
                  <div className="text-sm text-telegram-hint-color">
                    {t("sizeTitle")}: {item.size.sizeEn}
                    {item.size.sizeRu && " / " + item.size.sizeRu}
                  </div>
                )}
              </div>
              <div className="font-semibold text-telegram-text-color">
                ${item.size.price}
              </div>
              <CartItemQuantity item={item} />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
