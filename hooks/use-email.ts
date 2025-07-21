import { useMutation, useQuery } from '@tanstack/react-query';
import { EmailService, type SendEmailData } from '@/lib/api';
import { toast } from 'sonner';

// Clés de requête pour les emails
export const emailKeys = {
  all: ['email'] as const,
  templates: () => [...emailKeys.all, 'templates'] as const,
};

// Hook pour obtenir les templates d'emails
export function useEmailTemplates() {
  return useQuery({
    queryKey: emailKeys.templates(),
    queryFn: () => EmailService.getEmailTemplates(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

// Hook pour envoyer un email
export function useSendEmail() {
  return useMutation({
    mutationFn: (emailData: SendEmailData) => EmailService.sendEmail(emailData),
    onSuccess: (result) => {
      if (result.success) {
        toast.success('Email envoyé avec succès');
      } else {
        toast.error('Échec de l\'envoi de l\'email');
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'envoi de l\'email');
    },
  });
}

// Hook pour envoyer un email avec template
export function useSendEmailWithTemplate() {
  return useMutation({
    mutationFn: ({ templateId, variables, to }: { 
      templateId: string; 
      variables: Record<string, string>; 
      to: string | string[] 
    }) => EmailService.sendEmailWithTemplate(templateId, variables, to),
    onSuccess: (result) => {
      if (result.success) {
        toast.success('Email envoyé avec succès');
      } else {
        toast.error('Échec de l\'envoi de l\'email');
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'envoi de l\'email');
    },
  });
}