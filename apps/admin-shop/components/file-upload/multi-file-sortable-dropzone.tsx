"use client";

import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { formatFileSize } from "@edgestore/react/utils";
import * as React from "react";
import { useDropzone, type DropzoneOptions } from "react-dropzone";
import { twMerge } from "tailwind-merge";

import Dropzone from "@/components/file-upload/dropzone";
import { SortableDropzoneImage } from "@/components/file-upload/dropzone-image";

const variants = {
  base: "flex aspect-square min-w-full items-center justify-center rounded-md border border-dashed",
  image:
    "border-0 p-0 w-full h-full relative shadow-md bg-slate-200 dark:bg-slate-900 rounded-md",
  active: "border-2",
  disabled:
    "bg-gray-200 border-gray-300 cursor-default pointer-events-none bg-opacity-30 dark:bg-gray-700",
  accept: "border border-blue-500 bg-blue-500 bg-opacity-10",
  reject: "border border-red-700 bg-red-700 bg-opacity-10",
};

export type FileState = {
  file: File | string;
  key: string; // used to identify the file in the progress callback
  progress: "PENDING" | "COMPLETE" | "ERROR" | number;
};

type InputProps = {
  className?: string;
  value?: FileState[];
  onChange?: (files: FileState[]) => void | Promise<void>;
  onFilesAdded?: (addedFiles: FileState[]) => void | Promise<void>;
  disabled?: boolean;
  dropzoneOptions?: Omit<DropzoneOptions, "disabled">;
  handleDrag?: (event: any) => void;
};

const ERROR_MESSAGES = {
  fileTooLarge(maxSize: number) {
    return `The file is too large. Max size is ${formatFileSize(maxSize)}.`;
  },
  fileInvalidType() {
    return "Invalid file type.";
  },
  tooManyFiles(maxFiles: number) {
    return `You can only add ${maxFiles} file(s).`;
  },
  fileNotSupported() {
    return "The file is not supported.";
  },
};

const MultiImageSortableDropzone = React.forwardRef<
  HTMLInputElement,
  InputProps
>(
  (
    {
      dropzoneOptions,
      value,
      className,
      disabled,
      onChange,
      onFilesAdded,
      handleDrag,
    },
    ref
  ) => {
    const [customError, setCustomError] = React.useState<string>();

    const imageUrls = React.useMemo(() => {
      if (value) {
        return value.map((fileState) => {
          if (typeof fileState.file === "string") {
            // in case a url is passed in, use it to display the image
            return fileState.file;
          } else {
            // in case a file is passed in, create a base64 url to display the image
            return URL.createObjectURL(fileState.file);
          }
        });
      }
      return [];
    }, [value]);

    const onRemoveImage = (index: number) => {
      void onChange?.(value?.filter((_, i) => i !== index) ?? []);
    };

    // dropzone configuration
    const {
      getRootProps,
      getInputProps,
      fileRejections,
      isFocused,
      isDragAccept,
      isDragReject,
    } = useDropzone({
      accept: { "image/*": [] },
      disabled,
      onDrop: (acceptedFiles) => {
        const files = acceptedFiles;
        setCustomError(undefined);
        if (files) {
          const addedFiles = files.map<FileState>((file) => ({
            file,
            key: Math.random().toString(36).slice(2),
            progress: "PENDING",
          }));
          void onFilesAdded?.(addedFiles);
          void onChange?.([...(value ?? []), ...addedFiles]);
        }
      },
      ...dropzoneOptions,
    });

    // styling
    const dropZoneClassName = React.useMemo(
      () =>
        twMerge(
          variants.base,
          isFocused && variants.active,
          disabled && variants.disabled,
          (isDragReject ?? fileRejections[0]) && variants.reject,
          isDragAccept && variants.accept,
          className
        ).trim(),
      [
        isFocused,
        fileRejections,
        isDragAccept,
        isDragReject,
        disabled,
        className,
      ]
    );

    // error validation messages
    const errorMessage = React.useMemo(() => {
      if (fileRejections[0]) {
        const { errors } = fileRejections[0];
        if (errors[0]?.code === "file-too-large") {
          return ERROR_MESSAGES.fileTooLarge(dropzoneOptions?.maxSize ?? 0);
        } else if (errors[0]?.code === "file-invalid-type") {
          return ERROR_MESSAGES.fileInvalidType();
        } else if (errors[0]?.code === "too-many-files") {
          return ERROR_MESSAGES.tooManyFiles(dropzoneOptions?.maxFiles ?? 0);
        } else {
          return ERROR_MESSAGES.fileNotSupported();
        }
      }
      return undefined;
    }, [fileRejections, dropzoneOptions]);

    const mouseSensor = useSensor(MouseSensor, {
      activationConstraint: {
        distance: 25,
      },
    });

    const sensors = useSensors(mouseSensor, useSensor(TouchSensor));

    if (!value) {
      return (
        <Dropzone
          fileStates={value}
          dropzoneOptions={dropzoneOptions}
          rootProps={getRootProps({
            className: dropZoneClassName,
          })}
          ref={ref}
          inputProps={getInputProps()}
        />
      );
    }

    return (
      <div>
        <DndContext
          id={"sortable-files"}
          modifiers={[restrictToWindowEdges]}
          sensors={sensors}
          onDragEnd={handleDrag}
        >
          <SortableContext
            items={value.map((file) => file.key)}
            strategy={rectSortingStrategy}
          >
            <div className="grid gap-2 grid-cols-3 w-full">
              {value.map((fileState, index) => (
                <SortableDropzoneImage
                  key={fileState.key}
                  imageUrls={imageUrls}
                  index={index}
                  fileState={fileState}
                  disabled={disabled}
                  onRemoveImage={onRemoveImage}
                  className={twMerge(
                    variants.image,
                    "w-full aspect-square first:col-span-3"
                  )}
                />
              ))}
              <Dropzone
                fileStates={value}
                dropzoneOptions={dropzoneOptions}
                rootProps={getRootProps({
                  className: twMerge(dropZoneClassName, "first:col-span-3"),
                })}
                ref={ref}
                inputProps={getInputProps()}
              />
            </div>
            {/* Error Text */}
            <div className="mt-1 text-xs text-red-500">
              {customError ?? errorMessage}
            </div>
          </SortableContext>
        </DndContext>
        {/*Render hidden inputs with values of the urls in them, to get them in a form action*/}
        {value
          .filter(({ file }) => typeof file === "string")
          .map((fileState, index) => {
            return (
              <input
                key={fileState.key}
                type="hidden"
                name={"image-" + index}
                id={"image-" + index}
                value={fileState.file as string}
              />
            );
          })}
      </div>
    );
  }
);
MultiImageSortableDropzone.displayName = "MultiImageDropzone";

export { MultiImageSortableDropzone };
