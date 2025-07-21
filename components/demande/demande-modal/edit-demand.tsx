"use client"

import { Dialog, Transition } from "@headlessui/react"
import { Fragment, useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Edit3, User, FileText, X, CheckCircle2 } from "lucide-react"
import { useUpdateDemande } from "@/hooks/use-demandes"
import type { Demande } from "@/lib/api/demandes.service"
import Image from "next/image"

interface EditDemandeModalProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  demande: Demande | null
  onSuccess?: () => void
}

export function EditDemandeModal({ isOpen, setIsOpen, demande, onSuccess }: EditDemandeModalProps) {
  const [formData, setFormData] = useState({
    // Données générales
    contactPhoneNumber: "",
    observations: "",
    amount: 0,
    status: "",
    serviceType: "",
    
    // Données personnelles de base (pour tous les services)
    personFirstName: "",
    personLastName: "",
    personGender: "MALE" as "MALE" | "FEMALE",
    personBirthDate: "",
    personBirthPlace: "",
    personNationality: "",
    personMaritalStatus: "SINGLE" as "SINGLE" | "MARRIED" | "DIVORCED" | "WIDOWED",
    personProfession: "",
    personDomicile: "",
    fatherFullName: "",
    motherFullName: "",
    
    // Champs spécifiques VISA
    passportType: "ORDINARY" as "ORDINARY" | "SERVICE" | "DIPLOMATIC",
    passportNumber: "",
    passportIssuedBy: "",
    passportIssueDate: "",
    passportExpirationDate: "",
    employerAddress: "",
    employerPhoneNumber: "",
    visaType: "SHORT_STAY" as "SHORT_STAY" | "LONG_STAY",
    durationMonths: 3,
    destinationState: "",
    
    // Champs spécifiques autres services
    requestType: "NEWBORN" as "NEWBORN" | "RENEWAL",
    personAddressInOriginCountry: "",
    justificationDocumentType: "",
    justificationDocumentNumber: "",
    destination: "",
    travelReason: "",
    accompanied: false,
  })

  const updateDemandeMutation = useUpdateDemande()

  // Fonction pour obtenir le nom du service
  const getServiceTypeLabel = (serviceType: string) => {
    const serviceLabels = {
      VISA: "Visa de séjour",
      BIRTH_ACT_APPLICATION: "Acte de naissance",
      CONSULAR_CARD: "Carte consulaire",
      LAISSEZ_PASSER: "Laissez-passer",
      MARRIAGE_CAPACITY_ACT: "Acte de capacité de mariage",
      DEATH_ACT_APPLICATION: "Acte de décès",
      POWER_OF_ATTORNEY: "Procuration",
      NATIONALITY_CERTIFICATE: "Certificat de nationalité"
    }
    return serviceLabels[serviceType] || serviceType
  }

  // Fonction pour extraire les informations de la personne selon le type de service
  const getPersonDetails = (demande: Demande) => {
    const details = 
      demande?.visaDetails ||
      demande?.birthActDetails ||
      demande?.consularCardDetails ||
      demande?.laissezPasserDetails ||
      demande?.marriageCapacityActDetails ||
      demande?.deathActDetails ||
      demande?.powerOfAttorneyDetails ||
      demande?.nationalityCertificateDetails
    
    return details || {}
  }

  useEffect(() => {
    if (demande) {
      const personDetails = getPersonDetails(demande)
      console.log('Demande data:', demande)
      console.log('Person details:', personDetails)
      
      setFormData({
        // Données générales
        contactPhoneNumber: demande.contactPhoneNumber || "",
        observations: demande.observations || "",
        amount: demande.amount || 0,
        status: demande.status || "",
        serviceType: demande.serviceType || "",
        
        // Données personnelles
        personFirstName: personDetails.personFirstName || "",
        personLastName: personDetails.personLastName || "",
        personGender: personDetails.personGender || "MALE",
        personBirthDate: personDetails.personBirthDate ? 
          new Date(personDetails.personBirthDate).toISOString().split('T')[0] : "",
        personBirthPlace: personDetails.personBirthPlace || "",
        personNationality: personDetails.personNationality || "",
        personMaritalStatus: personDetails.personMaritalStatus || "SINGLE",
        personProfession: personDetails.profession || personDetails.personProfession || "",
        personDomicile: personDetails.personDomicile || "",
        fatherFullName: personDetails.fatherFullName || "",
        motherFullName: personDetails.motherFullName || "",
        
        // Champs spécifiques VISA
        passportType: personDetails.passportType || "ORDINARY",
        passportNumber: personDetails.passportNumber || "",
        passportIssuedBy: personDetails.passportIssuedBy || "",
        passportIssueDate: personDetails.passportIssueDate || "",
        passportExpirationDate: personDetails.passportExpirationDate || "",
        employerAddress: personDetails.employerAddress || "",
        employerPhoneNumber: personDetails.employerPhoneNumber || "",
        visaType: personDetails.visaType || "SHORT_STAY",
        durationMonths: personDetails.durationMonths || 3,
        destinationState: personDetails.destinationState || "",
        
        // Autres champs spécifiques
        requestType: personDetails.requestType || "NEWBORN",
        personAddressInOriginCountry: personDetails.personAddressInOriginCountry || "",
        justificationDocumentType: personDetails.justificationDocumentType || "",
        justificationDocumentNumber: personDetails.justificationDocumentNumber || "",
        destination: personDetails.destination || "",
        travelReason: personDetails.travelReason || "",
        accompanied: personDetails.accompanied || false,
      })
    }
  }, [demande])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!demande) return

    try {
      console.log('🚀 Mise à jour du statut:', {
        id: demande.id,
        status: formData.status,
        observation: formData.observations
      })
      
      await updateDemandeMutation.mutateAsync({
        id: demande.id,
        status: formData.status,
        observation: formData.observations
      })
      
      setIsOpen(false)
      onSuccess?.()
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    // Le formulaire sera réinitialisé avec les données de la demande lors de la prochaine ouverture
  }

  if (!demande) return null

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-5xl rounded-2xl bg-white dark:bg-gray-900 shadow-2xl ring-1 ring-black/5 dark:ring-white/10 overflow-hidden">
                {/* Header premium */}
                <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-yellow-500 px-8 py-8 text-white overflow-hidden">
                  {/* Motifs de fond */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute -top-4 -right-4 w-32 h-32 rounded-full bg-white/20"></div>
                    <div className="absolute top-16 -left-8 w-24 h-24 rounded-full bg-white/10"></div>
                    <div className="absolute -bottom-8 right-16 w-40 h-40 rounded-full bg-white/5"></div>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <Dialog.Title className="text-3xl font-bold flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30 flex items-center justify-center">
                          <Image
                            src="/images/logo/logo.png"
                            alt="Logo Ambassade du Tchad"
                            width={32}
                            height={32}
                            className="w-8 h-8 object-contain"
                          />
                        </div>
                        <div>
                          <h1 className="text-3xl font-bold flex items-center gap-2">
                            Gérer : {getServiceTypeLabel(demande.serviceType)}
                            <Edit3 className="h-6 w-6 text-white/80" />
                          </h1>
                          <p className="text-white/80 text-sm font-normal mt-1">Ticket #{demande.ticketNumber} - Changement de statut</p>
                        </div>
                      </Dialog.Title>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClose}
                        className="text-white hover:bg-white/20 rounded-xl p-3 transition-all duration-200 hover:scale-105"
                      >
                        <X className="h-6 w-6" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-8 max-h-[600px] overflow-y-auto">
                  {updateDemandeMutation.error && (
                    <Alert variant="destructive" className="mb-6">
                      <AlertDescription>
                        Erreur: {updateDemandeMutation.error.message}
                      </AlertDescription>
                    </Alert>
                  )}

                  <form className="space-y-8" onSubmit={handleSubmit}>
                    {/* Informations de la demande (résumé) */}
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 mb-6">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Résumé de la demande</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label className="text-gray-600 dark:text-gray-400">Bénéficiaire</Label>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {formData.personFirstName} {formData.personLastName}
                          </p>
                        </div>
                        <div>
                          <Label className="text-gray-600 dark:text-gray-400">Service demandé</Label>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {getServiceTypeLabel(formData.serviceType)}
                          </p>
                        </div>
                        <div>
                          <Label className="text-gray-600 dark:text-gray-400">Montant</Label>
                          <p className="font-medium text-yellow-600">
                            {formData.amount?.toLocaleString('fr-FR')} F CFA
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Gestion du statut */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Edit3 className="h-5 w-5 text-purple-600" />
                        Gestion de la demande
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="status">Nouveau statut *</Label>
                          <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                            <SelectTrigger className="text-gray-900 dark:text-white">
                              <SelectValue placeholder="Choisir un statut" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="NEW">🆕 Nouvelle</SelectItem>
                              <SelectItem value="IN_REVIEW_DOCS">📋 En révision des documents</SelectItem>
                              <SelectItem value="PENDING_ADDITIONAL_INFO">❓ En attente d'infos complémentaires</SelectItem>
                              <SelectItem value="APPROVED_BY_AGENT">✅ Approuvée par l'agent</SelectItem>
                              <SelectItem value="APPROVED_BY_CHEF">👔 Approuvée par le chef</SelectItem>
                              <SelectItem value="APPROVED_BY_CONSUL">🏛️ Approuvée par le consul</SelectItem>
                              <SelectItem value="REJECTED">❌ Rejetée</SelectItem>
                              <SelectItem value="READY_FOR_PICKUP">📦 Prête pour retrait</SelectItem>
                              <SelectItem value="DELIVERED">✔️ Délivrée</SelectItem>
                              <SelectItem value="ARCHIVED">📁 Archivée</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="currentStatus">Statut actuel</Label>
                          <Input
                            id="currentStatus"
                            value={formData.status}
                            readOnly
                            className="bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white cursor-not-allowed"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="observations">Observations / Motif du changement</Label>
                        <Textarea
                          id="observations"
                          value={formData.observations}
                          onChange={(e) => setFormData(prev => ({ ...prev, observations: e.target.value }))}
                          placeholder="Expliquez le motif du changement de statut, commentaires pour le demandeur..."
                          className="min-h-[120px] text-gray-900 dark:text-white"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Ces observations seront visibles par le demandeur
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between pt-6 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        className="flex items-center gap-2"
                      >
                        Annuler
                      </Button>
                      <Button
                        type="submit"
                        disabled={updateDemandeMutation.isPending}
                        className="bg-gradient-to-r from-blue-600 to-yellow-500 hover:from-blue-700 hover:to-yellow-600 flex items-center gap-2"
                      >
                        {updateDemandeMutation.isPending ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Mise à jour...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-4 w-4" />
                            Enregistrer les modifications
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
