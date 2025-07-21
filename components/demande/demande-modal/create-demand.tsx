"use client"

import { Dialog, Transition } from "@headlessui/react"
import { Fragment, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, FileText, User, CreditCard, Hash, X, Plus, Upload, CheckCircle2, ChevronRight } from "lucide-react"
import { useCreateDemande } from "@/hooks/use-demandes"
import Image from "next/image"

interface CreateDemandeModalProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  onSuccess?: () => void
}

export function CreateDemandeModal({ isOpen, setIsOpen, onSuccess }: CreateDemandeModalProps) {
  const [step, setStep] = useState(1)
  const [serviceType, setServiceType] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    // Données générales
    contactPhoneNumber: "",
    observations: "",
    amount: 0,
    
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
    
    // Champs spécifiques BIRTH_ACT
    requestType: "NEWBORN" as "NEWBORN" | "RENEWAL",
    
    // Champs spécifiques CONSULAR_CARD
    personAddressInOriginCountry: "",
    justificationDocumentType: "",
    justificationDocumentNumber: "",
    
    // Champs spécifiques LAISSEZ_PASSER
    destination: "",
    travelReason: "",
    accompanied: false,
  })

  const createDemandeMutation = useCreateDemande()

  const serviceTypes = [
    { value: "VISA", label: "🛂 Visa", description: "Demande de visa de séjour", price: 65000 },
    { value: "BIRTH_ACT_APPLICATION", label: "👶 Acte de naissance", description: "Acte de naissance officiel", price: 15000 },
    { value: "CONSULAR_CARD", label: "🆔 Carte consulaire", description: "Carte consulaire d'identité", price: 25000 },
    { value: "LAISSEZ_PASSER", label: "📄 Laissez-passer", description: "Document de voyage temporaire", price: 35000 },
    { value: "MARRIAGE_CAPACITY_ACT", label: "💍 Capacité de mariage", description: "Certificat de capacité à mariage", price: 20000 },
    { value: "DEATH_ACT_APPLICATION", label: "⚱️ Acte de décès", description: "Acte de décès officiel", price: 18000 },
    { value: "POWER_OF_ATTORNEY", label: "📝 Procuration", description: "Document de procuration légale", price: 30000 },
    { value: "NATIONALITY_CERTIFICATE", label: "🏛️ Certificat nationalité", description: "Certificat de nationalité", price: 45000 }
  ]

  const selectedService = serviceTypes.find(s => s.value === serviceType)

  const handleServiceSelect = (service: string) => {
    const selectedSrv = serviceTypes.find(s => s.value === service)
    setServiceType(service)
    setFormData(prev => ({ ...prev, amount: selectedSrv?.price || 0 }))
    setStep(2)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      setFiles(prev => [...prev, ...selectedFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    try {
      // Créer FormData pour multipart/form-data (comme attendu par le backend)
      const formDataToSend = new FormData()
      
      // Ajouter les champs de base
      formDataToSend.append('serviceType', serviceType)
      formDataToSend.append('amount', formData.amount.toString())
      if (formData.contactPhoneNumber) formDataToSend.append('contactPhoneNumber', formData.contactPhoneNumber)
      if (formData.observations) formDataToSend.append('observations', formData.observations)
      
      // Ajouter les fichiers
      files.forEach((file) => {
        formDataToSend.append('files', file)
      })
      
      // Préparer les détails selon le type de service
      let serviceDetails = {
        personFirstName: formData.personFirstName,
        personLastName: formData.personLastName,
        personGender: formData.personGender,
        personBirthDate: formData.personBirthDate,
        personBirthPlace: formData.personBirthPlace,
        personNationality: formData.personNationality,
        personMaritalStatus: formData.personMaritalStatus,
        personProfession: formData.personProfession || undefined,
        personDomicile: formData.personDomicile || undefined,
        fatherFullName: formData.fatherFullName || undefined,
        motherFullName: formData.motherFullName || undefined,
      }
      
      // Ajouter les champs spécifiques selon le type de service
      switch (serviceType) {
        case 'VISA':
          serviceDetails = {
            ...serviceDetails,
            passportType: formData.passportType,
            passportNumber: formData.passportNumber,
            passportIssuedBy: formData.passportIssuedBy,
            passportIssueDate: formData.passportIssueDate,
            passportExpirationDate: formData.passportExpirationDate,
            employerAddress: formData.employerAddress || undefined,
            employerPhoneNumber: formData.employerPhoneNumber || undefined,
            visaType: formData.visaType,
            durationMonths: formData.durationMonths,
            destinationState: formData.destinationState || undefined,
          }
          break
        case 'BIRTH_ACT_APPLICATION':
          serviceDetails = { 
            ...serviceDetails, 
            requestType: formData.requestType 
          }
          break
        case 'CONSULAR_CARD':
          serviceDetails = {
            ...serviceDetails,
            personAddressInOriginCountry: formData.personAddressInOriginCountry || undefined,
            justificationDocumentType: formData.justificationDocumentType || undefined,
            justificationDocumentNumber: formData.justificationDocumentNumber || undefined,
          }
          break
        case 'LAISSEZ_PASSER':
          serviceDetails = { 
            ...serviceDetails, 
            destination: formData.destination || undefined,
            travelReason: formData.travelReason || undefined,
            accompanied: formData.accompanied,
            accompaniers: []
          }
          break
        // Pour les autres services, on garde les détails de base
        default:
          break
      }
      
      // Ajouter les détails du service comme JSON
      formDataToSend.append(`${serviceType.toLowerCase()}Details`, JSON.stringify(serviceDetails))
      
      console.log('FormData envoyée:', {
        serviceType,
        amount: formData.amount,
        contactPhoneNumber: formData.contactPhoneNumber,
        observations: formData.observations,
        files: files.map(f => f.name),
        serviceDetails
      })
      
      await createDemandeMutation.mutateAsync(formDataToSend as any)
      // Le toast de succès est géré par le hook
      setIsOpen(false)
      resetForm()
      onSuccess?.()
    } catch (error: any) {
      // Le toast d'erreur est géré par le hook
      console.error('Erreur détaillée:', error)
    }
  }

  const resetForm = () => {
    setStep(1)
    setServiceType("")
    setFiles([])
    setFormData({
      contactPhoneNumber: "",
      observations: "",
      amount: 0,
      personFirstName: "",
      personLastName: "",
      personGender: "MALE",
      personBirthDate: "",
      personBirthPlace: "",
      personNationality: "",
      personMaritalStatus: "SINGLE",
      personProfession: "",
      personDomicile: "",
      fatherFullName: "",
      motherFullName: "",
      passportType: "ORDINARY",
      passportNumber: "",
      passportIssuedBy: "",
      passportIssueDate: "",
      passportExpirationDate: "",
      employerAddress: "",
      employerPhoneNumber: "",
      visaType: "SHORT_STAY",
      durationMonths: 3,
      destinationState: "",
      requestType: "NEWBORN",
      personAddressInOriginCountry: "",
      justificationDocumentType: "",
      justificationDocumentNumber: "",
      destination: "",
      travelReason: "",
      accompanied: false,
    })
  }

  const renderServiceSpecificFields = () => {
    if (!serviceType) return null

    switch (serviceType) {
      case 'VISA':
        return (
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-gray-900 dark:text-white">Informations passeport et visa</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="passportType">Type de passeport *</Label>
                <Select value={formData.passportType} onValueChange={(value: any) => setFormData(prev => ({ ...prev, passportType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ORDINARY">Ordinaire</SelectItem>
                    <SelectItem value="SERVICE">Service</SelectItem>
                    <SelectItem value="DIPLOMATIC">Diplomatique</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="passportNumber">Numéro de passeport *</Label>
                <Input
                  id="passportNumber"
                  value={formData.passportNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, passportNumber: e.target.value }))}
                  placeholder="TD1234567"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="passportIssuedBy">Délivré par *</Label>
                <Input
                  id="passportIssuedBy"
                  value={formData.passportIssuedBy}
                  onChange={(e) => setFormData(prev => ({ ...prev, passportIssuedBy: e.target.value }))}
                  placeholder="Ambassade du Tchad"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="visaType">Type de visa *</Label>
                <Select value={formData.visaType} onValueChange={(value: any) => setFormData(prev => ({ ...prev, visaType: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SHORT_STAY">Court séjour</SelectItem>
                    <SelectItem value="LONG_STAY">Long séjour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="passportIssueDate">Date de délivrance</Label>
                <Input
                  id="passportIssueDate"
                  type="date"
                  value={formData.passportIssueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, passportIssueDate: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="passportExpirationDate">Date d'expiration</Label>
                <Input
                  id="passportExpirationDate"
                  type="date"
                  value={formData.passportExpirationDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, passportExpirationDate: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="durationMonths">Durée (mois)</Label>
                <Input
                  id="durationMonths"
                  type="number"
                  min="1"
                  max="12"
                  value={formData.durationMonths}
                  onChange={(e) => setFormData(prev => ({ ...prev, durationMonths: parseInt(e.target.value) || 3 }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="destinationState">État de destination</Label>
              <Input
                id="destinationState"
                value={formData.destinationState}
                onChange={(e) => setFormData(prev => ({ ...prev, destinationState: e.target.value }))}
                placeholder="France"
              />
            </div>

            <div>
              <Label htmlFor="employerAddress">Adresse de l'employeur</Label>
              <Textarea
                id="employerAddress"
                value={formData.employerAddress}
                onChange={(e) => setFormData(prev => ({ ...prev, employerAddress: e.target.value }))}
                placeholder="Adresse complète de l'employeur"
              />
            </div>

            <div>
              <Label htmlFor="employerPhoneNumber">Téléphone de l'employeur</Label>
              <Input
                id="employerPhoneNumber"
                value={formData.employerPhoneNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, employerPhoneNumber: e.target.value }))}
                placeholder="+33123456789"
              />
            </div>
          </div>
        )

      case 'BIRTH_ACT_APPLICATION':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="requestType">Type de demande</Label>
              <Select value={formData.requestType} onValueChange={(value: any) => setFormData(prev => ({ ...prev, requestType: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NEWBORN">Nouveau-né</SelectItem>
                  <SelectItem value="RENEWAL">Renouvellement</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 'CONSULAR_CARD':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="personAddressInOriginCountry">Adresse au pays d'origine</Label>
              <Textarea
                id="personAddressInOriginCountry"
                value={formData.personAddressInOriginCountry}
                onChange={(e) => setFormData(prev => ({ ...prev, personAddressInOriginCountry: e.target.value }))}
                placeholder="Adresse au Tchad"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="justificationDocumentType">Type de document justificatif</Label>
                <Input
                  id="justificationDocumentType"
                  value={formData.justificationDocumentType}
                  onChange={(e) => setFormData(prev => ({ ...prev, justificationDocumentType: e.target.value }))}
                  placeholder="PASSPORT, CNI, etc."
                />
              </div>
              
              <div>
                <Label htmlFor="justificationDocumentNumber">Numéro du document</Label>
                <Input
                  id="justificationDocumentNumber"
                  value={formData.justificationDocumentNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, justificationDocumentNumber: e.target.value }))}
                  placeholder="Numéro du document"
                />
              </div>
            </div>
          </div>
        )

      case 'LAISSEZ_PASSER':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="destination">Destination</Label>
                <Input
                  id="destination"
                  value={formData.destination}
                  onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                  placeholder="Tchad"
                />
              </div>
              
              <div>
                <Label htmlFor="accompanied">Accompagné</Label>
                <Select value={formData.accompanied.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, accompanied: value === 'true' }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">Non</SelectItem>
                    <SelectItem value="true">Oui</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="travelReason">Motif du voyage</Label>
              <Textarea
                id="travelReason"
                value={formData.travelReason}
                onChange={(e) => setFormData(prev => ({ ...prev, travelReason: e.target.value }))}
                placeholder="Voyage familial d'urgence"
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setIsOpen}>
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
                    <div className="flex items-center justify-between mb-6">
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
                            Nouvelle Demande
                            <Plus className="h-6 w-6 text-white/80" />
                          </h1>
                          <p className="text-white/80 text-sm font-normal mt-1">Créer une demande consulaire</p>
                        </div>
                      </Dialog.Title>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsOpen(false)}
                        className="text-white hover:bg-white/20 rounded-xl p-3 transition-all duration-200 hover:scale-105"
                      >
                        <X className="h-6 w-6" />
                      </Button>
                    </div>

                    {/* Steps indicator */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${step === 1 ? 'bg-white/20' : 'bg-white/10'}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-white text-blue-600' : 'bg-white/30'}`}>
                          1
                        </div>
                        <span className="text-sm">Type de service</span>
                      </div>
                      <div className="w-8 h-0.5 bg-white/30"></div>
                      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${step === 2 ? 'bg-white/20' : 'bg-white/10'}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-white text-yellow-600' : 'bg-white/30'}`}>
                          2
                        </div>
                        <span className="text-sm">Informations</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 max-h-[600px] overflow-y-auto">
                  {step === 1 && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Choisissez le type de service</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {serviceTypes.map((service) => (
                          <div
                            key={service.value}
                            onClick={() => handleServiceSelect(service.value)}
                            className="p-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-800 cursor-pointer transition-all duration-200 group"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h4 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-700">
                                  {service.label}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{service.description}</p>
                              </div>
                              <div className="text-right">
                                <span className="text-2xl font-bold text-yellow-600">
                                  {service.price.toLocaleString('fr-FR')} F
                                </span>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Prix (FCFA)</p>
                              </div>
                            </div>
                            <div className="flex justify-end">
                              <ChevronRight className="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-500" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {step === 2 && selectedService && (
                    <div className="space-y-8">
                      {/* Service sélectionné */}
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-lg font-bold text-blue-800">{selectedService.label}</h4>
                            <p className="text-sm text-blue-700">{selectedService.description}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-2xl font-bold text-yellow-600">
                              {selectedService.price.toLocaleString('fr-FR')} F CFA
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setStep(1)}
                              className="text-blue-600 hover:text-blue-700 ml-4"
                            >
                              Modifier
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Informations personnelles de base */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <User className="h-5 w-5 text-blue-600" />
                            Informations du bénéficiaire
                          </h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="firstName">Prénom *</Label>
                              <Input
                                id="firstName"
                                value={formData.personFirstName}
                                onChange={(e) => setFormData(prev => ({ ...prev, personFirstName: e.target.value }))}
                                placeholder="Jean Baptiste"
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="lastName">Nom *</Label>
                              <Input
                                id="lastName"
                                value={formData.personLastName}
                                onChange={(e) => setFormData(prev => ({ ...prev, personLastName: e.target.value }))}
                                placeholder="NGARTI"
                                required
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="gender">Genre *</Label>
                              <Select value={formData.personGender} onValueChange={(value: any) => setFormData(prev => ({ ...prev, personGender: value }))}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="MALE">Masculin</SelectItem>
                                  <SelectItem value="FEMALE">Féminin</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <Label htmlFor="maritalStatus">Statut marital</Label>
                              <Select value={formData.personMaritalStatus} onValueChange={(value: any) => setFormData(prev => ({ ...prev, personMaritalStatus: value }))}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="SINGLE">Célibataire</SelectItem>
                                  <SelectItem value="MARRIED">Marié(e)</SelectItem>
                                  <SelectItem value="DIVORCED">Divorcé(e)</SelectItem>
                                  <SelectItem value="WIDOWED">Veuf/Veuve</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="birthDate">Date de naissance *</Label>
                            <Input
                              id="birthDate"
                              type="date"
                              value={formData.personBirthDate}
                              onChange={(e) => setFormData(prev => ({ ...prev, personBirthDate: e.target.value }))}
                              required
                            />
                          </div>

                          <div>
                            <Label htmlFor="birthPlace">Lieu de naissance *</Label>
                            <Input
                              id="birthPlace"
                              value={formData.personBirthPlace}
                              onChange={(e) => setFormData(prev => ({ ...prev, personBirthPlace: e.target.value }))}
                              placeholder="N'Djamena, Tchad"
                              required
                            />
                          </div>

                          <div>
                            <Label htmlFor="nationality">Nationalité *</Label>
                            <Input
                              id="nationality"
                              value={formData.personNationality}
                              onChange={(e) => setFormData(prev => ({ ...prev, personNationality: e.target.value }))}
                              placeholder="Tchadienne"
                              required
                            />
                          </div>

                          <div>
                            <Label htmlFor="profession">Profession</Label>
                            <Input
                              id="profession"
                              value={formData.personProfession}
                              onChange={(e) => setFormData(prev => ({ ...prev, personProfession: e.target.value }))}
                              placeholder="Ingénieur informatique"
                            />
                          </div>

                          <div>
                            <Label htmlFor="domicile">Domicile actuel</Label>
                            <Textarea
                              id="domicile"
                              value={formData.personDomicile}
                              onChange={(e) => setFormData(prev => ({ ...prev, personDomicile: e.target.value }))}
                              placeholder="45 Avenue des Champs, 75008 Paris, France"
                              className="min-h-[80px]"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="father">Nom complet du père</Label>
                              <Input
                                id="father"
                                value={formData.fatherFullName}
                                onChange={(e) => setFormData(prev => ({ ...prev, fatherFullName: e.target.value }))}
                                placeholder="Pierre NGARTI"
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="mother">Nom complet de la mère</Label>
                              <Input
                                id="mother"
                                value={formData.motherFullName}
                                onChange={(e) => setFormData(prev => ({ ...prev, motherFullName: e.target.value }))}
                                placeholder="Marie KOULANG"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Informations complémentaires */}
                        <div className="space-y-6">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <FileText className="h-5 w-5 text-purple-600" />
                            Informations complémentaires
                          </h3>

                          <div>
                            <Label htmlFor="phone">Téléphone de contact</Label>
                            <Input
                              id="phone"
                              value={formData.contactPhoneNumber}
                              onChange={(e) => setFormData(prev => ({ ...prev, contactPhoneNumber: e.target.value }))}
                              placeholder="+225 XX XX XX XX XX"
                            />
                          </div>

                          <div>
                            <Label htmlFor="observations">Observations</Label>
                            <Textarea
                              id="observations"
                              value={formData.observations}
                              onChange={(e) => setFormData(prev => ({ ...prev, observations: e.target.value }))}
                              placeholder="Informations supplémentaires..."
                              className="min-h-[100px]"
                            />
                          </div>

                          {/* Champs spécifiques selon le service */}
                          {renderServiceSpecificFields()}

                          {/* Upload de documents */}
                          <div>
                            <Label>Documents à joindre</Label>
                            <div className="mt-2">
                              <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                onChange={handleFileChange}
                                className="hidden"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full"
                              >
                                <Upload className="h-4 w-4 mr-2" />
                                Ajouter des documents
                              </Button>
                              
                              {files.length > 0 && (
                                <div className="mt-3 space-y-2">
                                  {files.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                      <span className="text-sm">{file.name}</span>
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
                        </div>
                      </div>

                      <div className="flex justify-between pt-6 border-t">
                        <Button
                          variant="outline"
                          onClick={() => setStep(1)}
                          className="flex items-center gap-2"
                        >
                          Retour
                        </Button>
                        <Button
                          onClick={handleSubmit}
                          disabled={createDemandeMutation.isPending || !formData.personFirstName || !formData.personLastName}
                          className="bg-gradient-to-r from-blue-600 to-yellow-500 hover:from-blue-700 hover:to-yellow-600 flex items-center gap-2"
                        >
                          {createDemandeMutation.isPending ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Création...
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-4 w-4" />
                              Créer la demande
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}

                  {createDemandeMutation.error && (
                    <Alert variant="destructive" className="mt-4">
                      <AlertDescription>
                        {createDemandeMutation.error.message}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}