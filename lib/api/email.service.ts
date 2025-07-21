import { api } from '@/lib/api-http';

// Types pour l'envoi d'emails
export interface SendEmailData {
  to: string | string[];
  subject: string;
  body: string;
  isHtml?: boolean;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: {
    filename: string;
    content: string; // Base64 encoded
    contentType?: string;
  }[];
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SendEmailResponse {
  success: boolean;
  messageId: string;
  message: string;
}

// Service de gestion des emails
export class EmailService {
  // Envoyer un email
  static async sendEmail(emailData: SendEmailData): Promise<SendEmailResponse> {
    const { data } = await api.post('/email/send', emailData);
    return data;
  }

  // Obtenir les templates d'emails disponibles
  static async getEmailTemplates(): Promise<EmailTemplate[]> {
    const { data } = await api.get('/email/templates');
    return data;
  }

  // Envoyer un email avec template
  static async sendEmailWithTemplate(templateId: string, variables: Record<string, string>, to: string | string[]): Promise<SendEmailResponse> {
    const { data } = await api.post('/email/send-template', {
      templateId,
      variables,
      to
    });
    return data;
  }
}