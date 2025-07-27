'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Icon } from '@/components/ui/icon'
import { useCreateDemande } from '@/hooks/queries/demande-queries'
import { ServiceType } from '@/types/service-types'
import { DocumentUpload } from '../upload/document-upload'
import { ServiceFormRenderer } from './service-form-renderer'
import type { DemandeRequest } from '@/types/demande-types'

// Schema de validation de base
const baseDemandeSchema = z.object({
  serviceType: z.nativeEnum(ServiceType),
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  phone: z.string().min(8, 'Numéro de téléphone invalide'),
  address: z.string().min(5, 'Adresse complète requise'),
  city: z.string().min(2, 'Ville requise'),
  country: z.string().min(2, 'Pays requis'),
  birthDate: z.string().min(1, 'Date de naissance requise'),
  birthPlace: z.string().min(2, 'Lieu de naissance requis'),
  nationality: z.string().min(2, 'Nationalité requise'),
  profession: z.string().optional(),
  employer: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
})

type DemandeFormData = z.infer<typeof baseDemandeSchema> & {
  serviceDetails?: Record<string, any>
  documents?: File[]
}

interface DemandeFormProps {
  onSuccess?: () => void
  onCancel?: () => void
  initialData?: Partial<DemandeFormData>
}

export function DemandeForm({ onSuccess, onCancel, initialData }: DemandeFormProps) {
  const [selectedService, setSelectedService] = useState<ServiceType | null>(
    initialData?.serviceType || null
  )
  const [documents, setDocuments] = useState<File[]>([])
  const [serviceDetails, setServiceDetails] = useState<Record<string, any>>({})
  
  const createDemande = useCreateDemande()
  
  const form = useForm<DemandeFormData>({
    resolver: zodResolver(baseDemandeSchema),
    defaultValues: {
      serviceType: ServiceType.VISA,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: '',
      birthDate: '',
      birthPlace: '',
      nationality: '',
      profession: '',
      employer: '',
      emergencyContact: '',
      emergencyPhone: '',
      ...initialData,
    },
  })

  const onSubmit = async (data: DemandeFormData) => {
    try {
      const formData = new FormData()
      
      // Ajouter les données de base
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString())
        }
      })
      
      // Ajouter les détails du service
      if (Object.keys(serviceDetails).length > 0) {
        formData.append('serviceDetails', JSON.stringify(serviceDetails))
      }
      
      // Ajouter les documents
      documents.forEach((file, index) => {
        formData.append(`documents`, file)
      })
      
      await createDemande.mutateAsync(formData)
      onSuccess?.()
    } catch (error) {
      console.error('Erreur lors de la soumission:', error)
    }
  }

  const serviceOptions = [
    { value: ServiceType.VISA, label: 'Demande de Visa', icon: 'passport' },
    { value: ServiceType.BIRTH_ACT_APPLICATION, label: 'Acte de Naissance', icon: 'file-text' },
    { value: ServiceType.CONSULAR_CARD, label: 'Carte Consulaire', icon: 'credit-card' },
    { value: ServiceType.PASSPORT_RENEWAL, label: 'Renouvellement Passeport', icon: 'refresh-cw' },
    { value: ServiceType.CERTIFICATE_OF_LIFE, label: 'Certificat de Vie', icon: 'heart' },
    { value: ServiceType.POWER_OF_ATTORNEY, label: 'Procuration', icon: 'file-signature' },
    { value: ServiceType.MARRIAGE_CERTIFICATE, label: 'Certificat de Mariage', icon: 'heart-handshake' },
    { value: ServiceType.DEATH_CERTIFICATE, label: 'Certificat de Décès', icon: 'cross' },
    { value: ServiceType.NATIONALITY_CERTIFICATE, label: 'Certificat de Nationalité', icon: 'flag' },
    { value: ServiceType.STUDENT_CERTIFICATE, label: 'Certificat Étudiant', icon: 'graduation-cap' },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* En-tête avec logo ambassade */}
      <Card className="border-l-4 border-l-blue-600">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-yellow-50">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <Icon name="flag" className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl text-blue-900">
                Nouvelle Demande Consulaire
              </CardTitle>
              <p className="text-blue-700 mt-1">
                Ambassade de la République du Tchad
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Sélection du service */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Icon name="settings" className="w-5 h-5 text-blue-600" />
                <span>Type de Service</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="serviceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service demandé *</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        setSelectedService(value as ServiceType)
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Sélectionnez un service" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {serviceOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center space-x-2">
                              <Icon name={option.icon} className="w-4 h-4" />
                              <span>{option.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Informations personnelles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Icon name="user" className="w-5 h-5 text-blue-600" />
                <span>Informations Personnelles</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom *</FormLabel>
                      <FormControl>
                        <Input placeholder="Votre prénom" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom *</FormLabel>
                      <FormControl>
                        <Input placeholder="Votre nom" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date de naissance *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="birthPlace"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lieu de naissance *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ville, Pays" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="nationality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nationalité *</FormLabel>
                      <FormControl>
                        <Input placeholder="Votre nationalité" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Informations de contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Icon name="phone" className="w-5 h-5 text-blue-600" />
                <span>Informations de Contact</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="votre@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone *</FormLabel>
                      <FormControl>
                        <Input placeholder="+33 1 23 45 67 89" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse complète *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Numéro, rue, code postal, ville" 
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ville *</FormLabel>
                      <FormControl>
                        <Input placeholder="Votre ville" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pays *</FormLabel>
                      <FormControl>
                        <Input placeholder="Votre pays" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Informations professionnelles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Icon name="briefcase" className="w-5 h-5 text-blue-600" />
                <span>Informations Professionnelles</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="profession"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profession</FormLabel>
                      <FormControl>
                        <Input placeholder="Votre profession" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="employer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employeur</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom de l'employeur" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact d'urgence */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Icon name="shield" className="w-5 h-5 text-blue-600" />
                <span>Contact d'Urgence</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="emergencyContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom du contact</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom complet" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="emergencyPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone d'urgence</FormLabel>
                      <FormControl>
                        <Input placeholder="+33 1 23 45 67 89" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Formulaire spécifique au service */}
          {selectedService && (
            <ServiceFormRenderer
              serviceType={selectedService}
              onDataChange={setServiceDetails}
              initialData={serviceDetails}
            />
          )}

          {/* Upload de documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Icon name="paperclip" className="w-5 h-5 text-blue-600" />
                <span>Documents Requis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DocumentUpload
                serviceType={selectedService}
                onFilesChange={setDocuments}
                maxFiles={10}
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-end space-x-4">
                {onCancel && (
                  <Button type="button" variant="outline" onClick={onCancel}>
                    Annuler
                  </Button>
                )}
                <Button 
                  type="submit" 
                  disabled={createDemande.isPending}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                >
                  {createDemande.isPending ? (
                    <>
                      <Icon name="loader-2" className="w-4 h-4 mr-2 animate-spin" />
                      Création en cours...
                    </>
                  ) : (
                    <>
                      <Icon name="send" className="w-4 h-4 mr-2" />
                      Soumettre la demande
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  )
}