import Image from "next/image";
import { useEffect, useState } from "react";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { ProductImage } from "@/lib/api/types";

export default function ProductImages({ images }: { images: ProductImage[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <>
      <Carousel
        className="w-full z-10"
        setApi={setApi}
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
      <div className="flex justify-center mt-2">
        {Array.from({ length: count }).map((_, index) => (
          <span
            key={index}
            className={`inline-block w-2 h-2 rounded-full bg-gray-400 mx-1 ${
              index + 1 === current ? "bg-telegram-button-color" : ""
            }`}
            onClick={() => api && api.scrollTo(index)}
          />
        ))}
      </div>
    </>
  );
}
