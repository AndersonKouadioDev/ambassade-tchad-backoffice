"use client";

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CalendarIcon } from 'lucide-react';

// Fonction utilitaire pour formater les dates
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(date);
};

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DocumentUploader } from '../upload/document-uploader';

import { ServiceType, FormField, ServiceFormConfig } from '@/types/demande.types';
import { SERVICE_FORM_CONFIGS } from './service-form-configs';
import { cn } from '@/lib/utils';

interface GenericDemandFormProps {
  serviceType: ServiceType;
  onSubmit: (data: any, files: File[]) => Promise<void>;
  isLoading?: boolean;
  initialData?: any;
  mode: 'create' | 'edit';
}

// Fonction pour créer le schéma de validation dynamiquement
const createValidationSchema = (config: ServiceFormConfig) => {
  const schemaFields: Record<string, z.ZodTypeAny> = {
    // Champs obligatoires du demandeur
    demandeurFirstName: z.string().min(1, 'Le prénom est requis'),
    demandeurLastName: z.string().min(1, 'Le nom est requis'),
    demandeurEmail: z.string().email('Email invalide'),
    demandeurPhone: z.string().min(1, 'Le téléphone est requis'),
  };
  
  config.sections.forEach(section => {
    section.fields.forEach(field => {
      let fieldSchema: z.ZodTypeAny;
      
      switch (field.type) {
        case 'email':
          fieldSchema = z.string().email('Email invalide');
          break;
        case 'number':
          fieldSchema = z.coerce.number();
          if (field.validation?.min !== undefined) {
            fieldSchema = fieldSchema.min(field.validation.min, `Minimum ${field.validation.min}`);
          }
          if (field.validation?.max !== undefined) {
            fieldSchema = fieldSchema.max(field.validation.max, `Maximum ${field.validation.max}`);
          }
          break;
        case 'date':
          fieldSchema = z.date({ required_error: `${field.label} est requis` });
          break;
        case 'checkbox':
          fieldSchema = z.boolean();
          break;
        default:
          fieldSchema = z.string();
          if (field.validation?.min) {
            fieldSchema = fieldSchema.min(field.validation.min, field.validation.message || `Minimum ${field.validation.min} caractères`);
          }
          break;
      }
      
      if (!field.required) {
        fieldSchema = fieldSchema.optional();
      } else if (field.type !== 'number' && field.type !== 'date' && field.type !== 'checkbox') {
        fieldSchema = fieldSchema.min(1, `${field.label} est requis`);
      }
      
      schemaFields[field.name] = fieldSchema;
    });
  });
  
  return z.object(schemaFields);
};

export const GenericDemandForm: React.FC<GenericDemandFormProps> = ({
  serviceType,
  onSubmit,
  isLoading = false,
  initialData,
  mode
}) => {
  const [files, setFiles] = React.useState<File[]>([]);
  const config = SERVICE_FORM_CONFIGS[serviceType];
  
  const validationSchema = React.useMemo(() => createValidationSchema(config), [config]);
  
  const form = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: initialData || {}
  });

  const handleSubmit = async (data: any) => {
    try {
      await onSubmit(data, files);
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    }
  };

  const renderField = (field: FormField) => {
    const error = form.formState.errors[field.name];
    const colSpanClass = field.colSpan === 2 ? 'col-span-2' : field.colSpan === 3 ? 'col-span-3' : 'col-span-1';

    const fieldWrapper = (content: React.ReactNode) => (
      <div key={field.name} className={`space-y-2 ${colSpanClass}`}>
        <Label htmlFor={field.name} className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {field.label}
          {field.required && <span className="text-yellow-500 ml-1">*</span>}
        </Label>
        {content}
        {error && (
          <p className="text-sm text-yellow-600 dark:text-yellow-400">
            {error.message as string}
          </p>
        )}
      </div>
    );

    switch (field.type) {
      case 'select':
        return fieldWrapper(
          <Controller
            name={field.name}
            control={form.control}
            render={({ field: formField }) => (
              <Select value={formField.value} onValueChange={formField.onChange}>
                <SelectTrigger className="border-blue-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder={field.placeholder || `Sélectionnez ${field.label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        );

      case 'date':
        return fieldWrapper(
          <Controller
            name={field.name}
            control={form.control}
            render={({ field: formField }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal border-blue-300 focus:border-blue-500",
                      !formField.value && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formField.value ? (
                      formatDate(formField.value)
                    ) : (
                      <span>Sélectionnez une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formField.value}
                    onSelect={formField.onChange}
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}
          />
        );

      case 'textarea':
        return fieldWrapper(
          <Textarea
            id={field.name}
            placeholder={field.placeholder}
            className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
            rows={3}
            {...form.register(field.name)}
          />
        );

      case 'checkbox':
        return fieldWrapper(
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={field.name}
              className="rounded border-blue-300 text-blue-500 focus:ring-blue-500"
              {...form.register(field.name)}
            />
            <Label htmlFor={field.name} className="text-sm text-gray-700 dark:text-gray-300">
              {field.placeholder || field.label}
            </Label>
          </div>
        );

      default:
        return fieldWrapper(
          <Input
            id={field.name}
            type={field.type}
            placeholder={field.placeholder}
            className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
            {...form.register(field.name)}
          />
        );
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      {/* Section informations personnelles du demandeur */}
      <Card className="border-blue-200 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-yellow-50 border-b border-blue-200">
          <CardTitle className="text-lg font-semibold text-blue-800">
            Informations personnelles
          </CardTitle>
          <p className="text-sm text-blue-600 mt-1">
            Veuillez renseigner vos informations personnelles
          </p>
        </CardHeader>
        <CardContent className="p-6 bg-white dark:bg-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="demandeurFirstName" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Prénom <span className="text-yellow-500 ml-1">*</span>
              </Label>
              <Input
                id="demandeurFirstName"
                type="text"
                placeholder="Votre prénom"
                className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                {...form.register('demandeurFirstName')}
              />
              {form.formState.errors.demandeurFirstName && (
                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                  {form.formState.errors.demandeurFirstName.message as string}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="demandeurLastName" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Nom <span className="text-yellow-500 ml-1">*</span>
              </Label>
              <Input
                id="demandeurLastName"
                type="text"
                placeholder="Votre nom"
                className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                {...form.register('demandeurLastName')}
              />
              {form.formState.errors.demandeurLastName && (
                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                  {form.formState.errors.demandeurLastName.message as string}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="demandeurEmail" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Email <span className="text-yellow-500 ml-1">*</span>
              </Label>
              <Input
                id="demandeurEmail"
                type="email"
                placeholder="votre.email@exemple.com"
                className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                {...form.register('demandeurEmail')}
              />
              {form.formState.errors.demandeurEmail && (
                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                  {form.formState.errors.demandeurEmail.message as string}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="demandeurPhone" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Téléphone <span className="text-yellow-500 ml-1">*</span>
              </Label>
              <Input
                id="demandeurPhone"
                type="tel"
                placeholder="+225 XX XX XX XX XX"
                className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                {...form.register('demandeurPhone')}
              />
              {form.formState.errors.demandeurPhone && (
                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                  {form.formState.errors.demandeurPhone.message as string}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sections du formulaire */}
      {config.sections.map((section, index) => (
        <Card key={index} className="border-blue-200 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-yellow-50 border-b border-blue-200">
            <CardTitle className="text-lg font-semibold text-blue-800">
              {section.title}
            </CardTitle>
            {section.description && (
              <p className="text-sm text-blue-600 mt-1">
                {section.description}
              </p>
            )}
          </CardHeader>
          <CardContent className="p-6 bg-white dark:bg-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.fields.map(renderField)}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Section des documents */}
      <Card className="border-blue-200 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-yellow-50 border-b border-blue-200">
          <CardTitle className="text-lg font-semibold text-blue-800">
            Documents requis
          </CardTitle>
          <p className="text-sm text-blue-600 mt-1">
            Veuillez joindre les documents suivants à votre demande
          </p>
        </CardHeader>
        <CardContent className="p-6 bg-white dark:bg-gray-800">
          {/* Liste des documents requis */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
              Documents nécessaires :
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
              {config.requiredDocuments.map((doc, index) => (
                <li key={index}>{doc}</li>
              ))}
            </ul>
          </div>

          {/* Uploader de documents */}
          <DocumentUploader
            files={files}
            onFilesChange={setFiles}
            maxFiles={10}
            maxSize={10}
            required={true}
          />
        </CardContent>
      </Card>

      {/* Boutons d'action */}
      <div className="flex justify-end gap-4 pt-6 border-t border-blue-200">
        <Button 
          type="button" 
          variant="outline"
          className="border-blue-300 text-blue-700 hover:bg-blue-50"
        >
          Annuler
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          {isLoading 
            ? 'Traitement en cours...' 
            : mode === 'create' 
              ? 'Soumettre la demande' 
              : 'Mettre à jour'
          }
        </Button>
      </div>
    </form>
  );
};