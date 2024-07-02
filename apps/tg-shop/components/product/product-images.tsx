import Image from "next/image";

import { NoImage } from "@/components/ui/NoImage";

export default function ProductImages({ images }: { images: string[] }) {
  if (images.length > 0) {
    return (
      <Image
        alt={"product-image-" + images[0]}
        className="object-cover h-48 w-full rounded-xl"
        height={600}
        src={images[0]}
        width={600}
      />
    );
  }

  return <NoImage iconSize={"sm"} className={"h-48 w-full rounded-xl"} />;
}
