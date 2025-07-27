'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Icon } from '@/components/ui/icon'
import { ServiceType } from '@/types/service-types'
import { serviceFormConfigs } from './service-form-configs'

interface ServiceFormRendererProps {
  serviceType: ServiceType
  onDataChange: (data: Record<string, any>) => void
  initialData?: Record<string, any>
}

export function ServiceFormRenderer({ serviceType, onDataChange, initialData = {} }: ServiceFormRendererProps) {
  const [formData, setFormData] = useState<Record<string, any>>(initialData)
  const config = serviceFormConfigs[serviceType]

  const form = useForm({
    defaultValues: initialData,
  })

  useEffect(() => {
    const subscription = form.watch((value) => {
      setFormData(value)
      onDataChange(value)
    })
    return () => subscription.unsubscribe()
  }, [form, onDataChange])

  if (!config) {
    return null
  }

  const renderField = (field: any) => {
    const fieldName = field.name
    
    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'number':
        return (
          <FormField
            key={fieldName}
            control={form.control}
            name={fieldName}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </FormLabel>
                <FormControl>
                  <Input
                    type={field.type}
                    placeholder={field.placeholder}
                    {...formField}
                  />
                </FormControl>
                {field.description && (
                  <p className="text-sm text-muted-foreground">{field.description}</p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        )

      case 'date':
        return (
          <FormField
            key={fieldName}
            control={form.control}
            name={fieldName}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...formField}
                  />
                </FormControl>
                {field.description && (
                  <p className="text-sm text-muted-foreground">{field.description}</p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        )

      case 'select':
        return (
          <FormField
            key={fieldName}
            control={form.control}
            name={fieldName}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </FormLabel>
                <Select onValueChange={formField.onChange} defaultValue={formField.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={field.placeholder} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {field.options?.map((option: any) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {field.description && (
                  <p className="text-sm text-muted-foreground">{field.description}</p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        )

      case 'textarea':
        return (
          <FormField
            key={fieldName}
            control={form.control}
            name={fieldName}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={field.placeholder}
                    className="min-h-[100px]"
                    {...formField}
                  />
                </FormControl>
                {field.description && (
                  <p className="text-sm text-muted-foreground">{field.description}</p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        )

      case 'checkbox':
        return (
          <FormField
            key={fieldName}
            control={form.control}
            name={fieldName}
            render={({ field: formField }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={formField.value}
                    onCheckedChange={formField.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </FormLabel>
                  {field.description && (
                    <p className="text-sm text-muted-foreground">{field.description}</p>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        )

      case 'radio':
        return (
          <FormField
            key={fieldName}
            control={form.control}
            name={fieldName}
            render={({ field: formField }) => (
              <FormItem className="space-y-3">
                <FormLabel>
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={formField.onChange}
                    defaultValue={formField.value}
                    className="flex flex-col space-y-1"
                  >
                    {field.options?.map((option: any) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value}>{option.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                {field.description && (
                  <p className="text-sm text-muted-foreground">{field.description}</p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        )

      default:
        return null
    }
  }

  const getServiceIcon = (serviceType: ServiceType) => {
    const icons: Record<ServiceType, string> = {
      [ServiceType.VISA]: 'passport',
      [ServiceType.BIRTH_ACT_APPLICATION]: 'file-text',
      [ServiceType.CONSULAR_CARD]: 'credit-card',
      [ServiceType.PASSPORT_RENEWAL]: 'refresh-cw',
      [ServiceType.CERTIFICATE_OF_LIFE]: 'heart',
      [ServiceType.POWER_OF_ATTORNEY]: 'file-signature',
      [ServiceType.MARRIAGE_CERTIFICATE]: 'heart-handshake',
      [ServiceType.DEATH_CERTIFICATE]: 'cross',
      [ServiceType.NATIONALITY_CERTIFICATE]: 'flag',
      [ServiceType.STUDENT_CERTIFICATE]: 'graduation-cap',
    }
    return icons[serviceType] || 'file'
  }

  const getServiceTitle = (serviceType: ServiceType) => {
    const titles: Record<ServiceType, string> = {
      [ServiceType.VISA]: 'Informations Visa',
      [ServiceType.BIRTH_ACT_APPLICATION]: 'Informations Acte de Naissance',
      [ServiceType.CONSULAR_CARD]: 'Informations Carte Consulaire',
      [ServiceType.PASSPORT_RENEWAL]: 'Informations Renouvellement Passeport',
      [ServiceType.CERTIFICATE_OF_LIFE]: 'Informations Certificat de Vie',
      [ServiceType.POWER_OF_ATTORNEY]: 'Informations Procuration',
      [ServiceType.MARRIAGE_CERTIFICATE]: 'Informations Certificat de Mariage',
      [ServiceType.DEATH_CERTIFICATE]: 'Informations Certificat de Décès',
      [ServiceType.NATIONALITY_CERTIFICATE]: 'Informations Certificat de Nationalité',
      [ServiceType.STUDENT_CERTIFICATE]: 'Informations Certificat Étudiant',
    }
    return titles[serviceType] || 'Informations Spécifiques'
  }

  return (
    <Form {...form}>
      <div className="space-y-6">
        {config.sections.map((section, sectionIndex) => (
          <Card key={sectionIndex} className="border-l-4 border-l-yellow-500">
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-blue-50">
              <CardTitle className="flex items-center space-x-2">
                <Icon name={getServiceIcon(serviceType)} className="w-5 h-5 text-yellow-600" />
                <span className="text-blue-900">
                  {section.title || getServiceTitle(serviceType)}
                </span>
              </CardTitle>
              {section.description && (
                <p className="text-sm text-blue-700 mt-1">{section.description}</p>
              )}
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.fields.map((field) => (
                  <div key={field.name} className={field.fullWidth ? 'md:col-span-2' : ''}>
                    {renderField(field)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Form>
  )
}