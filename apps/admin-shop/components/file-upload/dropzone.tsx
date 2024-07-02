import { Upload } from "lucide-react";
import * as React from "react";
import {
  DropzoneInputProps,
  DropzoneOptions,
  DropzoneRootProps
} from "react-dropzone";

import { FileState } from "@/components/file-upload/multi-file-sortable-dropzone";
import { cn } from "@/lib/utils";

export default function Dropzone(props: {
  ref: React.Ref<HTMLInputElement>;
  fileStates?: FileState[];
  dropzoneOptions?: Omit<DropzoneOptions, "disabled">;
  inputProps: DropzoneInputProps;
  rootProps: DropzoneRootProps;
}) {
  const { className, ...rest } = props.rootProps;

  return (
    <>
      {(!props.fileStates ||
        props.fileStates.length < (props.dropzoneOptions?.maxFiles ?? 0)) && (
        <div {...rest} className={cn(className, "hover:bg-muted")}>
          {/* Main File Input */}
          <input ref={props.ref} {...props.inputProps} />
          <div className="flex flex-col items-center justify-center text-xs text-center font-semibold text-muted-foreground gap-2 p-6">
            <Upload className="h-6 w-6 text-muted-foreground" />
            Загрузите файли или перетащите их сюда
            <span className="sr-only">Upload</span>
          </div>
        </div>
      )}
    </>
  );
}
