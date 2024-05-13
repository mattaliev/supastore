import { Upload } from "lucide-react";
import * as React from "react";
import {
  DropzoneInputProps,
  DropzoneOptions,
  DropzoneRootProps
} from "react-dropzone";

import { FileState } from "@/components/file-upload/multi-file-sortable-dropzone";

export default function Dropzone(props: {
  ref: React.Ref<HTMLInputElement>;
  fileStates?: FileState[];
  dropzoneOptions?: Omit<DropzoneOptions, "disabled">;
  inputProps: DropzoneInputProps;
  rootProps: DropzoneRootProps;
}) {
  return (
    <>
      {(!props.fileStates ||
        props.fileStates.length < (props.dropzoneOptions?.maxFiles ?? 0)) && (
        <div {...props.rootProps}>
          {/* Main File Input */}
          <input ref={props.ref} {...props.inputProps} />
          <div className="flex flex-col items-center justify-center text-xs text-gray-400">
            <Upload className="h-4 w-4 text-muted-foreground" />
            <span className="sr-only">Upload</span>
          </div>
        </div>
      )}
    </>
  );
}
