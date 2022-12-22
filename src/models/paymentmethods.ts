export enum PaymentStatus { 
    pending = 'pending',
    rejected = 'declined',
    processed = 'processed'
}

interface PaymentMetaData {
    id: number;
    status: PaymentStatus;
}

export interface BankTransfer extends PaymentMetaData {}
export interface Card extends PaymentMetaData {}