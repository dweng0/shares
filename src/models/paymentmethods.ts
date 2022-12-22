enum PaymentStatus { 
    pending = 'pending',
    rejected = 'rejected',
    processed = 'processed'
}

interface PaymentMetaData {
    id: number;
    status: PaymentStatus;
}

interface BankTransfer extends PaymentMetaData {}

interface Card extends PaymentMetaData {}