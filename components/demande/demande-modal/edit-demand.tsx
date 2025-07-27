"use client"

import { Dialog, Transition } from "@headlessui/react"
import { Fragment, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Demande, RequestStatus, ServiceType } from "@/types/demande.types"
import { User, Mail, Phone, FileText } from "lucide-react"

interface EditDemandeModalProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  demande: Demande
  onSubmit: (updatedDemande: Partial<Demande>) => void
}

// Fonctions utilitaires pour les libellés
function getStatusLabel(status: RequestStatus): string {
  const labels: Record<RequestStatus, string> = {
    PENDING: "En attente",
    UNDER_REVIEW: "En révision",
    APPROVED: "Approuvé",
    REJECTED: "Rejeté",
    COMPLETED: "Terminé"
  }
  return labels[status]
}

function getServiceLabel(service: ServiceType): string {
  const labels: Record<ServiceType, string> = {
    VISA: "Visa",
    PASSPORT: "Passeport",
    BIRTH_CERTIFICATE: "Acte de naissance",
    MARRIAGE_CERTIFICATE: "Acte de mariage",
    DEATH_CERTIFICATE: "Acte de décès",
    NATIONALITY_CERTIFICATE: "Certificat de nationalité",
    RESIDENCE_PERMIT: "Permis de séjour",
    OTHER: "Autre"
  }
  return labels[service]
}

export function EditDemandeModal({ isOpen, setIsOpen, demande, onSubmit }: EditDemandeModalProps) {
  const [formData, setFormData] = useState({
    status: demande.status,
    serviceType: demande.serviceType,
    personalInfo: {
      firstName: demande.personalInfo.firstName,
      lastName: demande.personalInfo.lastName,
      email: demande.personalInfo.email,
      dateOfBirth: demande.personalInfo.dateOfBirth,
      placeOfBirth: demande.personalInfo.placeOfBirth,
      nationality: demande.personalInfo.nationality,
      gender: demande.personalInfo.gender
    },
    contactInfo: {
      phone: demande.contactInfo.phone,
      address: demande.contactInfo.address,
      city: demande.contactInfo.city,
      country: demande.contactInfo.country,
      postalCode: demande.contactInfo.postalCode
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setIsOpen(false)
  }

  const updateFormData = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }))
  }

  const updateDirectField = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setIsOpen}>
        <Transition.Child as={Fragment}>
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child as={Fragment}>
              <Dialog.Panel className="w-full max-w-4xl rounded-xl bg-white shadow-xl">
                <div className="bg-gradient-to-r from-blue-600 to-yellow-500 p-6 rounded-t-xl">
                  <Dialog.Title className="text-xl font-bold text-white">
                    Modifier la Demande #{demande.id}
                  </Dialog.Title>
                </div>

                <form onSubmit={handleSubmit} className="p-6 max-h-[70vh] overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Informations générales */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-blue-700">
                          <FileText className="w-5 h-5" />
                          Informations générales
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="serviceType">Type de service</Label>
                          <Select
                            value={formData.serviceType}
                            onValueChange={(value) => updateDirectField('serviceType', value as ServiceType)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un service" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.values(ServiceType).map((service) => (
                                <SelectItem key={service} value={service}>
                                  {getServiceLabel(service)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="status">Statut</Label>
                          <Select
                            value={formData.status}
                            onValueChange={(value) => updateDirectField('status', value as RequestStatus)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un statut" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.values(RequestStatus).map((status) => (
                                <SelectItem key={status} value={status}>
                                  {getStatusLabel(status)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Informations personnelles */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-blue-700">
                          <User className="w-5 h-5" />
                          Informations personnelles
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="firstName">Prénom</Label>
                            <Input
                              id="firstName"
                              value={formData.personalInfo.firstName}
                              onChange={(e) => updateFormData('personalInfo', 'firstName', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="lastName">Nom</Label>
                            <Input
                              id="lastName"
                              value={formData.personalInfo.lastName}
                              onChange={(e) => updateFormData('personalInfo', 'lastName', e.target.value)}
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.personalInfo.email}
                            onChange={(e) => updateFormData('personalInfo', 'email', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="dateOfBirth">Date de naissance</Label>
                          <Input
                            id="dateOfBirth"
                            type="date"
                            value={formData.personalInfo.dateOfBirth}
                            onChange={(e) => updateFormData('personalInfo', 'dateOfBirth', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="placeOfBirth">Lieu de naissance</Label>
                          <Input
                            id="placeOfBirth"
                            value={formData.personalInfo.placeOfBirth}
                            onChange={(e) => updateFormData('personalInfo', 'placeOfBirth', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="nationality">Nationalité</Label>
                          <Input
                            id="nationality"
                            value={formData.personalInfo.nationality}
                            onChange={(e) => updateFormData('personalInfo', 'nationality', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="gender">Sexe</Label>
                          <Select
                            value={formData.personalInfo.gender}
                            onValueChange={(value) => updateFormData('personalInfo', 'gender', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="MALE">Masculin</SelectItem>
                              <SelectItem value="FEMALE">Féminin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Informations de contact */}
                    <Card className="md:col-span-2">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-blue-700">
                          <Phone className="w-5 h-5" />
                          Informations de contact
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="phone">Téléphone</Label>
                          <Input
                            id="phone"
                            value={formData.contactInfo.phone}
                            onChange={(e) => updateFormData('contactInfo', 'phone', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="country">Pays</Label>
                          <Input
                            id="country"
                            value={formData.contactInfo.country}
                            onChange={(e) => updateFormData('contactInfo', 'country', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="city">Ville</Label>
                          <Input
                            id="city"
                            value={formData.contactInfo.city}
                            onChange={(e) => updateFormData('contactInfo', 'city', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="postalCode">Code postal</Label>
                          <Input
                            id="postalCode"
                            value={formData.contactInfo.postalCode || ''}
                            onChange={(e) => updateFormData('contactInfo', 'postalCode', e.target.value)}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="address">Adresse</Label>
                          <Textarea
                            id="address"
                            value={formData.contactInfo.address}
                            onChange={(e) => updateFormData('contactInfo', 'address', e.target.value)}
                            rows={3}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsOpen(false)}
                    >
                      Annuler
                    </Button>
                    <Button 
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Enregistrer les modifications
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
