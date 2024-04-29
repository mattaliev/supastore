"use client";
import { X } from "lucide-react";
import * as React from "react";

import { Sortable } from "@/components/drag-and-drop/sortable";
import { FileState } from "@/components/file-upload/multi-file-sortable-dropzone";
import { Button } from "@/components/ui/button";

export function DropzoneImage(props: {
  imageUrls: string[] | any[];
  index: number;
  disabled: boolean | undefined;
  onRemoveImage: (index: number) => void;
  fileState: FileState;
}) {
  const { imageUrls, index, disabled, onRemoveImage, fileState } = props;

  return (
    <>
      <img
        className="h-full w-full rounded-md object-cover"
        src={imageUrls[index]}
        alt={
          typeof fileState.file === "string"
            ? fileState.file
            : fileState.file.name
        }
      />
      {/* Progress Bar */}
      {typeof fileState.progress === "number" && (
        <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center rounded-md bg-black bg-opacity-70">
          <CircleProgress progress={fileState.progress} />
        </div>
      )}
      {/* Remove Image Icon */}
      <Button
        className="group absolute right-0 top-0 -translate-y-1/4 translate-x-1/4 p-0 h-5 w-5 transform flex cursor-pointer items-center justify-center"
        variant={"outline"}
        size={"sm"}
        onClick={() => onRemoveImage(index)}
        type={"button"}
      >
        <X className="text-primary" width={16} height={16} />
        {/*<div className=" rounded-md border border-solid  bg-accent transition-all duration-300 hover:h-6 hover:w-6 dark:bg-accent"></div>*/}
      </Button>
    </>
  );
}

export function SortableDropzoneImage(props: {
  imageUrls: string[] | any[];
  index: number;
  disabled: boolean | undefined;
  onRemoveImage: (index: number) => void;
  fileState: FileState;
  className?: string;
}) {
  return (
    <Sortable id={props.fileState.key} className={props.className}>
      <DropzoneImage {...props} />
    </Sortable>
  );
}

function CircleProgress({ progress }: { progress: number }) {
  const strokeWidth = 10;
  const radius = 50;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative h-16 w-16">
      <svg
        className="absolute top-0 left-0 -rotate-90 transform"
        width="100%"
        height="100%"
        viewBox={`0 0 ${(radius + strokeWidth) * 2} ${
          (radius + strokeWidth) * 2
        }`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="text-gray-400"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
          r={radius}
        />
        <circle
          className="text-white transition-all duration-300 ease-in-out"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={((100 - progress) / 100) * circumference}
          strokeLinecap="round"
          fill="none"
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
          r={radius}
        />
      </svg>
      <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center text-xs text-white">
        {Math.round(progress)}%
      </div>
    </div>
  );
}
