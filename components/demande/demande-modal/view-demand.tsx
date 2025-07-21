"use client"

import { Dialog, Transition } from "@headlessui/react"
import { Fragment } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, FileText, User, MapPin, Phone, Mail, Clock, CreditCard, Hash, X, Eye, CheckCircle2 } from "lucide-react"
import Image from "next/image"
import { useDemande } from "@/hooks/use-demandes"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface ViewDemandeModalProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  demandeId: number | null
}

export function ViewDemandeModal({ isOpen, setIsOpen, demandeId }: ViewDemandeModalProps) {
  const { data: demande, isLoading, error } = useDemande(demandeId || 0, {
    enabled: !!demandeId && isOpen
  })

  const getStatusInfo = (status: string) => {
    const statusMap = {
      'NEW': { 
        label: 'Nouvelle', 
        bg: 'bg-blue-500', 
        text: 'text-blue-800',
        border: 'border-blue-200',
        icon: '🆕'
      },
      'IN_REVIEW_DOCS': { 
        label: 'En révision', 
        bg: 'bg-gradient-to-r from-yellow-50 to-yellow-100', 
        text: 'text-yellow-800',
        border: 'border-yellow-200',
        icon: '📋'
      },
      'PENDING_ADDITIONAL_INFO': { 
        label: 'Infos manquantes', 
        bg: 'bg-gradient-to-r from-orange-50 to-orange-100', 
        text: 'text-orange-800',
        border: 'border-orange-200',
        icon: '❓'
      },
      'APPROVED_BY_AGENT': { 
        label: 'Approuvé par agent', 
        bg: 'bg-gradient-to-r from-green-50 to-green-100', 
        text: 'text-green-800',
        border: 'border-green-200',
        icon: '✅'
      },
      'APPROVED_BY_CHEF': { 
        label: 'Approuvé par chef', 
        bg: 'bg-gradient-to-r from-green-100 to-green-200', 
        text: 'text-green-900',
        border: 'border-green-300',
        icon: '👔'
      },
      'APPROVED_BY_CONSUL': { 
        label: 'Approuvé par consul', 
        bg: 'bg-gradient-to-r from-emerald-100 to-emerald-200', 
        text: 'text-emerald-900',
        border: 'border-emerald-300',
        icon: '🏛️'
      },
      'REJECTED': { 
        label: 'Rejetée', 
        bg: 'bg-gradient-to-r from-red-50 to-red-100', 
        text: 'text-red-800',
        border: 'border-red-200',
        icon: '❌'
      },
      'READY_FOR_PICKUP': { 
        label: 'Prête pour retrait', 
        bg: 'bg-gradient-to-r from-blue-50 to-blue-100', 
        text: 'text-blue-800',
        border: 'border-blue-200',
        icon: '📦'
      },
      'DELIVERED': { 
        label: 'Délivrée', 
        bg: 'bg-gradient-to-r from-gray-50 to-gray-100', 
        text: 'text-gray-800',
        border: 'border-gray-200',
        icon: '✔️'
      },
      'ARCHIVED': { 
        label: 'Archivée', 
        bg: 'bg-gradient-to-r from-gray-100 to-gray-200', 
        text: 'text-gray-700',
        border: 'border-gray-300',
        icon: '📁'
      },
      'EXPIRED': { 
        label: 'Expirée', 
        bg: 'bg-gradient-to-r from-red-100 to-red-200', 
        text: 'text-red-900',
        border: 'border-red-300',
        icon: '⏰'
      },
      'RENEWAL_REQUESTED': { 
        label: 'Renouvellement', 
        bg: 'bg-gradient-to-r from-indigo-50 to-indigo-100', 
        text: 'text-indigo-800',
        border: 'border-indigo-200',
        icon: '🔄'
      }
    }
    return statusMap[status] || { 
      label: status, 
      bg: 'bg-gray-100', 
      text: 'text-gray-800',
      border: 'border-gray-200',
      icon: '❔'
    }
  }

  const getServiceTypeLabel = (serviceType: string) => {
    const serviceLabels = {
      VISA: "🛂 Visa",
      BIRTH_ACT_APPLICATION: "👶 Acte de naissance",
      CONSULAR_CARD: "🆔 Carte consulaire",
      LAISSEZ_PASSER: "📄 Laissez-passer",
      MARRIAGE_CAPACITY_ACT: "💍 Acte de capacité de mariage",
      DEATH_ACT_APPLICATION: "⚱️ Acte de décès",
      POWER_OF_ATTORNEY: "📝 Procuration",
      NATIONALITY_CERTIFICATE: "🏛️ Certificat de nationalité"
    }
    return serviceLabels[serviceType] || serviceType
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy à HH:mm', { locale: fr })
    } catch {
      return dateString
    }
  }

  // Fonction pour extraire les informations de la personne selon le type de service
  const getPersonDetails = (demande: any) => {
    const details = 
      demande?.visaDetails ||
      demande?.birthActDetails ||
      demande?.consularCardDetails ||
      demande?.laissezPasserDetails ||
      demande?.marriageCapacityActDetails ||
      demande?.deathActDetails ||
      demande?.powerOfAttorneyDetails ||
      demande?.nationalityCertificateDetails
    
    if (!details) return null
    
    return {
      firstName: details.personFirstName,
      lastName: details.personLastName,
      birthDate: details.personBirthDate,
      birthPlace: details.personBirthPlace,
      nationality: details.personNationality,
      profession: details.personProfession,
      domicile: details.personDomicile,
      fatherName: details.fatherFullName,
      motherName: details.motherFullName,
      gender: details.personGender,
      maritalStatus: details.personMaritalStatus,
      addressInOriginCountry: details.personAddressInOriginCountry
    }
  }

  if (!demandeId) return null
  
  const personDetails = demande ? getPersonDetails(demande) : null

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
                  {/* Motif de fond */}
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
                            Détails de la Demande
                            <Eye className="h-6 w-6 text-white/80" />
                          </h1>
                          <p className="text-white/80 text-sm font-normal mt-1">Visualiser une demande consulaire</p>
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
                    
                    {demande && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Ticket */}
                        <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                          <div className="flex items-center gap-3">
                            <Hash className="h-5 w-5 text-white/80" />
                            <div>
                              <p className="text-white/70 text-xs font-medium uppercase tracking-wide">Numéro de ticket</p>
                              <p className="text-white font-bold font-mono text-lg">{demande.ticketNumber}</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Service */}
                        <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-white/80" />
                            <div>
                              <p className="text-white/70 text-xs font-medium uppercase tracking-wide">Type de service</p>
                              <p className="text-white font-bold text-lg">{getServiceTypeLabel(demande.serviceType)}</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Statut */}
                        <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                          <div className="flex items-center gap-3">
                            <div className="text-xl">{getStatusInfo(demande.status).icon}</div>
                            <div>
                              <p className="text-white/70 text-xs font-medium uppercase tracking-wide">Statut actuel</p>
                              <p className="text-white font-bold text-lg">{getStatusInfo(demande.status).label}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Barre de progression (si nécessaire) */}
                    {demande && (
                      <div className="mt-6">
                        <div className="flex items-center justify-between text-xs text-white/60 mb-2">
                          <span>Nouvelle</span>
                          <span>En cours</span>
                          <span>Prête</span>
                          <span>Livrée</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div 
                            className="bg-white rounded-full h-2 transition-all duration-500" 
                            style={{
                              width: demande.status === 'NEW' ? '25%' : 
                                     demande.status === 'IN_REVIEW_DOCS' || demande.status === 'APPROVED_BY_AGENT' ? '50%' : 
                                     demande.status === 'READY_FOR_PICKUP' ? '75%' : 
                                     demande.status === 'DELIVERED' ? '100%' : '25%'
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-8">
                  {isLoading && (
                    <div className="space-y-6">
                      <div className="flex items-center space-x-4">
                        <Skeleton className="h-16 w-16 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-6 w-48" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </div>
                      <Skeleton className="h-32 w-full rounded-xl" />
                    </div>
                  )}

                  {error && (
                    <Alert variant="destructive" className="mb-6">
                      <AlertDescription>
                        Erreur lors du chargement de la demande: {error.message}
                      </AlertDescription>
                    </Alert>
                  )}

                  {demande && (
                    <div className="space-y-8">
                   

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Informations du demandeur */}
                        <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                              {personDetails ? 'Informations du bénéficiaire' : 'Informations du demandeur'}
                            </h3>
                          </div>
                          
                          {personDetails ? (
                            <>
                              <div className="flex items-center gap-4 mb-6">
                                <Avatar className="h-16 w-16 ring-4 ring-blue-100">
                                  <AvatarFallback className="bg-blue-500 text-white text-lg font-bold">
                                    {personDetails.firstName?.charAt(0)}{personDetails.lastName?.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {personDetails.firstName} {personDetails.lastName}
                                  </h4>
                                  {personDetails.profession && (
                                    <p className="text-blue-600 text-sm font-medium">{personDetails.profession}</p>
                                  )}
                                  {personDetails.nationality && (
                                    <p className="text-gray-500 text-sm flex items-center gap-1">
                                      🏳️ {personDetails.nationality}
                                    </p>
                                  )}
                                </div>
                              </div>
                              
                              <div className="space-y-3">
                                {personDetails.birthDate && (
                                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                                    <Calendar className="h-4 w-4 text-blue-500" />
                                    <span className="font-medium text-gray-600">Date de naissance:</span>
                                    <span className="text-gray-900">{formatDate(personDetails.birthDate)}</span>
                                  </div>
                                )}
                                
                                {personDetails.birthPlace && (
                                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                                    <MapPin className="h-4 w-4 text-red-500 mt-0.5" />
                                    <div className="flex-1">
                                      <span className="font-medium text-gray-600">Lieu de naissance:</span>
                                      <p className="text-gray-900 text-sm mt-1">{personDetails.birthPlace}</p>
                                    </div>
                                  </div>
                                )}
                                
                                {personDetails.domicile && (
                                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                    <span className="text-lg mr-1 mt-0.5">🏠</span>
                                    <div className="flex-1">
                                      <span className="font-medium text-gray-600">Domicile actuel:</span>
                                      <p className="text-gray-900 text-sm mt-1">{personDetails.domicile}</p>
                                    </div>
                                  </div>
                                )}

                                {personDetails.addressInOriginCountry && (
                                  <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                                    <span className="text-lg mr-1 mt-0.5">🏡</span>
                                    <div className="flex-1">
                                      <span className="font-medium text-gray-600">Adresse au pays:</span>
                                      <p className="text-gray-900 text-sm mt-1">{personDetails.addressInOriginCountry}</p>
                                    </div>
                                  </div>
                                )}
                                
                                {personDetails.fatherName && (
                                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                    <span className="text-lg mr-1">👨</span>
                                    <span className="font-medium text-gray-600">Père:</span>
                                    <span className="text-gray-900">{personDetails.fatherName}</span>
                                  </div>
                                )}
                                
                                {personDetails.motherName && (
                                  <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-lg border border-pink-200">
                                    <span className="text-lg mr-1">👩</span>
                                    <span className="font-medium text-gray-600">Mère:</span>
                                    <span className="text-gray-900">{personDetails.motherName}</span>
                                  </div>
                                )}
                                
                                {demande.contactPhoneNumber && (
                                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                    <Phone className="h-4 w-4 text-green-600" />
                                    <span className="font-medium text-gray-600">Contact:</span>
                                    <span className="text-gray-900">{demande.contactPhoneNumber}</span>
                                  </div>
                                )}
                              </div>
                              
                              <div className="mt-4 pt-4 border-t border-gray-200">
                                <h4 className="text-sm font-semibold text-gray-700 mb-3">Compte utilisateur</h4>
                                <div className="flex items-center gap-2 text-sm">
                                  <Mail className="h-4 w-4 text-blue-500" />
                                  <span className="text-gray-600">Email:</span>
                                  <span className="text-gray-900">{demande.user?.email}</span>
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex items-center gap-4 mb-6">
                                <Avatar className="h-16 w-16 ring-4 ring-gray-100">
                                  <AvatarFallback className="bg-gray-400 text-white text-lg font-bold">
                                    {demande.user?.firstName?.charAt(0)}{demande.user?.lastName?.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {demande.user?.firstName} {demande.user?.lastName}
                                  </h4>
                                  <p className="text-gray-600 flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    {demande.user?.email}
                                  </p>
                                  <p className="text-orange-600 text-sm">Détails du bénéficiaire non disponibles</p>
                                </div>
                              </div>
                              
                              {demande.contactPhoneNumber && (
                                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                                  <Phone className="h-4 w-4 text-green-600" />
                                  <span className="font-medium text-gray-600">Contact:</span>
                                  <span className="text-gray-900">{demande.contactPhoneNumber}</span>
                                </div>
                              )}
                            </>
                          )}
                        </div>

                        {/* Détails de la demande */}
                        <div className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-900 rounded-2xl p-6 border border-blue-200 dark:border-blue-800 shadow-sm">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <FileText className="h-5 w-5 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                              Détails de la demande
                            </h3>
                          </div>

                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="p-3 bg-white rounded-lg border">
                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                  <Hash className="h-3 w-3" />
                                  Ticket
                                </div>
                                <p className="font-mono font-bold text-gray-900">
                                  {demande.ticketNumber}
                                </p>
                              </div>
                              <div className="p-3 bg-white rounded-lg border">
                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                  <CreditCard className="h-3 w-3" />
                                  Montant
                                </div>
                                <p className="text-xl font-bold text-green-600">
                                  {demande.amount} €
                                </p>
                              </div>
                            </div>

                            <div className="p-3 bg-white rounded-lg border">
                              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                <Calendar className="h-3 w-3" />
                                Date de soumission
                              </div>
                              <p className="text-gray-900 font-medium">
                                {formatDate(demande.submissionDate)}
                              </p>
                            </div>

                            {demande.completionDate && (
                              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                                <div className="flex items-center gap-2 text-sm text-green-700 mb-2">
                                  <CheckCircle2 className="h-3 w-3" />
                                  Date de traitement
                                </div>
                                <p className="text-green-900 font-medium">
                                  {formatDate(demande.completionDate)}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Observations */}
                      {demande.observations && (
                        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-6 border border-orange-200 dark:border-orange-800">
                          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <div className="p-1 bg-yellow-100 rounded-lg">
                              📝
                            </div>
                            Observations
                          </h3>
                          <div className="bg-white rounded-lg p-4 border">
                            <p className="text-gray-800 leading-relaxed">
                              {demande.observations}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-8 flex justify-end gap-3">
                    <Button 
                      onClick={() => setIsOpen(false)}
                      className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-8 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Fermer
                    </Button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}