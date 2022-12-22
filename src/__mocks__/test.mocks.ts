
import { PaymentStatus } from '../models/paymentmethods';
import { Payment, TransactionType } from '../models/payment';

export const MOCK_CARD_PAYMENT_STRING = "customer_id,date,amount,card_id,card_status\n" +
    "123,2019-01-12,900,30,processed\n" +
    "123,2019-02-10,900,45,declined\n" +
    "456,2019-01-20,4200,10,processed";

export const MOCK_BANK_PAYMENT_STRING = "customer_id,date,amount,bank_account_id\n" +
    "789,2018-10-25,900,20\n" +
    "345,2018-11-03,900,60\n"


export const MOCK_PAYMENT_PARTIAL: Partial<Payment>[] = [
    { 
        fee: 0.5,
        customerId: 1,
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