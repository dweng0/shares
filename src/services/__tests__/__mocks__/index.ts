import { PaymentStatus } from '../../../models/paymentmethods';
import { Payment, TransactionType } from '../../../models/payment';

export const MOCK_PAYMENT_PARTIAL: Partial<Payment>[] = [
    { 
        transactionDetails: {
            transactionType: TransactionType.BANK_TRANSFER,
            bankTransfer: {
                id: 1,
                status: PaymentStatus.pending
            }
        }
    },
    { 
        transactionDetails: {
            transactionType: TransactionType.CARD,
            card: {
                id: 2,
                status: PaymentStatus.rejected
            }
        }
    },
    { 
        transactionDetails: {
            transactionType: TransactionType.BANK_TRANSFER,
            bankTransfer: {
                id: 3,
                status: PaymentStatus.pending
            }
        }
    },
    { 
        transactionDetails: {
            transactionType: TransactionType.CARD,
            card: {
                id: 4,
                status: PaymentStatus.processed
            }
        }
    },
    { 
        transactionDetails: {
            transactionType: TransactionType.BANK_TRANSFER,
            bankTransfer: {
                id: 5,
                status: PaymentStatus.processed
            }
        }
    },
];

export const MOCK_ROW_BANK_PAYMENT =  ["789","2018-10-25","900","20"]
export const MOCK_ROW_CARD_PAYMENT =  ["123","2019-01-12","900","30","processed"]