import { Payment } from '../models/payment';
import { byPendingPayment } from '../services/helpers';
import { getRandomInt } from '../__mocks__/demo_mocks';
/**
 * IT: returns a promise that resolves when all pending bank transfers are complete
 */
export const getBankTransferResult = (payment: Payment): Promise<Payment> => {    
    // This is a MOCK that pretends to wait some time before reolving the promise and updating the payment method to processed
    //fetch(`api/thing').then(res => res.json())    
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('Bank transfer ' + payment.transactionDetails.bankTransfer.id + ' is complete')
            payment.transactionDetails.bankTransfer.status = PaymentStatus.processed;
            resolve(payment);
        }, getRandomInt(500, 5000));
    });
}

/**
 * IT: uses a promise all and calls getBankTransferResult for each pending bank transfer
 * @param payments 
 */
export const getBankTransferResults = (payments: Payment[]): Promise<Payment[]> => {
    const pendingBankTransfers = payments.filter(byPendingPayment);
    console.log('There are ' + pendingBankTransfers.length + ' pending bank transfers')
    return Promise.all(pendingBankTransfers.map(getBankTransferResult));
}
