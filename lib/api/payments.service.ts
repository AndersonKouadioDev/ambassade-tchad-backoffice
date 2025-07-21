import { api } from '@/lib/api-http';

// Types pour les paiements KKiaPay
export interface PaymentVerificationData {
  transactionId: string;
  amount: number;
  requestId?: string;
}

export interface PaymentRefundData {
  transactionId: string;
  amount: number;
  reason?: string;
}

export interface PaymentVerificationResponse {
  success: boolean;
  transaction: {
    transactionId: string;
    amount: number;
    currency: string;
    status: 'SUCCESS' | 'FAILED' | 'PENDING';
    customer: {
      phone: string;
      email?: string;
      name?: string;
    };
    createdAt: string;
    updatedAt: string;
  };
  message: string;
}

export interface PaymentRefundResponse {
  success: boolean;
  refund: {
    transactionId: string;
    refundAmount: number;
    status: 'SUCCESS' | 'FAILED' | 'PENDING';
    reason?: string;
    createdAt: string;
  };
  message: string;
}

// Service de gestion des paiements KKiaPay
export class PaymentsService {
  // Vérifier un paiement KKiaPay
  static async verifyPayment(verificationData: PaymentVerificationData): Promise<PaymentVerificationResponse> {
    const { data } = await api.post('/kkiapay/verify', verificationData);
    return data;
  }

  // Rembourser un paiement KKiaPay
  static async refundPayment(refundData: PaymentRefundData): Promise<PaymentRefundResponse> {
    const { data } = await api.post('/kkiapay/refund', refundData);
    return data;
  }

  // Obtenir le statut d'une transaction
  static async getTransactionStatus(transactionId: string): Promise<PaymentVerificationResponse> {
    const { data } = await api.get(`/kkiapay/status/${transactionId}`);
    return data;
  }
}