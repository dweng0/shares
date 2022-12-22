import { Payment, TransactionType, TransactionDetails } from '../models/payment';


/**
 * Filter method that returns true if the payment is a bank transfer
 * @param payment 
 * @returns Payment[]
 */
export const byBankTransfers = (payment: Payment) => payment.transactionDetails.transactionType === TransactionType.BANK_TRANSFER;

/**
 * Filter method that returns true if the payment is a card payment
 * @param payment 
 * @returns Payment[]
 */
export const byCardPayments = (payment: Payment) => payment.transactionDetails.transactionType === TransactionType.CARD;

/**
 * Filter method that returns based on pending payment flag
 * @param payment 
 * @returns Payment[]
 */
export const byPendingPayment = (payment: Payment) => (payment.transactionDetails.transactionType === TransactionType.CARD) 
? payment.transactionDetails.card.status ===  PaymentStatus.pending
: payment.transactionDetails.bankTransfer.status ===  PaymentStatus.pending;

export const byNotPendingPayment = (payment: Payment) => (payment.transactionDetails.transactionType === TransactionType.CARD) 
? payment.transactionDetails.card.status !==  PaymentStatus.pending
: payment.transactionDetails.bankTransfer.status !==  PaymentStatus.pending;

export const byprocessedPayment = (payment: Payment) => (payment.transactionDetails.transactionType === TransactionType.CARD)
? payment.transactionDetails.card.status === PaymentStatus.processed
: payment.transactionDetails.bankTransfer.status ===  PaymentStatus.processed;

/**
 * IT: returns the Transaction type based on the payment header provided
 * @param header 
 * @returns {@see TransactionType}
 */
export const getPaymentType = (header: string): TransactionType => {
    const columns = header.split(',');
    switch (columns[3]) { 
        case 'card_id':
            return TransactionType.CARD;
        case 'bank_account_id':
            return TransactionType.BANK_TRANSFER;
        default:
            return TransactionType.CARD;
    }
}

/**
 * IT: Builds transaction details 
 * @param paymentType the type of transaction {@see TransactionType}
 * @param columns The columns for this row of items.
 * @returns {@see TransactionDetails}
 */
export const buildTransactionDetails = (paymentType: TransactionType, columns: string[]): TransactionDetails => {
    if(paymentType === TransactionType.CARD) {
        return {
            transactionType: TransactionType.CARD,
            card: {
                id: Number(columns[3]),
                status: columns[4] as PaymentStatus
            }
        }
    } 
    // if its a bank transfer, set the status to pending
    return {
        transactionType: TransactionType.BANK_TRANSFER,
        bankTransfer: {
            id: Number(columns[3]),
            status: PaymentStatus.pending
        }
}
}