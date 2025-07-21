"use client"

import { Fragment, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, FileText, Upload, X } from "lucide-react"
import { useCreateDemande } from "@/hooks/use-demandes"
import { useUploadDocument } from "@/hooks/use-documents"

interface AddDemandeModalProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

interface FormData {
  nom: string
  prenom: string
  dateNaissance: string
  lieuNaissance: string
  nationalite: string
  telephone: string
  email: string
  service: string
  typeDocument: string
  motif: string
}

const initialFormData: FormData = {
  nom: '',
  prenom: '',
  dateNaissance: '',
  lieuNaissance: '',
  nationalite: '',
  telephone: '',
  email: '',
  service: '',
  typeDocument: '',
  motif: ''
}

const services = [
  'CONSULAIRE',
  'VISA',
  'PASSEPORT',
  'ETAT_CIVIL',
  'LEGALISATION'
]

const typesDocument = [
  'PASSEPORT',
  'VISA_TOURISME',
  'VISA_AFFAIRES',
  'VISA_ETUDIANT',
  'ACTE_NAISSANCE',
  'ACTE_MARIAGE',
  'ACTE_DECES',
  'LEGALISATION_DOCUMENT'
]

export default function AddDemandeModal({ isOpen, setIsOpen }: AddDemandeModalProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [files, setFiles] = useState<File[]>([])
  
  const createDemandeMutation = useCreateDemande()
  const uploadDocumentMutation = useUploadDocument()

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)])
    }
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Créer la demande
      const demande = await createDemandeMutation.mutateAsync({
        ...formData,
        statut: 'EN_ATTENTE'
      })

      // Uploader les documents si il y en a
      if (files.length > 0 && demande.id) {
        for (const file of files) {
          await uploadDocumentMutation.mutateAsync({
            file,
            demandeId: demande.id,
            type: 'JUSTIFICATIF'
          })
        }
      }

      // Réinitialiser le formulaire et fermer la modale
      setFormData(initialFormData)
      setFiles([])
      setIsOpen(false)
    } catch (error) {
      console.error('Erreur lors de la création:', error)
    }
  }

  const handleClose = () => {
    setFormData(initialFormData)
    setFiles([])
    setIsOpen(false)
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child as={Fragment}>
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child as={Fragment}>
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl">
                <Dialog.Title className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Nouvelle demande
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Informations personnelles */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-4">Informations personnelles</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="nom">Nom *</Label>
                        <Input
                          id="nom"
                          value={formData.nom}
                          onChange={(e) => handleInputChange('nom', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="prenom">Prénom *</Label>
                        <Input
                          id="prenom"
                          value={formData.prenom}
                          onChange={(e) => handleInputChange('prenom', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="dateNaissance">Date de naissance</Label>
                        <Input
                          id="dateNaissance"
                          type="date"
                          value={formData.dateNaissance}
                          onChange={(e) => handleInputChange('dateNaissance', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lieuNaissance">Lieu de naissance</Label>
                        <Input
                          id="lieuNaissance"
                          value={formData.lieuNaissance}
                          onChange={(e) => handleInputChange('lieuNaissance', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="nationalite">Nationalité</Label>
                        <Input
                          id="nationalite"
                          value={formData.nationalite}
                          onChange={(e) => handleInputChange('nationalite', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="telephone">Téléphone</Label>
                        <Input
                          id="telephone"
                          value={formData.telephone}
                          onChange={(e) => handleInputChange('telephone', e.target.value)}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Informations de la demande */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-4">Détails de la demande</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="service">Service *</Label>
                        <Select value={formData.service} onValueChange={(value) => handleInputChange('service', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un service" />
                          </SelectTrigger>
                          <SelectContent>
                            {services.map((service) => (
                              <SelectItem key={service} value={service}>
                                {service.replace(/_/g, ' ')}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="typeDocument">Type de document *</Label>
                        <Select value={formData.typeDocument} onValueChange={(value) => handleInputChange('typeDocument', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un type" />
                          </SelectTrigger>
                          <SelectContent>
                            {typesDocument.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type.replace(/_/g, ' ')}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="motif">Motif de la demande</Label>
                        <Textarea
                          id="motif"
                          value={formData.motif}
                          onChange={(e) => handleInputChange('motif', e.target.value)}
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Upload de documents */}
                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-4">Documents justificatifs</h3>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="files" className="cursor-pointer">
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                            <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600">Cliquez pour ajouter des fichiers</p>
                            <p className="text-xs text-gray-500">PDF, JPG, PNG (max 10MB)</p>
                          </div>
                        </Label>
                        <Input
                          id="files"
                          type="file"
                          multiple
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </div>
                      
                      {files.length > 0 && (
                        <div className="space-y-2">
                          {files.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                              <span className="text-sm text-gray-700">{file.name}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Erreurs */}
                  {(createDemandeMutation.error || uploadDocumentMutation.error) && (
                    <Alert variant="destructive">
                      <AlertDescription>
                        Erreur: {createDemandeMutation.error?.message || uploadDocumentMutation.error?.message}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleClose}
                      disabled={createDemandeMutation.isPending || uploadDocumentMutation.isPending}
                    >
                      Annuler
                    </Button>
                    <Button
                      type="submit"
                      disabled={createDemandeMutation.isPending || uploadDocumentMutation.isPending}
                    >
                      {(createDemandeMutation.isPending || uploadDocumentMutation.isPending) && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Créer la demande
                    </Button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
