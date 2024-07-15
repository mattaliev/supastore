"use client";
import { ProductVariant } from "@ditch/lib";

import MultiFileSortableUpload from "@/components/file-upload/multi-file-sortable-upload";
import { ProductVariantStateUpdate } from "@/components/product/hooks";

export default function ProductImages({
  variant,
  updateVariantField,
  variantIndex
}: {
  variant?: Partial<ProductVariant>;
  updateVariantField: (args: ProductVariantStateUpdate) => void;
  variantIndex: number;
}) {
  return (
    <>
      <MultiFileSortableUpload
        initialFileStates={variant?.images?.map((image) => ({
          key: image,
          file: image,
          progress: "COMPLETE"
        }))}
        onChange={(fileStates) => {
          const imageUrls = fileStates.map((fileState) =>
            typeof fileState.file === "string"
              ? fileState.file
              : URL.createObjectURL(fileState.file)
          );
          updateVariantField({
            field: "images",
            value: imageUrls,
            variantIndex
          });
        }}
      />
      {variant?.images &&
        variant?.images.length > 0 &&
        variant.images.map((image) => (
          <input
            key={image}
            type={"hidden"}
            name={variantIndex + "images"}
            value={image}
          />
        ))}
    </>
  );
}
