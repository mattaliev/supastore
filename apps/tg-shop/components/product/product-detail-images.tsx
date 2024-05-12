"use client";

import { ProductImage } from "@ditch/lib";
import Image from "next/image";
import { useEffect, useState } from "react";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem
} from "@/components/ui/carousel";

export default function ProductDetailImages({
  productImages
}: {
  productImages: ProductImage[];
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(1);
  const [count, setCount] = useState(0);

  console.log(count);
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
    <div className="grid gap-4">
      <Image
        src={productImages[current - 1].url}
        alt="Product Image"
        width={400}
        height={400}
        className="aspect-square w-full rounded-lg object-cover cursor-pointer"
      />
      <Carousel
        className="w-full"
        setApi={setApi}
        opts={{
          align: "start",
          loop: true
        }}
      >
        <CarouselContent>
          {productImages.map((image, index) => (
            <CarouselItem
              key={index}
              className="basis-1/3"
              onClick={() => setCurrent(index + 1)}
            >
              <Image
                src={image.url}
                alt={"Image " + index + " of product"}
                width={400}
                height={400}
                className="aspect-square w-full rounded-lg object-cover"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      {productImages.length > 3 && (
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
      )}
    </div>
  );
}
