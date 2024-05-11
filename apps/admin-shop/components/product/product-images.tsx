import { ProductImage } from "@ditch/lib";

import MultiFileSortableUpload from "@/components/file-upload/multi-file-sortable-upload";
import { ProductFieldErrors } from "@/components/product/schemes";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

export default function ProductImages({
  images,
  imagesFieldError
}: {
  images?: ProductImage[];
  imagesFieldError?: ProductFieldErrors["imageUrls"];
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Product Images</CardTitle>
        <CardDescription>Drag and drop to reorder images</CardDescription>
      </CardHeader>
      <CardContent>
        <MultiFileSortableUpload
          initialFileStates={images?.map((image) => ({
            key: image.id,
            file: image.url,
            progress: "COMPLETE"
          }))}
        />
      </CardContent>
      <CardFooter>
        {imagesFieldError && (
          <p className="text-destructive text-start text-xs">
            {imagesFieldError[0]}
          </p>
        )}
      </CardFooter>
    </Card>
  );
}
