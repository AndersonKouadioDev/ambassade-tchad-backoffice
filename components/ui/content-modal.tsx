"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { X, Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomDatePicker } from "@/components/ui/custom-date-picker";
import Image from "next/image";

export interface ContentModalField {
  key: string;
  type: "text" | "textarea" | "select" | "file" | "date" | "email";
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  accept?: string; // For file inputs
  rows?: number; // For textarea
}

export interface ContentModalData {
  [key: string]: any;
}

interface ContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ContentModalData) => void;
  title: string;
  description?: string;
  fields: ContentModalField[];
  initialData?: ContentModalData;
  isEditing?: boolean;
  isLoading?: boolean;
  translationNamespace?: string;
}

export const ContentModal: React.FC<ContentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  description,
  fields,
  initialData = {},
  isEditing = false,
  isLoading = false,
  translationNamespace = "common",
}) => {
  const t = useTranslations(translationNamespace);
  const [formData, setFormData] = React.useState<ContentModalData>(initialData);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [previewImage, setPreviewImage] = React.useState<string | null>(
    initialData.image || null
  );

  React.useEffect(() => {
    if (isOpen) {
      setFormData(initialData || {});
      setPreviewImage(initialData?.image || null);
      setErrors({});
    }
  }, [isOpen, initialData]);

  const handleInputChange = React.useCallback(
    (key: string, value: any) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
      // Clear error when user starts typing
      if (errors[key]) {
        setErrors((prev) => ({ ...prev, [key]: "" }));
      }
    },
    [errors]
  );

  const handleFileChange = React.useCallback(
    (key: string, files: FileList | null) => {
      if (files && files.length > 0) {
        const fileArray = Array.from(files);
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          setPreviewImage(result);
          setFormData((prev) => ({ ...prev, [key]: fileArray }));
        };
        reader.readAsDataURL(fileArray[0]); // Utiliser le premier fichier pour la prévisualisation
      } else {
        setPreviewImage(null);
        setFormData((prev) => ({ ...prev, [key]: [] }));
      }
    },
    []
  );

  const validateForm = React.useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    fields.forEach((field) => {
      if (
        field.required &&
        (!formData[field.key] || formData[field.key] === "")
      ) {
        newErrors[field.key] = `${field.label} est requis`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [fields, formData]);

  const handleSubmit = React.useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) return;

      onSubmit(formData);
    },
    [validateForm, onSubmit, formData]
  );

  const renderField = (field: ContentModalField, shouldSpanFull = false) => {
    const hasError = !!errors[field.key];
    const baseClasses = shouldSpanFull ? "col-span-1 md:col-span-2" : "";

    switch (field.type) {
      case "textarea":
        return (
          <div
            key={field.key}
            className={cn("space-y-2", "col-span-1 md:col-span-2")}
          >
            <Label
              htmlFor={field.key}
              className="text-sm font-medium dark:text-white"
            >
              {field.label}
              {field.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            <Textarea
              id={field.key}
              placeholder={field.placeholder}
              value={formData[field.key] || ""}
              onChange={(e) => handleInputChange(field.key, e.target.value)}
              rows={field.rows || 4}
              className={cn(
                "min-h-[100px] resize-none",
                "dark:text-white dark:bg-gray-800 dark:border-gray-600",
                "dark:placeholder:text-gray-300",
                "dark:focus:border-embassy-yellow-400 dark:focus:ring-embassy-yellow-400",
                hasError && "border-destructive focus-visible:ring-destructive"
              )}
            />
            {hasError && (
              <p className="text-sm text-destructive">{errors[field.key]}</p>
            )}
          </div>
        );

      case "select":
        return (
          <div key={field.key} className={cn("space-y-2", baseClasses)}>
            <Label
              htmlFor={field.key}
              className="text-sm font-medium dark:text-white"
            >
              {field.label}
              {field.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            <Select
              value={formData[field.key] || ""}
              onValueChange={(value) => handleInputChange(field.key, value)}
            >
              <SelectTrigger
                className={cn(
                  "dark:text-white dark:bg-gray-800 dark:border-gray-600",
                  "dark:focus:border-embassy-yellow-400 dark:focus:ring-embassy-yellow-400",
                  "[&>svg]:dark:stroke-white",
                  hasError && "border-destructive"
                )}
              >
                <SelectValue
                  placeholder={field.placeholder}
                  className="dark:placeholder:text-gray-300"
                />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                {field.options?.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="dark:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasError && (
              <p className="text-sm text-destructive">{errors[field.key]}</p>
            )}
          </div>
        );

      case "file":
        return (
          <div
            key={field.key}
            className={cn("space-y-2", "col-span-1 md:col-span-2")}
          >
            <Label
              htmlFor={field.key}
              className="text-sm font-medium dark:text-white"
            >
              {field.label}
              {field.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Zone d'upload à gauche */}
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor={field.key}
                  className={cn(
                    "flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer",
                    "bg-muted/50 hover:bg-muted/80 transition-colors",
                    "border-muted-foreground/25 hover:border-muted-foreground/50",
                    hasError && "border-destructive"
                  )}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-12 h-12 mb-4 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground text-center">
                      <span className="font-semibold">
                        Cliquez pour télécharger
                      </span>
                      <br />
                      ou glissez-déposez
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, WEBP (MAX. 5MB)
                    </p>
                  </div>
                  <input
                    id={field.key}
                    type="file"
                    className="hidden"
                    accept={field.accept || "image/*"}
                    onChange={(e) =>
                      handleFileChange(field.key, e.target.files || null)
                    }
                    multiple
                  />
                </label>
              </div>

              {/* Prévisualisation à droite */}
              <div className="flex items-center justify-center w-full h-48">
                {previewImage ? (
                  <div className="relative w-full h-full rounded-lg overflow-hidden bg-muted border-2 border-embassy-yellow-200">
                    <Image
                      src={previewImage}
                      alt="Aperçu"
                      className="w-full h-full object-cover"
                      width={400}
                      height={400}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8 bg-red-500 hover:bg-red-600 text-white border-0"
                      onClick={() => handleFileChange(field.key, null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-muted-foreground/25 rounded-lg">
                    <ImageIcon className="w-12 h-12 text-muted-foreground/50 mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Aperçu de l&apos;image
                    </p>
                  </div>
                )}
              </div>
            </div>
            {hasError && (
              <p className="text-sm text-destructive">{errors[field.key]}</p>
            )}
          </div>
        );

      case "date":
        return (
          <div key={field.key} className={cn("space-y-2", baseClasses)}>
            <CustomDatePicker
              label={field.label}
              placeholder={field.placeholder}
              value={formData[field.key] || undefined}
              onChange={(date) => handleInputChange(field.key, date)}
              required={field.required}
              disabled={false}
              error={hasError ? errors[field.key] : undefined}
              mode="single"
              showIcon={true}
              showClearButton={true}
              size="md"
              variant="outline"
              fullWidth={true}
              showPresets={true}
              allowManualInput={true}
              // Configuration par défaut adaptée aux formulaires
              presets={[
                {
                  label: "Aujourd'hui",
                  value: new Date(),
                },
                {
                  label: "Demain",
                  value: new Date(Date.now() + 24 * 60 * 60 * 1000),
                },
                {
                  label: "Dans une semaine",
                  value: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                },
              ]}
            />
          </div>
        );

      default:
        return (
          <div key={field.key} className={cn("space-y-2", baseClasses)}>
            <Label
              htmlFor={field.key}
              className="text-sm font-medium dark:text-white"
            >
              {field.label}
              {field.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            <Input
              id={field.key}
              type={field.type}
              placeholder={field.placeholder}
              value={formData[field.key] || ""}
              onChange={(e) => handleInputChange(field.key, e.target.value)}
              className={cn(
                "dark:text-white dark:bg-gray-800 dark:border-gray-600",
                "dark:placeholder:text-gray-300",
                "dark:focus:border-embassy-yellow-400 dark:focus:ring-embassy-yellow-400",
                hasError && "border-destructive focus-visible:ring-destructive"
              )}
            />
            {hasError && (
              <p className="text-sm text-destructive">{errors[field.key]}</p>
            )}
          </div>
        );
    }
  };

  // Séparer les champs par type pour la disposition
  const imageFields = fields.filter((field) => field.type === "file");
  const textareaFields = fields.filter((field) => field.type === "textarea");
  const dateFields = fields.filter((field) => field.type === "date");
  const regularFields = fields.filter(
    (field) =>
      field.type !== "file" &&
      field.type !== "textarea" &&
      field.type !== "date"
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] lg:max-w-[1000px] max-h-[90vh] overflow-hidden flex flex-col p-0">
        {/* Header personnalisé avec background jaune */}
        <div className="relative bg-gradient-to-r from-embassy-yellow-500 to-embassy-yellow-600 p-3">
          <div className="flex items-center justify-center">
            <h2 className="text-xl font-semibold text-white text-center">
              {title}
            </h2>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 text-white hover:bg-white/20 hover:text-white"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Description sous le header */}
        {description && (
          <div className="px-6 pt-4">
            <p className="text-muted-foreground text-center">{description}</p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-8 flex-1 overflow-y-auto px-6 py-4"
        >
          <div className="space-y-8">
            {/* Images en haut - pleine largeur */}
            {imageFields.length > 0 && (
              <div className="space-y-6">
                {imageFields.map((field) => renderField(field))}
              </div>
            )}

            {/* Champs de date - 2 colonnes */}
            {dateFields.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {dateFields.map((field) => renderField(field))}
              </div>
            )}

            {/* Champs réguliers en 2 colonnes */}
            {regularFields.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {regularFields.map((field) => renderField(field))}
              </div>
            )}

            {/* Champs textarea - pleine largeur */}
            {textareaFields.length > 0 && (
              <div className="space-y-8">
                {textareaFields.map((field) => renderField(field))}
              </div>
            )}
          </div>
        </form>

        <div className="gap-4 pt-8 pb-6 px-6 border-t flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            className="min-w-[100px] bg-embassy-blue-600 text-white border-0 hover:bg-embassy-blue-700 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? "Modification..." : "Création..."}
              </>
            ) : isEditing ? (
              "Modifier"
            ) : (
              "Créer"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
