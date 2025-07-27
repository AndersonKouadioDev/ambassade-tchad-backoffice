"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Upload, X } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import type { Gender, MaritalStatus, PassportType, VisaType } from '@/types/demande.types';

// Schéma de validation pour les demandes de visa
const visaFormSchema = z.object({
  // Informations personnelles
  personFirstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  personLastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  personGender: z.enum(['MALE', 'FEMALE'] as const),
  personNationality: z.string().min(2, 'La nationalité est requise'),
  personBirthDate: z.date({ required_error: 'La date de naissance est requise' }),
  personBirthPlace: z.string().min(2, 'Le lieu de naissance est requis'),
  personMaritalStatus: z.enum(['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED'] as const),
  
  // Informations passeport
  passportType: z.enum(['ORDINARY', 'SERVICE', 'DIPLOMATIC'] as const),
  passportNumber: z.string().min(6, 'Le numéro de passeport doit contenir au moins 6 caractères'),
  passportIssuedBy: z.string().min(2, 'L\'autorité de délivrance est requise'),
  passportIssueDate: z.date({ required_error: 'La date de délivrance est requise' }),
  passportExpirationDate: z.date({ required_error: 'La date d\'expiration est requise' }),
  
  // Informations professionnelles (optionnelles)
  profession: z.string().optional(),
  employerAddress: z.string().optional(),
  employerPhoneNumber: z.string().optional(),
  
  // Informations visa
  visaType: z.enum(['SHORT_STAY', 'LONG_STAY'] as const),
  durationMonths: z.number().min(1, 'La durée doit être d\'au moins 1 mois').max(60, 'La durée ne peut pas dépasser 60 mois'),
  destinationState: z.string().optional(),
  
  // Contact
  contactPhoneNumber: z.string().optional(),
  amount: z.number().min(0, 'Le montant doit être positif'),
});

type VisaFormData = z.infer<typeof visaFormSchema>;

interface VisaFormProps {
  onSubmit: (data: VisaFormData, files: File[]) => Promise<void>;
  isLoading?: boolean;
  initialData?: Partial<VisaFormData>;
}

const VisaForm: React.FC<VisaFormProps> = ({ onSubmit, isLoading = false, initialData }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const form = useForm<VisaFormData>({
    resolver: zodResolver(visaFormSchema),
    defaultValues: {
      personGender: 'MALE',
      personMaritalStatus: 'SINGLE',
      passportType: 'ORDINARY',
      visaType: 'SHORT_STAY',
      durationMonths: 1,
      amount: 0,
      ...initialData,
    },
  });

  const handleSubmit = async (data: VisaFormData) => {
    try {
      await onSubmit(data, files);
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    }
  };

  const handleFileUpload = (uploadedFiles: FileList | null) => {
    if (!uploadedFiles) return;
    
    const newFiles = Array.from(uploadedFiles).filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      return validTypes.includes(file.type) && file.size <= 10 * 1024 * 1024; // 10MB max
    });
    
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileUpload(e.dataTransfer.files);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      {/* Informations personnelles */}
      <Card>
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="personFirstName">Prénom *</Label>
              <Input
                id="personFirstName"
                {...form.register('personFirstName')}
                placeholder="Entrez votre prénom"
              />
              {form.formState.errors.personFirstName && (
                <p className="text-sm text-red-500">{form.formState.errors.personFirstName.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="personLastName">Nom *</Label>
              <Input
                id="personLastName"
                {...form.register('personLastName')}
                placeholder="Entrez votre nom"
              />
              {form.formState.errors.personLastName && (
                <p className="text-sm text-red-500">{form.formState.errors.personLastName.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Genre *</Label>
              <Select
                value={form.watch('personGender')}
                onValueChange={(value: Gender) => form.setValue('personGender', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez votre genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Masculin</SelectItem>
                  <SelectItem value="FEMALE">Féminin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="personNationality">Nationalité *</Label>
              <Input
                id="personNationality"
                {...form.register('personNationality')}
                placeholder="Votre nationalité"
              />
              {form.formState.errors.personNationality && (
                <p className="text-sm text-red-500">{form.formState.errors.personNationality.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date de naissance *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !form.watch('personBirthDate') && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.watch('personBirthDate') ? (
                      format(form.watch('personBirthDate'), "PPP", { locale: fr })
                    ) : (
                      <span>Sélectionnez une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={form.watch('personBirthDate')}
                    onSelect={(date) => form.setValue('personBirthDate', date!)}
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {form.formState.errors.personBirthDate && (
                <p className="text-sm text-red-500">{form.formState.errors.personBirthDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="personBirthPlace">Lieu de naissance *</Label>
              <Input
                id="personBirthPlace"
                {...form.register('personBirthPlace')}
                placeholder="Lieu de naissance"
              />
              {form.formState.errors.personBirthPlace && (
                <p className="text-sm text-red-500">{form.formState.errors.personBirthPlace.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Statut matrimonial *</Label>
            <Select
              value={form.watch('personMaritalStatus')}
              onValueChange={(value: MaritalStatus) => form.setValue('personMaritalStatus', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez votre statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SINGLE">Célibataire</SelectItem>
                <SelectItem value="MARRIED">Marié(e)</SelectItem>
                <SelectItem value="DIVORCED">Divorcé(e)</SelectItem>
                <SelectItem value="WIDOWED">Veuf/Veuve</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Informations passeport */}
      <Card>
        <CardHeader>
          <CardTitle>Informations passeport</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type de passeport *</Label>
              <Select
                value={form.watch('passportType')}
                onValueChange={(value: PassportType) => form.setValue('passportType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Type de passeport" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ORDINARY">Ordinaire</SelectItem>
                  <SelectItem value="SERVICE">Service</SelectItem>
                  <SelectItem value="DIPLOMATIC">Diplomatique</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="passportNumber">Numéro de passeport *</Label>
              <Input
                id="passportNumber"
                {...form.register('passportNumber')}
                placeholder="Numéro de passeport"
              />
              {form.formState.errors.passportNumber && (
                <p className="text-sm text-red-500">{form.formState.errors.passportNumber.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="passportIssuedBy">Délivré par *</Label>
            <Input
              id="passportIssuedBy"
              {...form.register('passportIssuedBy')}
              placeholder="Autorité de délivrance"
            />
            {form.formState.errors.passportIssuedBy && (
              <p className="text-sm text-red-500">{form.formState.errors.passportIssuedBy.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date de délivrance *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !form.watch('passportIssueDate') && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.watch('passportIssueDate') ? (
                      format(form.watch('passportIssueDate'), "PPP", { locale: fr })
                    ) : (
                      <span>Date de délivrance</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={form.watch('passportIssueDate')}
                    onSelect={(date) => form.setValue('passportIssueDate', date!)}
                    disabled={(date) => date > new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Date d'expiration *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !form.watch('passportExpirationDate') && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.watch('passportExpirationDate') ? (
                      format(form.watch('passportExpirationDate'), "PPP", { locale: fr })
                    ) : (
                      <span>Date d'expiration</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={form.watch('passportExpirationDate')}
                    onSelect={(date) => form.setValue('passportExpirationDate', date!)}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informations visa */}
      <Card>
        <CardHeader>
          <CardTitle>Informations visa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type de visa *</Label>
              <Select
                value={form.watch('visaType')}
                onValueChange={(value: VisaType) => form.setValue('visaType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Type de visa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SHORT_STAY">Séjour court</SelectItem>
                  <SelectItem value="LONG_STAY">Séjour long</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="durationMonths">Durée (mois) *</Label>
              <Input
                id="durationMonths"
                type="number"
                min="1"
                max="60"
                {...form.register('durationMonths', { valueAsNumber: true })}
                placeholder="Durée en mois"
              />
              {form.formState.errors.durationMonths && (
                <p className="text-sm text-red-500">{form.formState.errors.durationMonths.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="destinationState">État de destination</Label>
              <Input
                id="destinationState"
                {...form.register('destinationState')}
                placeholder="État de destination (optionnel)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Montant (FCFA) *</Label>
              <Input
                id="amount"
                type="number"
                min="0"
                {...form.register('amount', { valueAsNumber: true })}
                placeholder="Montant à payer"
              />
              {form.formState.errors.amount && (
                <p className="text-sm text-red-500">{form.formState.errors.amount.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informations professionnelles */}
      <Card>
        <CardHeader>
          <CardTitle>Informations professionnelles (optionnel)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="profession">Profession</Label>
            <Input
              id="profession"
              {...form.register('profession')}
              placeholder="Votre profession"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="employerAddress">Adresse de l'employeur</Label>
            <Textarea
              id="employerAddress"
              {...form.register('employerAddress')}
              placeholder="Adresse complète de l'employeur"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="employerPhoneNumber">Téléphone de l'employeur</Label>
            <Input
              id="employerPhoneNumber"
              {...form.register('employerPhoneNumber')}
              placeholder="Numéro de téléphone de l'employeur"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPhoneNumber">Votre téléphone de contact</Label>
            <Input
              id="contactPhoneNumber"
              {...form.register('contactPhoneNumber')}
              placeholder="Votre numéro de téléphone"
            />
          </div>
        </CardContent>
      </Card>

      {/* Upload de documents */}
      <Card>
        <CardHeader>
          <CardTitle>Documents requis</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
              dragActive ? "border-primary bg-primary/5" : "border-gray-300",
              "hover:border-primary hover:bg-primary/5"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium mb-2">Glissez vos documents ici</p>
            <p className="text-sm text-gray-500 mb-4">
              ou cliquez pour sélectionner des fichiers
            </p>
            <input
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
              id="file-upload"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              Sélectionner des fichiers
            </Button>
            <p className="text-xs text-gray-400 mt-2">
              Formats acceptés: JPG, PNG, PDF, DOC, DOCX (max 10MB par fichier)
            </p>
          </div>

          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="font-medium">Fichiers sélectionnés:</h4>
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm truncate">{file.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Boutons d'action */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline">
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Envoi en cours...' : 'Soumettre la demande'}
        </Button>
      </div>
    </form>
  );
};

export default VisaForm;