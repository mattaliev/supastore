import Image from "next/image";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { ProductImage } from "@/lib/api/types";

export default function ProductImages({ images }: { images: ProductImage[] }) {
  return (
    <Carousel
      className="w-full"
      opts={{
        align: "start",
        loop: true,
      }}
    >
      <CarouselContent>
        {images.map((image, index) => {
          return (
            <CarouselItem key={index}>
              <Image
                alt={"product-image-" + index}
                className="object-cover w-full h-96 rounded-t-lg"
                height={600}
                src={image.url}
                width={600}
              />
            </CarouselItem>
          );
        })}
      </CarouselContent>
    </Carousel>
  );
}
