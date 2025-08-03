import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Eye, Upload, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { IDocument } from '@/features/documents/types/documents.type';

interface DocumentsSectionProps {
  documents?: IDocument[];
}

function formatFileSize(sizeKB: number): string {
  if (sizeKB < 1024) {
    return `${sizeKB} KB`;
  }
  return `${(sizeKB / 1024).toFixed(1)} MB`;
}

function getFileTypeIcon(mimeType: string) {
  if (mimeType.startsWith('image/')) {
    return '🖼️';
  } else if (mimeType.includes('pdf')) {
    return '📄';
  } else if (mimeType.includes('word')) {
    return '📝';
  }
  return '📎';
}

export function DocumentsSection({ documents = [] }: DocumentsSectionProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-primary" />
            Documents ({documents.length})
          </CardTitle>
          <Button size="sm" className="gap-2">
            <Upload className="h-4 w-4" />
            Ajouter un document
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-3" />
            <h3 className="font-medium text-foreground mb-1">Aucun document</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Aucun document n&apos;est encore été téléchargé pour cette demande.
            </p>
            <Button size="sm" variant="outline" className="gap-2">
              <Upload className="h-4 w-4" />
              Télécharger le premier document
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {documents.map((document) => (
              <div
                key={document.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-all duration-200 hover:shadow-md"
              >
                <div className="flex items-start space-x-4 flex-1 min-w-0">
                  <div className="text-2xl flex-shrink-0">
                    {getFileTypeIcon(document.mimeType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground truncate">
                      {document.fileName}
                    </h4>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(document.createdAt), 'PPP', { locale: fr })}
                      </span>
                      <Badge className="text-xs">
                        {formatFileSize(document.fileSizeKB)}
                      </Badge>
                    </div>
                    {document.uploader && (
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <User className="h-3 w-3" />
                        Téléchargé par {document.uploader.firstName} {document.uploader.lastName}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <Button size="sm" variant="outline" className="gap-2">
                    <Eye className="h-4 w-4" />
                    Voir
                  </Button>
                  <Button size="sm" variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Télécharger
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}