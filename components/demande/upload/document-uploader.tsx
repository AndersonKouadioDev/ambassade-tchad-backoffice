"use client";

import React, { useState, useCallback } from 'react';
import { Upload, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DocumentPreview } from './document-preview';
import { cn } from '@/lib/utils';

interface DocumentUploaderProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number; // en MB
  acceptedFileTypes?: string[];
  required?: boolean;
  className?: string;
}

const DEFAULT_ACCEPTED_TYPES = [
  'image/jpeg',
  'image/png',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  files,
  onFilesChange,
  maxFiles = 10,
  maxSize = 10,
  acceptedFileTypes = DEFAULT_ACCEPTED_TYPES,
  required = false,
  className
}) => {
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);

  const [isDragActive, setIsDragActive] = useState(false);

  const validateFiles = (fileList: FileList) => {
    const errors: string[] = [];
    const validFiles: File[] = [];
    
    Array.from(fileList).forEach((file) => {
      // Vérification du type
      if (!acceptedFileTypes.includes(file.type)) {
        errors.push(`${file.name} : Type de fichier non supporté`);
        return;
      }
      
      // Vérification de la taille
      if (file.size > maxSize * 1024 * 1024) {
        errors.push(`${file.name} : Fichier trop volumineux (max ${maxSize}MB)`);
        return;
      }
      
      validFiles.push(file);
    });
    
    // Vérification du nombre total
    if (files.length + validFiles.length > maxFiles) {
      errors.push(`Nombre maximum de fichiers dépassé (${maxFiles} max)`);
      return { validFiles: [], errors };
    }
    
    return { validFiles, errors };
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const { validFiles, errors } = validateFiles(e.target.files);
    setUploadErrors(errors);
    
    if (validFiles.length > 0) {
      onFilesChange([...files, ...validFiles]);
    }
    
    // Reset input
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    
    const { validFiles, errors } = validateFiles(e.dataTransfer.files);
    setUploadErrors(errors);
    
    if (validFiles.length > 0) {
      onFilesChange([...files, ...validFiles]);
    }
  };

  const removeFile = (indexToRemove: number) => {
    const updatedFiles = files.filter((_, index) => index !== indexToRemove);
    onFilesChange(updatedFiles);
    setUploadErrors([]);
  };

  const clearAllFiles = () => {
    onFilesChange([]);
    setUploadErrors([]);
  };

  const getAcceptText = () => {
    const extensions = acceptedFileTypes.map(type => {
      switch (type) {
        case 'image/jpeg': return 'JPG';
        case 'image/png': return 'PNG';
        case 'application/pdf': return 'PDF';
        case 'application/msword': return 'DOC';
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': return 'DOCX';
        default: return type.split('/')[1]?.toUpperCase();
      }
    }).filter(Boolean);
    return extensions.join(', ');
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Zone de drop */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200",
          "bg-white dark:bg-gray-800",
          isDragActive 
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/10" 
            : "border-blue-300 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/5",
          files.length >= maxFiles && "opacity-50 cursor-not-allowed"
        )}
      >
        <input 
          type="file" 
          multiple 
          accept={acceptedFileTypes.join(',')}
          onChange={handleFileInput}
          disabled={files.length >= maxFiles}
          className="hidden"
          id="file-upload-input"
        />
        
        <div className="flex flex-col items-center gap-4">
          <div className={cn(
            "p-4 rounded-full",
            isDragActive && !isDragReject 
              ? "bg-blue-500 text-white" 
              : "bg-blue-100 dark:bg-blue-900/20 text-blue-500"
          )}>
            <Upload className="h-8 w-8" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {isDragActive 
                ? (isDragReject ? "Fichiers non supportés" : "Déposez vos documents ici")
                : "Glissez vos documents ou cliquez pour sélectionner"
              }
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Formats acceptés : {getAcceptText()}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Taille maximale : {maxSize}MB par fichier • {maxFiles} fichiers maximum
            </p>
          </div>

          {files.length < maxFiles && (
            <Button 
              type="button"
              onClick={() => document.getElementById('file-upload-input')?.click()}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Sélectionner des fichiers
            </Button>
          )}
        </div>
      </div>

      {/* Messages d'erreur */}
      {uploadErrors.length > 0 && (
        <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800 dark:text-yellow-200">
            <ul className="list-disc list-inside space-y-1">
              {uploadErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Liste des fichiers uploadés */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-blue-500" />
              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                Documents sélectionnés ({files.length}/{maxFiles})
              </h4>
            </div>
            {files.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearAllFiles}
                className="text-gray-600 hover:text-gray-800 border-gray-300"
              >
                Supprimer tout
              </Button>
            )}
          </div>

          <div className="grid gap-3">
            {files.map((file, index) => (
              <DocumentPreview
                key={`${file.name}-${index}`}
                file={file}
                onRemove={() => removeFile(index)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Information sur les documents requis */}
      {required && files.length === 0 && (
        <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/10">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            Des documents sont requis pour cette demande. Veuillez ajouter au moins un fichier.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};