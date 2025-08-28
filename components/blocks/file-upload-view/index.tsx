"use client";

import {
  AlertCircleIcon,
  ImageIcon,
  Trash2Icon,
  UploadIcon,
  XIcon,
} from "lucide-react";

import { FileWithPreview, formatBytes } from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";
import { FilePreview } from "./get-file-preview";

export default function FileUploadView({
  maxFiles,
  maxSizeMB,
  openFileDialog,
  handleDragEnter,
  handleDragLeave,
  handleDragOver,
  handleDrop,
  files,
  isDragging,
  errors,
  removeFile,
  clearFiles,
  getInputProps,
}: {
  maxFiles?: number;
  maxSizeMB?: number;
  openFileDialog: () => void;
  handleDragEnter: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  files: FileWithPreview[];
  isDragging: boolean;
  errors: string[];
  removeFile: (id: string) => void;
  clearFiles: () => void;
  getInputProps: () => React.InputHTMLAttributes<HTMLInputElement>;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-dragging={isDragging || undefined}
        data-files={files.length > 0 || undefined}
        className="border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors not-data-[files]:justify-center has-[input:focus]:ring-[3px]"
      >
        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Upload image file"
        />
        {files.length > 0 ? (
          <div className="flex w-full flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="truncate text-sm font-medium">
                Fichiers ({files.length})
              </h3>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={openFileDialog}
                >
                  <UploadIcon
                    className="-ms-0.5 size-3.5 opacity-60"
                    aria-hidden="true"
                  />
                  <span className="hidden sm:inline">Ajouter des fichiers</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={clearFiles}
                >
                  <Trash2Icon
                    className="-ms-0.5 size-3.5 opacity-60"
                    aria-hidden="true"
                  />
                  <span className="hidden sm:inline">Supprimer tous</span>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {files.map((elt) => (
                <div
                  key={elt.id}
                  className="bg-background relative flex flex-col rounded-md border"
                >
                  <FilePreview file={elt.file} />
                  <Button
                    onClick={() => removeFile(elt.id)}
                    size="icon"
                    className="border-background focus-visible:border-background absolute -top-2 -right-2 size-6 rounded-full border-2 shadow-none"
                    aria-label="Remove image"
                  >
                    <XIcon className="size-3.5" />
                  </Button>
                  <div className="flex min-w-0 flex-col gap-0.5 border-t p-3 h-16">
                    <p className="truncate text-[13px] font-medium">
                      {elt.file.name}
                    </p>
                    <p className="text-muted-foreground truncate text-xs">
                      {formatBytes(elt.file.size)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
            <div
              className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
              aria-hidden="true"
            >
              <ImageIcon className="size-4 opacity-60" />
            </div>
            <p className="mb-1.5 text-sm font-medium">
              Glissez-déposez vos fichiers ici
            </p>
            <p className="text-muted-foreground text-xs">
              Max {maxFiles} fichiers ∙ Max {maxSizeMB}MB
            </p>
            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={openFileDialog}
            >
              <UploadIcon className="-ms-1 opacity-60" aria-hidden="true" />
              Selectionner les fichiers
            </Button>
          </div>
        )}
      </div>

      {errors.length > 0 && (
        <div
          className="text-destructive flex items-center gap-1 text-xs"
          role="alert"
        >
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}
    </div>
  );
}
