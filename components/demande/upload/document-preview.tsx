"use client";

import React from 'react';
import Image from 'next/image';
import { X, FileText, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DocumentPreviewProps {
  file: File;
  onRemove: () => void;
  onView?: () => void;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  file,
  onRemove,
  onView
}) => {
  const [previewUrl, setPreviewUrl] = React.useState<string>('');

  React.useEffect(() => {
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = () => {
    if (file.type.startsWith('image/')) {
      return null; // On affiche l'image elle-même
    }
    return <FileText className="h-8 w-8 text-blue-500" />;
  };

  return (
    <div className="relative group border-2 border-dashed border-blue-300 rounded-lg p-4 bg-white dark:bg-gray-800 hover:border-blue-500 transition-colors">
      <div className="flex items-start gap-3">
        {/* Prévisualisation */}
        <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
          {file.type.startsWith('image/') && previewUrl ? (
            <Image
              src={previewUrl}
              alt="Prévisualisation"
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          ) : (
            getFileIcon()
          )}
        </div>

        {/* Informations du fichier */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
            {file.name}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            <Badge 
              variant="outline" 
              className="text-xs bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400"
            >
              {file.type.split('/')[1]?.toUpperCase() || 'FILE'}
            </Badge>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatFileSize(file.size)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onView && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={onView}
              className="h-8 w-8 p-0 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={onRemove}
            className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};