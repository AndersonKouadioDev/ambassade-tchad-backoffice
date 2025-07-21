import { useMutation } from '@tanstack/react-query';
import { PaymentsService, type PaymentVerificationData, type PaymentRefundData } from '@/lib/api';
import { toast } from 'sonner';

// Hook pour vérifier un paiement KKiaPay
export function useVerifyPayment() {
  return useMutation({
    mutationFn: (verificationData: PaymentVerificationData) => 
      PaymentsService.verifyPayment(verificationData),
    onSuccess: (result) => {
      if (result.success) {
        toast.success('Paiement vérifié avec succès');
      } else {
        toast.error('Échec de la vérification du paiement');
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la vérification du paiement');
    },
  });
}

// Hook pour rembourser un paiement KKiaPay
export function useRefundPayment() {
  return useMutation({
    mutationFn: (refundData: PaymentRefundData) => 
      PaymentsService.refundPayment(refundData),
    onSuccess: (result) => {
      if (result.success) {
        toast.success('Remboursement traité avec succès');
      } else {
        toast.error('Échec du remboursement');
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors du remboursement');
    },
  });
}

// Hook pour obtenir le statut d'une transaction
export function useGetTransactionStatus() {
  return useMutation({
    mutationFn: (transactionId: string) => 
      PaymentsService.getTransactionStatus(transactionId),
    onSuccess: (result) => {
      toast.success(`Statut de la transaction: ${result.transaction.status}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la récupération du statut');
    },
  });
}