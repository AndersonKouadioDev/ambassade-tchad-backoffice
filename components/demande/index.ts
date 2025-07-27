// Export des formulaires
export { GenericDemandForm } from './forms/generic-demand-form';
export { SERVICE_FORM_CONFIGS } from './forms/service-form-configs';

// Export des composants d'upload
export { DocumentUploader } from './upload/document-uploader';
export { DocumentPreview } from './upload/document-preview';

// Export des modales
export { DemandFormModal } from './modals/demand-form-modal';
export { DemandViewModal } from './modals/demand-view-modal';

// Export des composants existants (rétrocompatibilité)
export { default as DemandedList } from './demande-list';
export { default as ViewDemand } from './demande-modal/view-demand';
export { default as EditDemand } from './demande-modal/edit-demand';

// Export des types
export type {
  ServiceType,
  RequestStatus,
  Request,
  CreateRequestData,
  UpdateStatusData,
  ServiceFormConfig,
  FormField,
  FormSection
} from '../../types/demande.types';

export {
  SERVICE_LABELS,
  STATUS_LABELS,
  STATUS_COLORS,
  ServiceType as ServiceTypeEnum,
  RequestStatus as RequestStatusEnum
} from '../../types/demande.types';