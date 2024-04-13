import * as React from "react";
import { X } from "lucide-react";
import { FileState } from "@/components/file-upload/multi-file-sortable-dropzone";
import { Sortable } from "@/components/drag-and-drop/sortable";
import { twMerge } from "tailwind-merge";

export function DropzoneImage(props: {
  imageUrls: string[] | any[];
  index: number;
  disabled: boolean | undefined;
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  fileState: FileState;
}) {
  const { imageUrls, index, disabled, onClick, fileState } = props;

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
      {imageUrls[index + 1] &&
        !disabled &&
        fileState.progress === "PENDING" && (
          <div
            className="group absolute right-0 top-0 -translate-y-1/4 translate-x-1/4 transform"
            onClick={onClick}
          >
            <div className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-md border border-solid border-gray-500 bg-white transition-all duration-300 hover:h-6 hover:w-6 dark:border-gray-400 dark:bg-black">
              <X
                className="text-gray-500 dark:text-gray-400"
                width={16}
                height={16}
              />
            </div>
          </div>
        )}
    </>
  );
}

export function SortableDropzoneImage(props: {
  imageUrls: string[] | any[];
  index: number;
  disabled: boolean | undefined;
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  fileState: FileState;
  className?: string;
}) {
  return (
    <Sortable id={props.fileState.key} className={props.className || ""}>
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
