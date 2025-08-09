"use client";

import React, { useRef } from "react";
import { Upload, X, Trash2, Eye, ExternalLink } from "lucide-react";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";
export interface ImageFile {
  id: string;
  file: File;
  preview: string;
  name: string;
}

// Interface pour différencier les images existantes des nouvelles
export interface ExistingImageFile extends Omit<ImageFile, "file"> {
  file?: File;
  url: string;
  isExisting: true;
}

export interface NewImageFile extends ImageFile {
  isExisting: false;
}

export type MixedImageFile = ExistingImageFile | NewImageFile;

interface ImageDragDropProps {
  imageFiles: MixedImageFile[];
  setImageFiles: React.Dispatch<React.SetStateAction<MixedImageFile[]>>;
  isUpdateMode?: boolean;
}

/**
 * ImageDragDrop is a component for uploading and displaying images.
 * Supports both new image uploads and existing image management in update mode.
 */
export const ImageDragDrop: React.FC<ImageDragDropProps> = ({
  imageFiles,
  setImageFiles,
  isUpdateMode = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImageFiles: NewImageFile[] = Array.from(files).map(
        (file, index) => ({
          id: `file-${Date.now()}-${index}`,
          file,
          preview: URL.createObjectURL(file),
          name: file.name,
          isExisting: false,
        })
      );

      setImageFiles((prev) => [...prev, ...newImageFiles]);
    }
  };

  const handleImageRemove = (id: string, imageFile: MixedImageFile) => {
    // Simplement retirer l'image de la liste affichée
    // Ce qui reste dans imageFiles sera envoyé au backend
    setImageFiles((prev) => prev.filter((img) => img.id !== id));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    const newImageFiles: NewImageFile[] = imageFiles.map((file, index) => ({
      id: `drop-${Date.now()}-${index}`,
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      isExisting: false,
    }));

    setImageFiles((prev) => [...prev, ...newImageFiles]);
  };

  const handleClearAll = () => {
    setImageFiles([]);
  };

  const existingImagesCount = imageFiles.filter((img) => img.isExisting).length;
  const newImagesCount = imageFiles.filter((img) => !img.isExisting).length;

  return (
    <div className="space-y-4">
      <Label>Images</Label>

      {/* Zone d'upload */}
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          name="images"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <Upload className="w-8 h-8 text-gray-400" />
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {isUpdateMode
                ? "Ajouter de nouvelles images"
                : "Glissez-déposez vos images ici"}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              ou cliquez pour sélectionner des fichiers image
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Seuls les fichiers image sont acceptés
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <span>Formats supportés :</span>
            <Badge className="text-xs">JPG</Badge>
            <Badge className="text-xs">PNG</Badge>
          </div>
        </div>
      </div>

      {/* Images affichées */}
      {imageFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h4 className="font-medium">Images ({imageFiles.length})</h4>
              {isUpdateMode && (
                <div className="flex gap-2 text-sm text-gray-500">
                  {existingImagesCount > 0 && (
                    <Badge color="primary" className="text-xs">
                      {existingImagesCount} existante
                      {existingImagesCount > 1 ? "s" : ""}
                    </Badge>
                  )}
                  {newImagesCount > 0 && (
                    <Badge color="secondary" className="text-xs">
                      {newImagesCount} nouvelle{newImagesCount > 1 ? "s" : ""}
                    </Badge>
                  )}
                </div>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Tout supprimer
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {imageFiles.map((imageFile) => (
              <div key={imageFile.id} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200 relative">
                  <Image
                    src={imageFile.preview}
                    alt={imageFile.name}
                    fill
                    className="w-full h-full object-cover"
                  />

                  {/* Badge pour indiquer le type d'image */}
                  {isUpdateMode && (
                    <div className="absolute top-2 left-2">
                      <Badge
                        color={imageFile.isExisting ? "primary" : "secondary"}
                        className="text-xs px-1 py-0"
                      >
                        {imageFile.isExisting ? "Existante" : "Nouvelle"}
                      </Badge>
                    </div>
                  )}

                  {/* Overlay avec actions */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        color="secondary"
                        size="sm"
                        className="w-8 h-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(imageFile.preview, "_blank");
                        }}
                      >
                        {imageFile.isExisting ? (
                          <ExternalLink className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        type="button"
                        color="danger"
                        size="sm"
                        className="w-8 h-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleImageRemove(imageFile.id, imageFile);
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Nom du fichier */}
                <p className="text-xs text-gray-600 mt-1 truncate text-center">
                  {imageFile.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Affichage informatif */}
      {isUpdateMode && imageFiles.length > 0 && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>ℹ️ Aperçu final :</strong> Ces images seront sauvegardées
            (remplacent toutes les images actuelles).
            <br />
            <span className="text-xs">
              • Images existantes conservées :{" "}
              <strong>{existingImagesCount}</strong>
              <br />• Nouvelles images ajoutées :{" "}
              <strong>{newImagesCount}</strong>
              <br />
              Total : <strong>{imageFiles.length}</strong> image
              {imageFiles.length > 1 ? "s" : ""}
            </span>
          </p>
        </div>
      )}

      {isUpdateMode && imageFiles.length === 0 && (
        <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-sm text-orange-700">
            <strong>⚠️ Attention :</strong> Aucune image ne sera associée à
            cette actualité après la sauvegarde.
          </p>
        </div>
      )}
    </div>
  );
};
