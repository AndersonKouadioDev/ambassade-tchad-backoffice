"use client";

import React, { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Upload, X, Image as ImageIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageUploadFieldProps {
  value: string[];
  onChange: (value: string[]) => void;
  maxImages?: number;
  className?: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  value = [],
  onChange,
  maxImages = 5,
  className,
}) => {
  const t = useTranslations("contenu.gestionEvenement");
  const [isDragOver, setIsDragOver] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  const handleAddImage = useCallback((url: string) => {
    if (url.trim() && !value.includes(url.trim()) && value.length < maxImages) {
      onChange([...value, url.trim()]);
      setUrlInput("");
    }
  }, [value, onChange, maxImages]);

  const handleRemoveImage = useCallback((index: number) => {
    onChange(value.filter((_, i) => i !== index));
  }, [value, onChange]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0 && value.length < maxImages) {
      // Pour l'instant, on simule l'upload avec des URLs temporaires
      // En production, vous devriez uploader vers votre serveur
      imageFiles.forEach(file => {
        const url = URL.createObjectURL(file);
        handleAddImage(url);
      });
    }
  }, [value.length, maxImages, handleAddImage]);

  const handleUrlSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      handleAddImage(urlInput);
    }
  }, [urlInput, handleAddImage]);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Zone de drag & drop */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
          isDragOver
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
            : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Glissez-déposez vos images ici ou
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => document.getElementById('image-url-input')?.focus()}
          disabled={value.length >= maxImages}
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une image
        </Button>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
          {value.length}/{maxImages} images
        </p>
      </div>

      {/* Input pour URL */}
      <form onSubmit={handleUrlSubmit} className="flex gap-2">
        <Input
          id="image-url-input"
          placeholder="Entrez l'URL d'une image..."
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          disabled={value.length >= maxImages}
          className="flex-1"
        />
        <Button
          type="submit"
          size="sm"
          disabled={!urlInput.trim() || value.length >= maxImages}
        >
          Ajouter
        </Button>
      </form>

      {/* Prévisualisation des images */}
      {value.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Images ({value.length}/{maxImages})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {value.map((url, index) => (
              <Card key={index} className="relative group">
                <CardContent className="p-2">
                  <div className="relative aspect-square rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <Image
                      src={url}
                      alt={`Image ${index + 1}`}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-image.png'; // Image par défaut
                      }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {index + 1}
                    </Badge>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Message d'aide */}
      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
        <p>• Formats supportés : JPG, PNG, GIF, WebP</p>
        <p>• Taille maximale recommandée : 2MB par image</p>
        <p>• Vous pouvez ajouter jusqu'à {maxImages} images</p>
      </div>
    </div>
  );
}; 