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
import type { Gender, MaritalStatus, PassportType } from '@/types/demande.types';

// Schéma de validation pour les demandes de passeport
const passportFormSchema = z.object({
  // Informations personnelles
  personFirstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  personLastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  personGender: z.enum(['MALE', 'FEMALE'] as const),
  personNationality: z.string().min(2, 'La nationalité est requise'),
  personBirthDate: z.date({ required_error: 'La date de naissance est requise' }),
  personBirthPlace: z.string().min(2, 'Le lieu de naissance est requis'),
  personMaritalStatus: z.enum(['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED'] as const),
  personHeight: z.number().min(100, 'La taille doit être d\'au moins 100 cm').max(250, 'La taille ne peut pas dépasser 250 cm'),
  personEyeColor: z.string().min(2, 'La couleur des yeux est requise'),
  
  // Informations d'adresse
  personAddress: z.string().min(10, 'L\'adresse doit contenir au moins 10 caractères'),
  personCity: z.string().min(2, 'La ville est requise'),
  personState: z.string().min(2, 'L\'état/région est requis'),
  personPostalCode: z.string().optional(),
  
  // Informations de contact
  personPhoneNumber: z.string().min(8, 'Le numéro de téléphone doit contenir au moins 8 chiffres'),
  personEmail: z.string().email('L\'email doit être valide').optional(),
  
  // Informations professionnelles
  profession: z.string().min(2, 'La profession est requise'),
  employerName: z.string().optional(),
  employerAddress: z.string().optional(),
  employerPhoneNumber: z.string().optional(),
  
  // Informations passeport
  passportType: z.enum(['ORDINARY', 'SERVICE', 'DIPLOMATIC'] as const),
  isRenewal: z.boolean(),
  previousPassportNumber: z.string().optional(),
  
  // Contact d'urgence
  emergencyContactName: z.string().min(2, 'Le nom du contact d\'urgence est requis'),
  emergencyContactRelationship: z.string().min(2, 'La relation avec le contact d\'urgence est requise'),
  emergencyContactPhoneNumber: z.string().min(8, 'Le numéro du contact d\'urgence est requis'),
  emergencyContactAddress: z.string().min(10, 'L\'adresse du contact d\'urgence est requise'),
  
  // Montant
  amount: z.number().min(0, 'Le montant doit être positif'),
});

type PassportFormData = z.infer<typeof passportFormSchema>;

interface PassportFormProps {
  onSubmit: (data: PassportFormData, files: File[]) => Promise<void>;
  isLoading?: boolean;
  initialData?: Partial<PassportFormData>;
}

const PassportForm: React.FC<PassportFormProps> = ({ onSubmit, isLoading = false, initialData }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const form = useForm<PassportFormData>({
    resolver: zodResolver(passportFormSchema),
    defaultValues: {
      personGender: 'MALE',
      personMaritalStatus: 'SINGLE',
      passportType: 'ORDINARY',
      isRenewal: false,
      personHeight: 170,
      amount: 0,
      ...initialData,
    },
  });

  const handleSubmit = async (data: PassportFormData) => {
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            <div className="space-y-2">
              <Label htmlFor="personHeight">Taille (cm) *</Label>
              <Input
                id="personHeight"
                type="number"
                min="100"
                max="250"
                {...form.register('personHeight', { valueAsNumber: true })}
                placeholder="Taille en centimètres"
              />
              {form.formState.errors.personHeight && (
                <p className="text-sm text-red-500">{form.formState.errors.personHeight.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="personEyeColor">Couleur des yeux *</Label>
              <Select
                value={form.watch('personEyeColor')}
                onValueChange={(value) => form.setValue('personEyeColor', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Couleur des yeux" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BROWN">Marron</SelectItem>
                  <SelectItem value="BLACK">Noir</SelectItem>
                  <SelectItem value="BLUE">Bleu</SelectItem>
                  <SelectItem value="GREEN">Vert</SelectItem>
                  <SelectItem value="HAZEL">Noisette</SelectItem>
                  <SelectItem value="GRAY">Gris</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.personEyeColor && (
                <p className="text-sm text-red-500">{form.formState.errors.personEyeColor.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informations d'adresse */}
      <Card>
        <CardHeader>
          <CardTitle>Adresse de résidence</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="personAddress">Adresse complète *</Label>
            <Textarea
              id="personAddress"
              {...form.register('personAddress')}
              placeholder="Adresse complète de résidence"
              rows={3}
            />
            {form.formState.errors.personAddress && (
              <p className="text-sm text-red-500">{form.formState.errors.personAddress.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="personCity">Ville *</Label>
              <Input
                id="personCity"
                {...form.register('personCity')}
                placeholder="Ville"
              />
              {form.formState.errors.personCity && (
                <p className="text-sm text-red-500">{form.formState.errors.personCity.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="personState">État/Région *</Label>
              <Input
                id="personState"
                {...form.register('personState')}
                placeholder="État ou région"
              />
              {form.formState.errors.personState && (
                <p className="text-sm text-red-500">{form.formState.errors.personState.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="personPostalCode">Code postal</Label>
              <Input
                id="personPostalCode"
                {...form.register('personPostalCode')}
                placeholder="Code postal (optionnel)"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informations de contact */}
      <Card>
        <CardHeader>
          <CardTitle>Informations de contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="personPhoneNumber">Numéro de téléphone *</Label>
              <Input
                id="personPhoneNumber"
                {...form.register('personPhoneNumber')}
                placeholder="Numéro de téléphone"
              />
              {form.formState.errors.personPhoneNumber && (
                <p className="text-sm text-red-500">{form.formState.errors.personPhoneNumber.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="personEmail">Email</Label>
              <Input
                id="personEmail"
                type="email"
                {...form.register('personEmail')}
                placeholder="Adresse email (optionnel)"
              />
              {form.formState.errors.personEmail && (
                <p className="text-sm text-red-500">{form.formState.errors.personEmail.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informations professionnelles */}
      <Card>
        <CardHeader>
          <CardTitle>Informations professionnelles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="profession">Profession *</Label>
            <Input
              id="profession"
              {...form.register('profession')}
              placeholder="Votre profession"
            />
            {form.formState.errors.profession && (
              <p className="text-sm text-red-500">{form.formState.errors.profession.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="employerName">Nom de l'employeur</Label>
            <Input
              id="employerName"
              {...form.register('employerName')}
              placeholder="Nom de votre employeur (optionnel)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="employerAddress">Adresse de l'employeur</Label>
            <Textarea
              id="employerAddress"
              {...form.register('employerAddress')}
              placeholder="Adresse complète de l'employeur (optionnel)"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="employerPhoneNumber">Téléphone de l'employeur</Label>
            <Input
              id="employerPhoneNumber"
              {...form.register('employerPhoneNumber')}
              placeholder="Numéro de téléphone de l'employeur (optionnel)"
            />
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

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isRenewal"
              {...form.register('isRenewal')}
              className="rounded border-gray-300"
            />
            <Label htmlFor="isRenewal">Il s'agit d'un renouvellement</Label>
          </div>

          {form.watch('isRenewal') && (
            <div className="space-y-2">
              <Label htmlFor="previousPassportNumber">Numéro du passeport précédent</Label>
              <Input
                id="previousPassportNumber"
                {...form.register('previousPassportNumber')}
                placeholder="Numéro du passeport à renouveler"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact d'urgence */}
      <Card>
        <CardHeader>
          <CardTitle>Contact d'urgence</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emergencyContactName">Nom complet *</Label>
              <Input
                id="emergencyContactName"
                {...form.register('emergencyContactName')}
                placeholder="Nom du contact d'urgence"
              />
              {form.formState.errors.emergencyContactName && (
                <p className="text-sm text-red-500">{form.formState.errors.emergencyContactName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContactRelationship">Relation *</Label>
              <Select
                value={form.watch('emergencyContactRelationship')}
                onValueChange={(value) => form.setValue('emergencyContactRelationship', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Relation avec vous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PARENT">Parent</SelectItem>
                  <SelectItem value="SPOUSE">Époux/Épouse</SelectItem>
                  <SelectItem value="CHILD">Enfant</SelectItem>
                  <SelectItem value="SIBLING">Frère/Sœur</SelectItem>
                  <SelectItem value="FRIEND">Ami(e)</SelectItem>
                  <SelectItem value="OTHER">Autre</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.emergencyContactRelationship && (
                <p className="text-sm text-red-500">{form.formState.errors.emergencyContactRelationship.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergencyContactPhoneNumber">Numéro de téléphone *</Label>
            <Input
              id="emergencyContactPhoneNumber"
              {...form.register('emergencyContactPhoneNumber')}
              placeholder="Numéro de téléphone du contact d'urgence"
            />
            {form.formState.errors.emergencyContactPhoneNumber && (
              <p className="text-sm text-red-500">{form.formState.errors.emergencyContactPhoneNumber.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergencyContactAddress">Adresse *</Label>
            <Textarea
              id="emergencyContactAddress"
              {...form.register('emergencyContactAddress')}
              placeholder="Adresse complète du contact d'urgence"
              rows={3}
            />
            {form.formState.errors.emergencyContactAddress && (
              <p className="text-sm text-red-500">{form.formState.errors.emergencyContactAddress.message}</p>
            )}
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

export default PassportForm;