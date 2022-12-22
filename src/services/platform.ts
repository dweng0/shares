import BigNumber from "bignumber.js";
import { Payment } from "../models/payment";
import { byBankTransfers, byCardPayments, byNotPendingPayment, byPendingPayment } from "./helpers";
import { getRandomInt } from '../__mocks__/demo_mocks';
import { DEFAULT_SHARES_FILENAME } from '../constants';
import { exportToCsv, getPaymentsFromCSV } from '../controller/io';

/**
 * Platform service
 * 
 * @param csv_path 
 * @param source 
 * @param share_price 
 * @returns 
 */
export const platform = async (csv_path: string, share_price: BigNumber) => {

    // Step 1: Read CSV file
    const payments = await getPaymentsFromCSV(csv_path)

    // Step 2: Filter payments
    const cardPayments = payments.filter(byCardPayments)
    const bankTransferPayments = payments.filter(byBankTransfers);

    // Step 3: Wait for pending bank transfers to complete
    const processedBankTransferPayments =  await getBankTransferResults(bankTransferPayments.filter(byPendingPayment));

    // Step 4: Spread all results back into a single array
    const processedPayments = [
        ...cardPayments.filter(byNotPendingPayment), 
        ...bankTransferPayments.filter(byNotPendingPayment), 
        ...processedBankTransferPayments];

    // Step 5: Generate share orders
    const shareOrders = generateShareOrders(processedPayments, share_price);

    // Step 6: Write share orders to CSV file
    const success = exportToCsv(shareOrders, DEFAULT_SHARES_FILENAME, ['customer_id', 'shares']);
    if(success) {
        console.log('Share orders exported to CSV file');
    } else {
        console.log('Failed to export share orders to CSV file');
    }
    return;
}

/**
 * IT: returns a promise that resolves when all pending bank transfers are complete
 */
const getBankTransferResult = (payment: Payment): Promise<Payment> => {    
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
const getBankTransferResults = (payments: Payment[]): Promise<Payment[]> => {
    const pendingBankTransfers = payments.filter(byPendingPayment);
    console.log('There are ' + pendingBankTransfers.length + ' pending bank transfers')
    return Promise.all(pendingBankTransfers.map(getBankTransferResult));
}

/**
 * Builds the share hashmap
 * @param processedPayments list of processed payments {@see Payment} 
 * @param share_price
 * @returns 
 */
const generateShareOrders = (processedPayments: Payment[], share_price: BigNumber): Record<string, number>=> {
    const shareOrders: Record<string, number> = {};
    
    return processedPayments.reduce((acc, payment, currentIndex) => {      
        if(!acc[payment.customerId]) {
            acc[payment.customerId] = 0;
        }

        console.log(`Building shares ~${(currentIndex / processedPayments.length) * 100})% complete`);
        
        // take the current shares and add this payments' shares to it.
        const additionalShares = payment.amount.dividedBy(share_price).plus(acc[payment.customerId]);
        acc[payment.customerId] = additionalShares.toNumber();
        return acc;
    }, shareOrders);
}

/**
 * Write a new csv file that prints out Record<string, number>, with headers "customer_id", "shares"
 */
export const writeToCSV = (shares: Record<string, number>, fileName): Promise<boolean> => { 


}
