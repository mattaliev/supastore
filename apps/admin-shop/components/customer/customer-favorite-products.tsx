import { Product } from "@ditch/lib";

import Link from "@/components/navigation/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CustomerFavoriteProducts({
  favoriteProducts
}: {
  favoriteProducts?: Product[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Favorite Products</CardTitle>
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
                  {product.title}
                </Link>
              </div>
            ))}
          {!favoriteProducts && (
            <div className="my-8 font-semibold text-sm">
              Customer does not have favorites yet
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
