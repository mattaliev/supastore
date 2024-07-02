import { ProductVariant } from "@ditch/lib";
import { getTranslations } from "next-intl/server";

import Link from "@/components/navigation/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function CustomerFavoriteProducts({
  favoriteProducts
}: {
  favoriteProducts?: ProductVariant[];
}) {
  const t = await getTranslations(
    "CustomerDetailPage.CustomerFavoriteProducts"
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2 text-muted-foreground text-sm">
          {favoriteProducts &&
            favoriteProducts.map((product, index) => (
              <div
                key={index}
                className="flex items-center justify-start space-x-4 text-sm"
              >
                <p>{index + 1}</p>
                <Link
                  href={`/products/edit/${product.id}`}
                  className="hover:underline"
                >
                  {product.name}
                </Link>
              </div>
            ))}
          {!favoriteProducts && (
            <div className="my-8 font-semibold text-sm">
              {t("noFavoriteProducts")}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
