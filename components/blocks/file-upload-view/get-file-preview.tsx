"use client";

import { ImageIcon } from "lucide-react";

import { FileIcon } from "./get-file-icon";
import Image from "next/image";

export const FilePreview = ({
  file,
}: {
  file: File | { type: string; name: string; url?: string };
}) => {
  const fileType = file instanceof File ? file.type : file.type;
  const fileName = file instanceof File ? file.name : file.name;

  const renderImage = (src: string) => (
    <Image
    src={src}
    alt={fileName}
    fill
    className="rounded-t-[inherit] object-cover"
  />
  );

  return (
    <div className="flex-1 bg-accent flex aspect-square items-center justify-center overflow-hidden rounded-t-[inherit]">
      {fileType.startsWith("image/") ? (
        file instanceof File ? (
          (() => {
            const previewUrl = URL.createObjectURL(file);
            return renderImage(previewUrl);
          })()
        ) : file.url ? (
          renderImage(file.url)
        ) : (
          <ImageIcon className="size-5 opacity-60" />
        )
      ) : (
        <FileIcon file={file} />
      )}
    </div>
  );
};
