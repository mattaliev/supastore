"use client";

import { XIcon } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { Input, type InputProps } from "./input";

export type InputTagsProps = Omit<InputProps, "value" | "onChange"> & {
  maxCount?: number;
  value: string[];
  onChange: React.Dispatch<React.SetStateAction<string[]>>;
};

const InputTags = React.forwardRef<HTMLInputElement, InputTagsProps>(
  ({ className, value, onChange, maxCount, ...props }, ref) => {
    const [pendingDataPoint, setPendingDataPoint] = React.useState("");

    React.useEffect(() => {
      if (pendingDataPoint.includes(",")) {
        const newDataPoints = new Set([
          ...value,
          ...pendingDataPoint.split(",").map((chunk) => chunk.trim())
        ]);
        const arrayDataPoints = Array.from(newDataPoints).slice(0, maxCount);
        onChange(arrayDataPoints);
        setPendingDataPoint("");
      }
    }, [pendingDataPoint, onChange, value]);

    const addPendingDataPoint = () => {
      if (pendingDataPoint) {
        if (!maxCount || value.length < maxCount) {
          const newDataPoints = new Set([...value, pendingDataPoint]);
          onChange(Array.from(newDataPoints));
        }
        setPendingDataPoint("");
      }
    };

    return (
      <div
        className={cn(
          // caveat: :has() variant requires tailwind v3.4 or above: https://tailwindcss.com/blog/tailwindcss-v3-4#new-has-variant
          "flex w-full items-center flex-wrap has-[:focus-visible]:outline-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background rounded-md border border-input bg-background h-10",
          className
        )}
      >
        {value.map((item) => (
          <Badge
            key={item}
            variant="secondary"
            className={
              "rounded-md flex items-center gap-2 justify-between h-5 mx-1"
            }
          >
            {item}
            <Button
              variant="ghost"
              size="icon"
              className="h-3 w-3 border"
              onClick={() => {
                onChange(value.filter((i) => i !== item));
              }}
            >
              <XIcon className="w-3" />
            </Button>
          </Badge>
        ))}
        <Input
          className="flex-1 outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 border-none h-8"
          value={pendingDataPoint}
          onChange={(e) => setPendingDataPoint(e.target.value)}
          disabled={(maxCount && value.length >= maxCount) || false}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addPendingDataPoint();
            } else if (
              e.key === "Backspace" &&
              pendingDataPoint.length === 0 &&
              value.length > 0
            ) {
              e.preventDefault();
              onChange(value.slice(0, -1));
            }
          }}
          {...props}
          ref={ref}
        />
      </div>
    );
  }
);

InputTags.displayName = "InputTags";

export { InputTags };
