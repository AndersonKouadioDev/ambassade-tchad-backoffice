import { DocumentJustificationType } from "./carte-consulaire.type ";


export interface IProcurationDetails {
    id: string;
    requestId: string;
    agentFirstName: string;
    agentLastName: string;
    agentJustificationDocumentType?: DocumentJustificationType;
    agentIdDocumentNumber?: string;
    agentAddress?: string;
    principalFirstName: string;
    principalLastName: string;
    principalJustificationDocumentType?: DocumentJustificationType;
    principalIdDocumentNumber?: string;
    principalAddress?: string;
    powerOfType?: string;
    reason?: string;
    createdAt: Date;
    updatedAt: Date;
}
