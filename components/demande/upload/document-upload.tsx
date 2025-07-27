'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Icon } from '@/components/ui/icon'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ServiceType } from '@/types/service-types'
import { cn } from '@/lib/utils'

interface DocumentUploadProps {
  serviceType: ServiceType | null
  onFilesChange: (files: File[]) => void
  maxFiles?: number
  maxSize?: number // en MB
}

interface UploadedFile {
  file: File
  id: string
  progress: number
  status: 'uploading' | 'success' | 'error'
  error?: string
}

const ACCEPTED_FILE_TYPES = {
  'image/*': ['.jpg', '.jpeg', '.png'],
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export function DocumentUpload({ 
  serviceType, 
  onFilesChange, 
  maxFiles = 10, 
  maxSize = 10 
}: DocumentUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const getRequiredDocuments = (serviceType: ServiceType | null) => {
    if (!serviceType) return []
    
    const documents: Record<ServiceType, string[]> = {
      [ServiceType.VISA]: [
        'Passeport (pages principales)',
        'Photo d\'identité récente',
        'Justificatif de domicile',
        'Attestation d\'emploi ou de revenus',
        'Réservation d\'hôtel ou invitation',
        'Billet d\'avion (si disponible)'
      ],
      [ServiceType.BIRTH_ACT_APPLICATION]: [
        'Pièce d\'identité du demandeur',
        'Acte de naissance des parents (si disponible)',
        'Certificat de mariage des parents (si applicable)',
        'Attestation de témoin'
      ],
      [ServiceType.CONSULAR_CARD]: [
        'Passeport tchadien',
        'Photo d\'identité récente',
        'Justificatif de domicile',
        'Certificat de nationalité (si requis)'
      ],
      [ServiceType.PASSPORT_RENEWAL]: [
        'Ancien passeport',
        'Photo d\'identité récente',
        'Justificatif de domicile',
        'Acte de naissance'
      ],
      [ServiceType.CERTIFICATE_OF_LIFE]: [
        'Pièce d\'identité',
        'Photo d\'identité récente',
        'Justificatif de domicile'
      ],
      [ServiceType.POWER_OF_ATTORNEY]: [
        'Pièce d\'identité du mandant',
        'Pièce d\'identité du mandataire',
        'Justificatif de domicile',
        'Document à légaliser (si applicable)'
      ],
      [ServiceType.MARRIAGE_CERTIFICATE]: [
        'Pièces d\'identité des époux',
        'Actes de naissance des époux',
        'Certificat de célibat',
        'Photos d\'identité'
      ],
      [ServiceType.DEATH_CERTIFICATE]: [
        'Pièce d\'identité du défunt',
        'Certificat médical de décès',
        'Pièce d\'identité du demandeur',
        'Justificatif de lien de parenté'
      ],
      [ServiceType.NATIONALITY_CERTIFICATE]: [
        'Acte de naissance',
        'Pièce d\'identité',
        'Justificatif de domicile',
        'Documents prouvant la nationalité tchadienne'
      ],
      [ServiceType.STUDENT_CERTIFICATE]: [
        'Pièce d\'identité',
        'Certificat de scolarité',
        'Relevé de notes',
        'Photo d\'identité'
      ],
    }
    
    return documents[serviceType] || []
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (uploadedFiles.length + acceptedFiles.length > maxFiles) {
      alert(`Vous ne pouvez télécharger que ${maxFiles} fichiers maximum`)
      return
    }

    setIsUploading(true)
    
    const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      progress: 0,
      status: 'uploading' as const
    }))

    setUploadedFiles(prev => [...prev, ...newFiles])

    // Simuler l'upload avec progression
    for (const uploadFile of newFiles) {
      try {
        // Simulation de progression
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 100))
          setUploadedFiles(prev => 
            prev.map(f => 
              f.id === uploadFile.id 
                ? { ...f, progress }
                : f
            )
          )
        }
        
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === uploadFile.id 
              ? { ...f, status: 'success' as const }
              : f
          )
        )
      } catch (error) {
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === uploadFile.id 
              ? { ...f, status: 'error' as const, error: 'Erreur lors du téléchargement' }
              : f
          )
        )
      }
    }

    setIsUploading(false)
    
    // Mettre à jour les fichiers dans le parent
    const allFiles = [...uploadedFiles, ...newFiles].map(f => f.file)
    onFilesChange(allFiles)
  }, [uploadedFiles, maxFiles, onFilesChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
    multiple: true,
    disabled: isUploading
  })

  const removeFile = (fileId: string) => {
    const updatedFiles = uploadedFiles.filter(f => f.id !== fileId)
    setUploadedFiles(updatedFiles)
    onFilesChange(updatedFiles.map(f => f.file))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const requiredDocs = getRequiredDocuments(serviceType)

  return (
    <div className="space-y-6">
      {/* Documents requis */}
      {requiredDocs.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-blue-900 flex items-center space-x-2">
            <Icon name="list-checks" className="w-4 h-4" />
            <span>Documents requis pour ce service :</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {requiredDocs.map((doc, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <Icon name="check-circle" className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>{doc}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Zone de drop */}
      <Card 
        {...getRootProps()} 
        className={cn(
          "border-2 border-dashed transition-colors cursor-pointer",
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400",
          isUploading && "pointer-events-none opacity-50"
        )}
      >
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <input {...getInputProps()} />
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Icon name="upload" className="w-8 h-8 text-blue-600" />
          </div>
          
          {isDragActive ? (
            <p className="text-blue-600 font-medium">Déposez les fichiers ici...</p>
          ) : (
            <div className="space-y-2">
              <p className="text-gray-700 font-medium">
                Glissez-déposez vos documents ici, ou cliquez pour sélectionner
              </p>
              <p className="text-sm text-gray-500">
                Formats acceptés: JPG, PNG, PDF, DOC, DOCX (max {maxSize}MB par fichier)
              </p>
              <p className="text-xs text-gray-400">
                Maximum {maxFiles} fichiers
              </p>
            </div>
          )}
          
          <Button 
            type="button" 
            variant="outline" 
            className="mt-4"
            disabled={isUploading}
          >
            <Icon name="folder-open" className="w-4 h-4 mr-2" />
            Parcourir les fichiers
          </Button>
        </CardContent>
      </Card>

      {/* Fichiers téléchargés */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-blue-900 flex items-center space-x-2">
            <Icon name="paperclip" className="w-4 h-4" />
            <span>Fichiers téléchargés ({uploadedFiles.length}/{maxFiles})</span>
          </h4>
          
          <div className="space-y-2">
            {uploadedFiles.map((uploadedFile) => (
              <Card key={uploadedFile.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Icon 
                        name={uploadedFile.file.type.includes('image') ? 'image' : 'file-text'} 
                        className="w-5 h-5 text-gray-600" 
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {uploadedFile.file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(uploadedFile.file.size)}
                      </p>
                      
                      {uploadedFile.status === 'uploading' && (
                        <div className="mt-2">
                          <Progress value={uploadedFile.progress} className="h-1" />
                          <p className="text-xs text-blue-600 mt-1">
                            Téléchargement... {uploadedFile.progress}%
                          </p>
                        </div>
                      )}
                      
                      {uploadedFile.status === 'error' && (
                        <p className="text-xs text-red-600 mt-1">
                          {uploadedFile.error}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {uploadedFile.status === 'success' && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <Icon name="check" className="w-3 h-3 mr-1" />
                          Téléchargé
                        </Badge>
                      )}
                      
                      {uploadedFile.status === 'error' && (
                        <Badge variant="destructive">
                          <Icon name="x" className="w-3 h-3 mr-1" />
                          Erreur
                        </Badge>
                      )}
                      
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(uploadedFile.id)}
                        disabled={uploadedFile.status === 'uploading'}
                      >
                        <Icon name="trash-2" className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Informations importantes */}
      <Alert>
        <Icon name="info" className="h-4 w-4" />
        <AlertDescription>
          <strong>Important :</strong> Assurez-vous que tous les documents sont lisibles et en couleur. 
          Les documents flous ou de mauvaise qualité peuvent retarder le traitement de votre demande.
        </AlertDescription>
      </Alert>
    </div>
  )
}