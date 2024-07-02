"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { ImageOff } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const iconVariants = cva("text-muted-foreground", {
  variants: {
    iconSize: {
      default: "h-12 w-12",
      xs: "h-4 w-4",
      sm: "h-8 w-8",
      lg: "h-16 w-16",
      xl: "h-20 w-20"
    }
  },
  defaultVariants: {
    iconSize: "default"
  }
});

type NoImageProps = VariantProps<typeof iconVariants> & {
  className?: string;
};

const NoImage = React.forwardRef<HTMLDivElement, NoImageProps>(
  ({ iconSize, className }, ref) => {
    return (
      <div
        className={cn(
          "flex items-center justify-center h-full w-full bg-muted rounded-md",
          className
        )}
      >
        <ImageOff className={cn(iconVariants({ iconSize }))} />
      </div>
    );
  }
);
NoImage.displayName = "NoImage";

export { NoImage };
