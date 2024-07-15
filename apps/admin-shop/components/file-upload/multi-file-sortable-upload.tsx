"use client";

import { arrayMove } from "@dnd-kit/sortable";
import * as React from "react";
import { useState } from "react";

import {
  FileState,
  MultiImageSortableDropzone,
} from "@/components/file-upload/multi-file-sortable-dropzone";
import { useEdgeStore } from "@/lib/edgestore";

export default function MultiFileSortableUpload({
  initialFileStates,
  onChange,
}: {
  initialFileStates?: FileState[];
  onChange?: (files: FileState[]) => void | Promise<void>;
}) {
  const [fileStates, setFileStates] = useState<FileState[]>(
    initialFileStates || [],
  );
  const { edgestore } = useEdgeStore();

  function updateFileProgress(key: string, progress: FileState["progress"]) {
    setFileStates((fileStates) => {
      const newFileStates = structuredClone(fileStates);
      const fileState = newFileStates.find(
        (fileState) => fileState.key === key,
      );
      if (fileState) {
        fileState.progress = progress;
      }
      return newFileStates;
    });
  }

  function onFileUploaded(key: string, url: string) {
    setFileStates((fileStates) => {
      const newFileStates = structuredClone(fileStates);
      const fileState = newFileStates.find(
        (fileState) => fileState.key === key,
      );
      if (fileState) {
        fileState.file = url;
      }
      onChange?.(newFileStates);
      return newFileStates;
    });
  }

  const handleDrag = (event: any) => {
    const { active, over } = event;

    if (active === null || over === null) {
      return;
    }

    if (active.id !== over.id) {
      const oldIndex = fileStates.findIndex((file) => file.key === active.id);
      const newIndex = fileStates.findIndex((file) => file.key === over.id);
      const orderedFiles = arrayMove(fileStates, oldIndex, newIndex);
      setFileStates(orderedFiles);
      onChange?.(orderedFiles);
    }
  };

  return (
    <MultiImageSortableDropzone
      className="rounded-md object-contain"
      value={fileStates}
      dropzoneOptions={{
        maxFiles: 20,
      }}
      onChange={(files) => {
        setFileStates(files);
      }}
      onFilesAdded={async (addedFiles) => {
        setFileStates([...fileStates, ...addedFiles]);
        await Promise.all(
          addedFiles.map(async (addedFileState) => {
            try {
              const res = await edgestore.publicFiles.upload({
                file: addedFileState.file as File,
                onProgressChange: async (progress) => {
                  updateFileProgress(addedFileState.key, progress);
                  if (progress === 100) {
                    // wait 1 second to set it to complete
                    // so that the user can see the progress bar at 100%
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    updateFileProgress(addedFileState.key, "COMPLETE");
                  }
                },
              });
              onFileUploaded(addedFileState.key, res.url);
              addedFileState.file = res.url;
            } catch (err) {
              updateFileProgress(addedFileState.key, "ERROR");
            }
          }),
        );
      }}
      handleDrag={handleDrag}
    />
  );
}
