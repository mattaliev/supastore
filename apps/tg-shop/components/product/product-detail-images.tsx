"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { NoImage } from "@/components/ui/NoImage";
import { cn } from "@/lib/utils";

export default function ProductDetailImages({
  productImages,
}: {
  productImages: string[];
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(1);
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

  if (productImages.length === 0) {
    return <NoImage iconSize={"sm"} className={"h-96"} />;
  }

  return (
    <div className="grid gap-4">
      <Carousel
        className="w-full"
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className={"-ml-2"}>
          {productImages.map((image, index) => (
            <CarouselItem
              key={index}
              onClick={() => setCurrent(index + 1)}
              className={cn("pl-2", {
                "basis-4/5": productImages.length > 1,
              })}
            >
              <Image
                src={image}
                alt={"Image " + index + " of product"}
                width={400}
                height={400}
                className=" w-full rounded-lg object-contain"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className={"left-1"} />
        <CarouselNext className={"right-1"} />
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
